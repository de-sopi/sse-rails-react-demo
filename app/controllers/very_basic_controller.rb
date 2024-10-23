# frozen_string_literal: true

# thanks to https://pragmaticpineapple.com/using-server-sent-events-to-stream-data-in-rails/
class VeryBasicController < ApplicationController
  include ActionController::Live

  def show
    response.headers['Content-Type'] = 'text/event-stream'
    response.headers['Last-Modified'] = Time.now.httpdate
    sse = SSE.new(response.stream, event: 'message')
    sse.write({ message: Time.zone.now })
  ensure
    sse.close
  end
end
