# frozen_string_literal: true

# thanks to https://pragmaticpineapple.com/using-server-sent-events-to-stream-data-in-rails/
module Api
  class TimeController < ApplicationController
    def show

      request.env['rack.hijack'].call
      stream = request.env['rack.hijack_io']
      send_headers(stream)
      Thread.new do
        loop do
          stream.write("event: message\ndata: #{Time.now.strftime('%H:%M:%S')}\n\n") # get current time and write it to stream
          sleep 1
        rescue  StandardError
          stream.close
        end
      end

      response.close
    rescue StandardError => e
      Rails.logger.error 'closed sse due to an error'
      Rails.logger.error e
    end

    private

    def send_headers(stream)
      headers = [
        "HTTP/1.1 200 OK",
        "Content-Type: text/event-stream"
      ]
      stream.write(headers.map { |header| header + "\r\n" }.join)
      stream.write("\r\n")
      stream.flush
    rescue
      stream.close
      raise
    end
  end
end
