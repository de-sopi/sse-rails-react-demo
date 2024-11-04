# frozen_string_literal: true

class Message
  attr_accessor :connection_id, :user, :message

  def initialize(hash)
    @connection_id = hash[:connection_id]
    @user = hash[:user]
    @message = hash[:message]
  end

  def send
    ActiveRecord::Base.connection.execute("NOTIFY chat_messages, #{to_json}")
  end
end
