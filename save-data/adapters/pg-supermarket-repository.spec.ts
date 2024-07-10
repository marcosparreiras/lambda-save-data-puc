import { describe } from '@jest/globals';
import { PostgresConnection } from './pg-connection';
import { PgSupermarketRepository } from './pg-supermarket-repository';
import { Supermarket } from '../entities/supermarket';
import { env } from '../env';

describe('PgSupermarketRepository', () => {
    let pgConnection: PostgresConnection;
    let pgSupermarketRepository: PgSupermarketRepository;

    beforeAll(async () => {
        pgConnection = new PostgresConnection(env.DB_URL_TEST);
        pgSupermarketRepository = new PgSupermarketRepository(pgConnection);

        await pgConnection.query('DELETE FROM price_history', []);
        await pgConnection.query('DELETE FROM products', []);
        await pgConnection.query('DELETE FROM supermarkets', []);
    });

    beforeEach(async () => {
        await pgConnection.query('DELETE FROM supermarkets', []);
    });

    afterAll(async () => {
        await pgConnection.query('DELETE FROM price_history', []);
        await pgConnection.query('DELETE FROM products', []);
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

    it('Should be able to find a supermaket by cnpj', async () => {
        const supermaket = Supermarket.load({
            cnpj: '0000000',
            address: 'some-address',
            name: 'some-name',
            latitude: 0.0,
            longitude: 0.0,
        });

        const result01 = await pgSupermarketRepository.findByCnpj(supermaket.getCnpj());
        expect(result01).toEqual(null);

        await pgConnection.query(
            'INSERT INTO supermarkets(cnpj, name, address, latitude, longitude) VALUES($1, $2, $3, $4, $5)',
            [
                supermaket.getCnpj(),
                supermaket.getName(),
                supermaket.getAddress(),
                supermaket.getLatitude(),
                supermaket.getLongitude(),
            ],
        );

        const result02 = await pgSupermarketRepository.findByCnpj(supermaket.getCnpj());
        expect(result02).toBeInstanceOf(Supermarket);
        expect(result02?.getName()).toEqual(supermaket.getName());
    });
});
