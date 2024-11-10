# frozen_string_literal: true

class Message
  attr_accessor :connection_id, :data, :event

  def self.from_json(hash)
    hash = hash.deep_symbolize_keys

    Message.new(
      event: hash[:event],
      connection_id: hash[:connection_id],
      data: hash[:data]
    )
  end

  def initialize(event:, data:, connection_id: nil)
    @event = event
    @connection_id = connection_id
    @data = data
  end

  def send
    ActiveRecord::Base.connection.execute("NOTIFY chat_messages, #{ActiveRecord::Base.connection.quote(to_json)}")
  end
end
