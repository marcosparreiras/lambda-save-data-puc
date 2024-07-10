import { describe } from '@jest/globals';
import { SupermarketRepositoryStub } from '../../test-utils/supermarket-repository-stub';
import { CreateSupermarketUseCase } from './create-supermarket-use-case';
import { Supermarket } from '../../entities/supermarket';
import { GeoLocationGatewayRegistry } from '../registry/geo-location-getaway-registry';
import { GeoLocationGetawayStub } from '../../test-utils/geo-location-gateway-stub';

describe('CreateSupermarketUseCase', () => {
    let geoLocationGateway: GeoLocationGetawayStub;
    let supermarketRepository: SupermarketRepositoryStub;
    let createSupermarketUseCase: CreateSupermarketUseCase;

    beforeEach(() => {
        geoLocationGateway = new GeoLocationGetawayStub();
        GeoLocationGatewayRegistry.getInstance().setGeoLocationGetaway(geoLocationGateway);
        supermarketRepository = new SupermarketRepositoryStub();
        createSupermarketUseCase = new CreateSupermarketUseCase(supermarketRepository);
    });

    it('Should be able to create a new supermarket', async () => {
        const input = {
            cnpj: '0000000000000000',
            name: 'supermarket01',
            address: 'some-adrress',
        };

        await createSupermarketUseCase.execute(input);

        expect(supermarketRepository.items).toHaveLength(1);
        expect(supermarketRepository.items[0]).toEqual(
            expect.objectContaining({
                ...input,
                latitude: 0.0,
                longitude: 0.0,
            }),
        );
    });

    it('Should not be able to create a supermarket with cnpj already registered', async () => {
        const cnpj = '0000000000000000';
        supermarketRepository.items.push(
            Supermarket.load({ cnpj, name: 'supermarket01', address: 'some-address', latitude: 0.0, longitude: 0.0 }),
        );

        const input = {
            cnpj,
            name: 'supermarket02',
            address: 'some-adrress',
        };

        await createSupermarketUseCase.execute(input);

        expect(supermarketRepository.items).toHaveLength(1);
        expect(supermarketRepository.items[0].getName()).toEqual('supermarket01');
    });
});
