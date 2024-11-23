# frozen_string_literal: true

module SseManager
  @connection_queue = Queue.new
  @thread = nil
  @chatrooms = []

  def self.chatrooms
    @chatrooms
  end

  def self.start_thread
    @thread = Thread.new do
      conn = ActiveRecord::Base.connection.raw_connection # connect to database
      conn.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

      connections = []
      send_heartbeat = false

      loop do
        connections << @connection_queue.pop until @connection_queue.empty?
        if send_heartbeat
          connections.each do |connection|
            connection.check_if_alive
          rescue IOError, SocketError, Errno::EPIPE, Errno::ECONNRESET
            connection.close
          end
        end
        connections.reject!(&:closed?)

        @chatrooms = chatrooms.intersection(connections.map(&:id))
        Thread.exit if connections.empty?

        send_heartbeat = true
        conn.wait_for_notify(30) do |_channel, _pid, payload|
          message = Message.from_json(JSON.parse(payload.to_s))
          Rails.logger.info message

          connections.each do |connection|
            connection.write(message) if message.connection_id == connection.id || message.connection_id.nil?
          rescue IOError, SocketError, Errno::EPIPE, Errno::ECONNRESET
            next
          end
          send_heartbeat = false
        end
      end
    end
  end

  def self.add_connection(connection)
    return unless connection.is_a?(Connection)

    self.start_thread unless @thread&.alive?

    Message.new(connection_id: connection.id, event: 'connection established', data: 'welcome!').send
    @chatrooms << connection.id unless @chatrooms.include?(connection.id)
    @connection_queue << connection
  end

  def self.prepare_connections(connections)
    connections << @connection_queue.pop until @connection_queue.empty?
    connections.each(&:check_if_alive)
    connections.reject!(&:closed?)

    @chatrooms = chatrooms.intersection(connections.map(&:id))

    connections
  end
end
