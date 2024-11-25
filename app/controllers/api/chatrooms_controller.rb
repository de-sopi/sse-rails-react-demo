# frozen_string_literal: true

# thanks to https://blog.chumakoff.com/en/posts/rails_sse_rack_hijacking_api
# i will apply a full rack hijack in this example, for differences to partial hijack check the above link
module Api
  class ChatroomsController < ApplicationController
    include RailsSseManager::CreateStream

    def index
      render json: ::RailsSseManager::EventStreamManager.active_stream_ids
    end

    def show
      return head bad_request unless chatroom_id

      create_stream(chatroom_id)
    end

    private

    def chatroom_id
      @chatroom_id = params[:chatroom_id]
    end
  end
end
