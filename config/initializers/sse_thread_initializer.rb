# frozen_string_literal: true

Rails.application.configure do
  config.after_initialize do
    SseManager.start_background_thread
  end
end

