import { AppException } from './app-exception';

export class GeoLocationGatewayNotRegistered extends AppException {
    public constructor() {
        super('GeolocationGateway not resgistered yet');
    }
}
