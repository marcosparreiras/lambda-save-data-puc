import type { GeoLocationGateway } from '../bondaries/geo-location-gateway';

export class GeoLocationGatewayRegistry {
    private static instance: GeoLocationGatewayRegistry | null = null;
    private geoLocationGateway: GeoLocationGateway | null;

    private constructor() {
        this.geoLocationGateway = null;
    }

    public setGeoLocationGetaway(geoLocationGateway: GeoLocationGateway) {
        this.geoLocationGateway = geoLocationGateway;
    }

    public getGeoLocationGetaway(): GeoLocationGateway {
        if (!this.geoLocationGateway) {
            throw new Error('GeolocationGetaway not resgistered yet');
        }
        return this.geoLocationGateway;
    }

    public static getInstance(): GeoLocationGatewayRegistry {
        if (!this.instance) {
            this.instance = new GeoLocationGatewayRegistry();
        }
        return this.instance;
    }
}
