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
    json_data = message.to_json.gsub("\n", '\\n')
    stream.write("data: #{json_data}\n\n")

    @last_update = Time.now
  end

  def inactive?
    closed? || Time.now - @last_updated > 10 * 60 * 60
  end

  def move_to_connection_thread
    SseManager.add_connection(self)
  end
end
