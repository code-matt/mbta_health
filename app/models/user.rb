class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    record.errors.add attribute, (options[:message] || "is not valid email format") unless
      value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
  end
end

class User < ActiveRecord::Base
  has_secure_password

  validates :email, :password, presence: true
  validates :email, uniqueness: true
  validates :email, email: true
  validates :password, length: { minimum: 7 }
end