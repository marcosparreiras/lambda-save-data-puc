import type { GeoLocationGateway } from '../application/bondaries/geo-location-gateway';
import axios from 'axios';
import { env } from '../env';

type GoogleGeoLocationApiResponse = {
    results: {
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
        };
    }[];
};

export class GoogleGeolocationGateway implements GeoLocationGateway {
    async getGeolocationFromAddress(address: string): Promise<{ latitude: number; longitude: number }> {
        const urlEncodedAddress = address.split(' ').join('%20');
        const response = await axios.get<GoogleGeoLocationApiResponse>(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedAddress}&key=${env.GOOGLE_API_KEY}`,
        );

        if (response.status !== 200) {
            return { latitude: 0, longitude: 0 }; // GOOGLE FAIL TO GET ADDRESS GEOLOCATION
        }

        const { lat: latitude, lng: longitude } = response.data.results[0].geometry.location;

        return { latitude, longitude };
    }
}
