class BusinessesController < ApplicationController
  before_filter :authenticate_user!, only: [:create, :update]

  def index
    @businesses = Location.friendly.find(params[:location_id]).businesses

    render json: @businesses, each_serializer: BusinessSerializer
  end

  def show
    render json: Business.friendly.find(params[:id]), serializer: BusinessSerializer
  end

  def create
    @business = Business.new(business_params)
    @location = Location.find_by(city: params[:business][:location]) || Location.create_and_geocode(params[:business][:location])
    @business.location = @location

    if @business.save
      render json: @business, status: :created, business: @business
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  def update
    @business = Business.frienldy.find(params[:id])

    if @business.update(business_params)
      head :no_content
    else
      render json: @business.errors, status: :unprocessable_entity
    end
  end

  private

  def business_params
    params.require(:business).permit(:name, :address, :lat, :lng, :website, :facebook, :twitter, :yelp)
  end
end
