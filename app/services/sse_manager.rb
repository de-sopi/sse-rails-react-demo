# frozen_string_literal: true

module SseManager
  @connection_queue = Queue.new
  @thread = nil
  @chatrooms = []

  def self.chatrooms
    @chatrooms
  end

  def start_background_thread
    return if @thread&.alive?

    @thread = Thread.new do
      conn = ActiveRecord::Base.connection.raw_connection # connect to database
      conn.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

      connections ||= []
      connections << connection_queue.pop until @connection_queue.empty?
      connections = connections.reject(&:inactive?)
      @chatrooms = connections.map(:connection_id)

      loop do
        conn.wait_for_notify do |_channel, _pid, payload|
          message = Message.new(JSON.parse(payload))

          connections.select { |connection| connection.id == message.connection_id }.each do
            connection.sse.write({ message: message.message, user: message.user })
            connection.last_updated = Time.now
          rescue StandardError
            connection.sse.close
          end
        end
      end
    end
  end

  def add_connection(connection)
    return unless connection.is_a?(Connection)

    @connection_queue << connection
  end
end