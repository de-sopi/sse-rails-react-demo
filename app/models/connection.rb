# frozen_string_literal: true

class Connection
  attr_accessor :sse_connection, :id

  def initialize(sse_connection, id)
    @sse_connection = sse_connection
    @id = id
    @last_updated = Time.now
  end

  def inactive?
    sse_connection.closed? || Time.now - last_updated > 10 * 60 * 60
  end
end
