FactoryBot.define do
  factory :feed_post do
    user { nil }
    event { nil }
    image_url { "MyString" }
    description { "MyText" }
    tagged_users { "MyText" }
    event_name { "MyString" }
    bar_name { "MyString" }
    country { "MyString" }
  end
end
