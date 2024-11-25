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

    instance.start_thread unless @thread.present? && @thread.alive?
    instance.connection_queue << connection
  end

  def self.active_connection_ids
    instance.active_connection_ids
  end

  def start_thread
    @thread = Thread.new do
      conn = ActiveRecord::Base.connection.raw_connection # connect to database
      conn.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

      connections = []

      loop do
        # 1) ensure connections are added and cleaned up
        connections = prepare_connections(connections)
        @active_connection_ids = connections.map(&:id).uniq
        #@thread.exit if connections.empty?

        # 2. process pg noticifactions
        # returns the channel name if message received within timeout, else nil
        conn.wait_for_notify(30) do |_channel, _pid, payload|
          message = Message.from_json(JSON.parse(payload.to_s))

          connections.each do |connection|
            connection.write(message)
          rescue IOError, SocketError, Errno::EPIPE, Errno::ECONNRESET
            connection.close
            next
          end
          # 3. if no message came through, check if any connections have been disconnected
        end || connections.each do |connection|
          connection.check_if_alive
        rescue IOError, SocketError, Errno::EPIPE, Errno::ECONNRESET
          connection.close
          next
        end
      end
    end
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
end
