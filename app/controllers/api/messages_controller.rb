# frozen_string_literal: true

module Api
  class MessagesController < ApplicationController
    skip_forgery_protection

    def create
      message = Message.new(params)
      message.send
      head :ok
    end
  end
end
