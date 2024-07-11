import { describe } from '@jest/globals';
import { GoogleGeolocationGateway } from './google-geo-location-gateway';

describe('GoogleGeoLocationGetaway', () => {
    it('Should be able to get an address geolocation', async () => {
        const googleGeoLocationGateway = new GoogleGeolocationGateway();
        const response = await googleGeoLocationGateway.getGeolocationFromAddress(
            'R GRAO MOGOL, 202, CARMO, 3106200 - BELO HORIZONTE, MG',
        );

        expect(response).toBe(
            expect.objectContaining({
                latitude: -19.9417278,
                longitude: -43.9327621,
            }),
        );
    });
});
