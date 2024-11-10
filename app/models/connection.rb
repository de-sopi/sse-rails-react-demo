# frozen_string_literal: true

class Connection
  attr_accessor :stream, :id, :user

  delegate :close, :closed?, to: :@stream

  def initialize(stream, id, user)
    @stream = stream
    @id = id
    @user = user
    @last_updated = Time.now
  end

  def write(message)
    stream.write("event: #{message.event}\ndata: #{JSON.generate(message.data)}\n\n")

    @last_update = Time.now
  end

  def inactive?
    close if Time.now - @last_updated > 10 * 60 * 60
    closed?
  end

  def move_to_connection_thread
    SseManager.add_connection(self)
  end
end
