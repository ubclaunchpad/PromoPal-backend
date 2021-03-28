/**
 * The Place Data Fields from https://developers.google.com/places/web-service/place-data-fields.
 * Specifies the types of Place data to return when requesting Place Details
 * */
export enum PlaceField {
  ADDRESS_COMPONENT = 'address_component',
  ADR_ADDRESS = 'adr_address',
  BUSINESS_STATUS = 'business_status',
  FORMATTED_ADDRESS = 'formatted_address',
  GEOMETRY = 'geometry',
  GEOMETRY_VIEWPORT = 'geometry/viewport',
  GEOMETRY_LOCATION = 'geometry/location',
  ICON = 'icon',
  NAME = 'name',
  PHOTOS = 'photos',
  PLACE_ID = 'place_id',
  PLUS_CODE = 'plus_code',
  TYPE = 'type',
  URL = 'url',
  UTC_OFFSET_MINUTES = 'utc_offset',
  VICINITY = 'vicinity',
  FORMATTED_PHONE_NUMBER = 'formatted_phone_number',
  INTERNATIONAL_PHONE_NUMBER = 'international_phone_number',
  OPENING_HOURS = 'opening_hours',
  WEBSITE = 'website',
  PRICE_LEVEL = 'price_level',
  RATING = 'rating',
  REVIEWS = 'reviews',
  USER_RATINGS_TOTAL = 'user_ratings_total',
}
