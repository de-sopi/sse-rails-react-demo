# frozen_string_literal: true

module Api
  class MessagesController < ApplicationController
    skip_forgery_protection

    def create
      data = {
        message: params[:message],
        time: Time.now.to_i,
        user: params[:user]
      }

      event = RailsSseManager::Event.new(event: :chat_message, connection_id: params[:connection_id], data: data)
      event.send
      head :ok
    end
  end
end
