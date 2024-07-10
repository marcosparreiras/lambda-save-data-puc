import type { GeoLocationGateway } from '../application/bondaries/geo-location-gateway';

export class GeoLocationGetawayStub implements GeoLocationGateway {
    async getGeolocationFromAddress(_address: string): Promise<{ latitude: number; longitude: number }> {
        return {
            latitude: 0,
            longitude: 0,
        };
    }
}
