# frozen_string_literal: true

# thanks to https://blog.chumakoff.com/en/posts/rails_sse_rack_hijacking_api
# i will apply a full rack hijack in this example, for differences to partial hijack check the above link
module Api
  class ChatroomsController < ApplicationController
    include SseManager

    def index
      render json: SseManager.chatrooms
    end

    def show
      return head bad_request unless chatroom_id

      request.env['rack.hijack'].call
      stream = request.env['rack.hijack_io']

      send_headers(stream)
      connection = Connection.new(stream, chatroom_id)
      connection.move_to_connection_thread
      head :ok
    end

    private

    def chatroom_id
      @chatroom_id = params[:chatroom_id]
    end

    def send_headers(stream)
      headers = [
        'HTTP/1.1 200 OK',
        'Content-Type: text/event-stream',
        'Connection: keep-alive'
      ]
      stream.write(headers.map { |header| "#{header}\r\n" }.join)
      stream.write("\r\n")
      stream.flush
    rescue StandardError => e
      Rails.logger.error e
      stream.close
      raise e
    end
  end
end
