# frozen_string_literal: true

module SseManager
  @connection_queue = Queue.new
  @thread = nil
  @chatrooms = []

  def self.chatrooms
    @chatrooms
  end

  def self.start_background_thread
    return if @thread&.alive?

    @thread = Thread.new do
      conn = ActiveRecord::Base.connection.raw_connection # connect to database
      conn.async_exec('LISTEN chat_messages') # listen to data sent in the chat_messages_channel

      connections = []

      loop do
        conn.wait_for_notify do |_channel, _pid, payload|
          connections << @connection_queue.pop until @connection_queue.empty?
          connections = connections.reject(&:inactive?)
          @chatrooms = connections.map(&:id)

          message = Message.new(JSON.parse(payload.to_s))

          connections.select { |connection| connection.id == message.connection_id }.each do |connection|
            connection.write({ message: message.message, user: message.user })
          rescue StandardError => e
            Rails.logger.error e
            connection.close
            next
          end
        end
      end
    end
  end

  def self.add_connection(connection)
    return unless connection.is_a?(Connection)

    @connection_queue << connection
  end
end
