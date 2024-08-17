import { gql } from '@apollo/client';

export const GET_NEARBY_HOTELS = gql`
  query GetNearbyHotels {
    NearByHotels {
      type
      name
      gps_coordinates {
        latitude
        longitude
      }
      check_in_time
      check_out_time
      rate_per_night {
        lowest
        extracted_lowest
        before_taxes_fees
        extracted_before_taxes_fees
      }
      total_rate {
        lowest
        extracted_lowest
        before_taxes_fees
        extracted_before_taxes_fees
      }
      prices {
        amount
        currency
      }
      nearby_places {
        name
        distance
      }
      images {
        url
        description
      }
      overall_rating
      reviews
      location_rating
      amenities
      excluded_amenities
      essential_info
    }
  }
`;
 export default GET_NEARBY_HOTELS;