type GeoLocation = {
    latitude: number;
    longitude: number;
};

export interface GeoLocationGateway {
    getGeolocationFromAddress(address: string): Promise<GeoLocation>;
}
