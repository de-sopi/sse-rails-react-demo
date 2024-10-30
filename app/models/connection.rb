# frozen_string_literal: true

class Connection
  attr_accessor :sse_connection, :id

  def initialize(sse_connection, id)
    @sse_connection = sse_connection
    @id = id
  end
end
