# frozen_string_literal: true

module SseManager
  @connection_queue = Queue.new
  @thread = nil
  @active_connection_ids = []

  def self.active_connection_ids
    @active_connection_ids
  end

  def self.start_thread
    @thread = Thread.new do
      conn = ActiveRecord::Base.connection.raw_connection # connect to database
      conn.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

      connections = []

      loop do
        # 1) ensure connections are added and cleaned up
        connections = prepare_connections(connections)
        @active_connection_ids = connections.map(&:id)
        Thread.exit if connections.empty?

        # 2. process pg noticifactions
        # returns the channel name if message received within timeout, else nil
        conn.wait_for_notify(30) do |_channel, _pid, payload|
          message = Message.from_json(JSON.parse(payload.to_s))
          connections = connections.select { |c| message.connection_id == c.id } unless message.connection_id.nil?

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
        end
      end
    end
  end

  def self.add_connection(connection)
    return unless connection.is_a?(Connection)

    start_thread unless @thread&.alive?
    @connection_queue << connection
  end

  def self.prepare_connections(connections)
    connections << @connection_queue.pop until @connection_queue.empty?
    connections.reject!(&:closed?)

    connections
  end
end
