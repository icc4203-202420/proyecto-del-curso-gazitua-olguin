# app/models/tagging.rb
class Tagging < ApplicationRecord
    belongs_to :user
    belongs_to :event_picture
  end
  