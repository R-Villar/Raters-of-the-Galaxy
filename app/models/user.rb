class User < ApplicationRecord
    has_many :posts 
    has_many :comics, through: :posts
end