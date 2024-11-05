FactoryBot.define do
  factory :pending_notification do
    user { nil }
    title { "MyString" }
    body { "MyString" }
    data { "" }
  end
end
