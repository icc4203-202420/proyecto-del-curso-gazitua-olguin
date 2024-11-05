class UserPushToken < ApplicationRecord
  belongs_to :user
  validates :push_token, presence: true, uniqueness: true
end
