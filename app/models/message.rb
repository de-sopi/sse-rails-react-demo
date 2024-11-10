# frozen_string_literal: true

class Message
  attr_accessor :connection_id, :user, :message, :time

  def initialize(hash)
    hash = hash.stringify_keys
    @connection_id = hash['connection_id']
    @user = hash['user']
    @message = hash['message']
    @time = Time.now.to_i
  end

  def send
    ActiveRecord::Base.connection.execute("NOTIFY chat_messages, #{ActiveRecord::Base.connection.quote(to_json)}")
  end
end
