# frozen_string_literal: true

module Api
  class ChatroomsController < ApplicationController
    def show; end

    private

    def chatroom_id
      @chatroom_id = params[:chatroom_id]
    end
  end
end
