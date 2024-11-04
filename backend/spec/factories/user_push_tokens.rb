FactoryBot.define do
  factory :user_push_token do
    user { nil }
    push_token { "MyString" }
  end
end
