import { describe } from '@jest/globals';
import { type PgConnection, PostgresConnection } from './pg-connection';
import { Product } from '../entities/product';
import { PgProductRepository } from './pg-product-repository';

describe('PgProductRepository', () => {
    let pgConnection: PgConnection;
    let pgProductRepository: PgProductRepository;

    beforeAll(async () => {
        pgConnection = new PostgresConnection('postgres://admin:admin@localhost:5432/my_db');
        pgProductRepository = new PgProductRepository(pgConnection);

        await pgConnection.query('DELETE FROM price_history', []);
        await pgConnection.query('DELETE FROM products', []);
        await pgConnection.query('DELETE FROM supermarkets', []);
    });

    beforeEach(async () => {
        await pgConnection.query('DELETE FROM products', []);
    });

    afterAll(async () => {
        await pgConnection.query('DELETE FROM price_history', []);
        await pgConnection.query('DELETE FROM products', []);
        await pgConnection.query('DELETE FROM supermarkets', []);
    });

    it('Should be able to save a new product', async () => {
        const product = Product.load({ code: '01', name: 'product01' });

        await pgProductRepository.save(product);

        const productOnDatabase = await pgConnection.query('SELECT code, name FROM products WHERE code = $1', [
            product.getCode(),
        ]);
        expect(productOnDatabase).toHaveLength(1);
        expect(productOnDatabase[0]).toEqual(
            expect.objectContaining({
                code: product.getCode(),
                name: product.getName(),
            }),
        );
    });

    it('Should be able to find a product by code', async () => {
        const product = Product.load({ code: '01', name: 'product01' });

        const result01 = await pgProductRepository.findByCode(product.getCode());

        expect(result01).toEqual(null);

        await pgConnection.query('INSERT INTO products(code, name) VALUES($1, $2)', [
            product.getCode(),
            product.getName(),
        ]);

        const result02 = await pgProductRepository.findByCode(product.getCode());

        expect(result02).toBeInstanceOf(Product);
        expect(result02?.getName()).toEqual(product.getName());
    });
});
