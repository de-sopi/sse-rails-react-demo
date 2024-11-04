# frozen_string_literal: true

# thanks to https://pragmaticpineapple.com/using-server-sent-events-to-stream-data-in-rails/
module Api
  class TimeController < ApplicationController
    include ActionController::Live # include this to use the SSE object

    def show
      response.headers['Content-Type'] = 'text/event-stream' # make sure we provide the right response format
      sse = SSE.new(response.stream, event: 'message') # define the event, most commonly message
      loop do
        sse.write(Time.now.strftime('%H:%M:%S')) # get current time and write it to stream
        sleep 1
      end
    rescue StandardError => e
      Rails.logger.error 'closed sse due to an error'
      Rails.logger.error e
      sse.close
    ensure
      sse.close # make sure we don't have too many connections open (keep this in mind for later)
    end
  end
end
