# frozen_string_literal: true

class Connection
  attr_accessor :stream, :id, :user

  delegate :close, :closed?, to: :@stream

  def initialize(stream, id)
    @stream = stream
    @id = id
  end

  def write(message)
    return if closed?
    return if message.connection_id.present? && message.connection_id != id

    stream.write("event: #{message.event}\ndata: #{JSON.generate(message.data)}\n\n")
  end

  def move_to_connection_thread
    SseManager.add_connection(self)
  end

  def check_if_alive
    stream.write("event: heartbeat\ndata:alive\n\n")
  end
end
