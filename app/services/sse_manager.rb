# frozen_string_literal: true

class SseManager
  private_class_method :new
  attr_reader :active_connection_ids, :connection_queue

  @instance_mutex = Mutex.new

  def self.instance
    @instance_mutex.synchronize do
      @instance ||= new
    end
  end

  def self.add_connection(connection)
    return unless connection.is_a?(Connection)

    instance.connection_queue << connection
    instance.start_thread unless instance.thread_alive?
  end

  def self.active_connection_ids
    instance.active_connection_ids
  end

  def start_thread
    @thread_alive = true
    Thread.new do
      ActiveRecord::Base.connection_pool.with_connection do |conn|
        conn.raw_connection.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

        connections = []

        loop do
          # 1) ensure connections are added and cleaned up
          connections = prepare_connections(connections)
          @active_connection_ids = connections.map(&:id).uniq
          if connections.empty?
            @thread_alive = false
            Thread.current.exit
          end
          @thread.exit if connections.empty?

          # 2. process pg noticifactions
          # returns the channel name if message received within timeout, else nil
          conn.raw_connection.wait_for_notify(30) do |_channel, _pid, payload|
            message = Message.from_json(JSON.parse(payload.to_s))

            io_for_each_connection(connections) do |connection|
              connection.write(message)
            end
            # 3. if no message came through, check if any connections have been disconnected
          end || io_for_each_connection(connections, &:check_if_alive)
        end
      end
    end
  end

  def thread_alive?
    @thread_alive || false
  end

  private

  def initialize
    @connection_queue = Queue.new
    @thread = nil
    @active_connection_ids = []
  end

  def prepare_connections(connections)
    if connection_queue.size.positive? # rubocop:disable Style/IfUnlessModifier
      connections << @connection_queue.pop until @connection_queue.empty?
    end

    connections.reject!(&:closed?)

    connections
  end

  def io_for_each_connection(connections)
    connections.each do |connection|
      yield(connection) if block_given?
    rescue IOError, SocketError, Errno::EPIPE, Errno::ECONNRESET
      connection.close
      next
    end
  end
end
