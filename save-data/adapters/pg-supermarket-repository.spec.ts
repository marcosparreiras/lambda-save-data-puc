import { describe } from '@jest/globals';
import { PostgresConnection } from './pg-connection';
import { PgSupermarketRepository } from './pg-supermarket-repository';
import { Supermarket } from '../entities/supermarket';

describe('PgSupermarketRepository', () => {
    let pgConnection: PostgresConnection;
    let pgSupermarketRepository: PgSupermarketRepository;

    beforeAll(() => {
        pgConnection = new PostgresConnection('postgres://admin:admin@localhost:5432/my_db');
        pgSupermarketRepository = new PgSupermarketRepository(pgConnection);
    });

    beforeEach(async () => {
        await pgConnection.query('DELETE FROM supermarkets', []);
    });

    it('Should be able to save a new supermaket', async () => {
        expect(1).toEqual(1);
        const supermaket = Supermarket.load({
            cnpj: '0000000',
            address: 'some-address',
            name: 'some-name',
            latitude: 0.0,
            longitude: 0.0,
        });

        await pgSupermarketRepository.save(supermaket);

        const supermaketOnDatabase = await pgConnection.query(
            'SELECT cnpj, address, name, latitude, longitude FROM supermarkets WHERE cnpj = $1',
            [supermaket.getCnpj()],
        );
        expect(supermaketOnDatabase).toHaveLength(1);
        expect(supermaketOnDatabase[0]).toEqual(
            expect.objectContaining({
                cnpj: supermaket.getCnpj(),
                address: supermaket.getAddress(),
                name: supermaket.getName(),
                latitude: supermaket.getLatitude(),
                longitude: supermaket.getLongitude(),
            }),
        );
    });
});
