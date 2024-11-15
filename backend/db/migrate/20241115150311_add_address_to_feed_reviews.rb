class AddAddressToFeedReviews < ActiveRecord::Migration[7.1]
  def change
    add_column :feed_reviews, :address, :string
  end
end
