class CreatePendingNotifications < ActiveRecord::Migration[7.1]
  def change
    create_table :pending_notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.string :body
      t.json :data

      t.timestamps
    end
  end
end
