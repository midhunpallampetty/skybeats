export interface hotelState {
    hotels: Hotel[];
  }
 export interface GPSCoordinates {
    latitude: number;
    longitude: number;
  }
  
  export interface Rate {
    lowest: string;
    extracted_lowest: number;
    before_taxes_fees: string;
    extracted_before_taxes_fees: number;
  }
  
  export interface Price {
    [key: string]: any;
  }
  
  export interface NearbyPlace {
    [key: string]: any;
  }
  
  export interface Image {
    [key: string]: any;
  }
  
   export interface Hotel {
    type: string;
    name: string;
    gps_coordinates: GPSCoordinates | null;
    check_in_time: string;
    check_out_time: string;
    rate_per_night: Rate | null;
    total_rate: Rate | null;
    prices: Price[];
    nearby_places: NearbyPlace[];
    images: Image[];
    overall_rating: number;
    reviews: number;
    location_rating: number;
    amenities: string[];
    excluded_amenities: string[];
    essential_info: string[];
  }
