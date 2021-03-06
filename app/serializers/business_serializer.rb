class BusinessSerializer < ActiveModel::Serializer

  attributes :id, :name, :address, :coordinates, :links, :slug, :restriction_type, :notes

  def coordinates
    {
      lat: object.lat,
      lng: object.lng
    }
  end

  def links
    {
      website: object.website,
      facebook: object.facebook,
      twitter: object.twitter,
      yelp: object.yelp
    }
  end
end
