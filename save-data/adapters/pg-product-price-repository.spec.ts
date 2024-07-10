import { describe } from '@jest/globals';
import { PostgresConnection, type PgConnection } from './pg-connection';
import { ProductPrice } from '../entities/product-price';
import { PgProductPriceRepository } from './pg-product-price-repository';
import { env } from '../env';

describe('PgProductPriceRepository', () => {
    let dbConnection: PgConnection;
    let pgProductPriceRepository: PgProductPriceRepository;
    const productId = '01';
    const supermarketId = '01';

    beforeAll(async () => {
        dbConnection = new PostgresConnection(env.DB_URL_TEST);
        pgProductPriceRepository = new PgProductPriceRepository(dbConnection);

        await dbConnection.query('DELETE FROM price_history', []);
        await dbConnection.query('DELETE FROM products', []);
        await dbConnection.query('DELETE FROM supermarkets', []);

        await dbConnection.query('INSERT INTO products(code, name) VALUES($1, $2)', [productId, 'product01']);
        await dbConnection.query(
            'INSERT INTO supermarkets(cnpj, name, address, latitude, longitude) VALUES($1, $2, $3, $4, $5)',
            [supermarketId, 'supermarket01', 'some-address', 0.0, 0.0],
        );
    });

    beforeEach(async () => {
        await dbConnection.query('DELETE FROM price_history', []);
    });

    afterAll(async () => {
        await dbConnection.query('DELETE FROM price_history', []);
        await dbConnection.query('DELETE FROM products', []);
        await dbConnection.query('DELETE FROM supermarkets', []);
    });

    it('Should be able to register a new product price', async () => {
        const productPrice = ProductPrice.create({
            nfeId: '01',
            price: 10.45,
            date: new Date(),
            supermarketId,
            productId,
        });

        await pgProductPriceRepository.save(productPrice);

        const productPriceOnDatabase = await dbConnection.query(
            'SELECT id, nfe_id, price, date, supermarket_id, product_id FROM price_history WHERE id = $1',
            [productPrice.getId()],
        );

        expect(productPriceOnDatabase).toHaveLength(1);
        expect(productPriceOnDatabase[0]).toEqual(
            expect.objectContaining({
                id: productPrice.getId(),
                nfe_id: productPrice.getNfeId(),
                price: productPrice.getPrice().toString(),
                date: productPrice.getDate(),
                supermarket_id: productPrice.getSupermarketId(),
                product_id: productPrice.getProductId(),
            }),
        );
    });

    it('Should be able to check if a nfe_id exists', async () => {
        const productPrice = ProductPrice.create({
            nfeId: '01',
            price: 10.45,
            date: new Date(),
            supermarketId,
            productId,
        });

        const result01 = await pgProductPriceRepository.existsByNfeIdAndProductsId(
            productPrice.getNfeId(),
            productPrice.getProductId(),
        );
        expect(result01).toEqual(false);

        await dbConnection.query(
            'INSERT INTO price_history(id, nfe_id, price, date, supermarket_id, product_id) VALUES($1, $2, $3, $4, $5, $6)',
            [
                productPrice.getId(),
                productPrice.getNfeId(),
                productPrice.getPrice(),
                productPrice.getDate(),
                productPrice.getSupermarketId(),
                productPrice.getProductId(),
            ],
        );

        const result02 = await pgProductPriceRepository.existsByNfeIdAndProductsId(
            productPrice.getNfeId(),
            productPrice.getProductId(),
        );
        expect(result02).toEqual(true);
    });
});
