import type { ProductPriceRepository } from '../application/bondaries/product-price-repository';
import type { ProductPrice } from '../entities/product-price';
import type { PgConnection } from './pg-connection';

export class PgProductPriceRepository implements ProductPriceRepository {
    public constructor(readonly dbConnection: PgConnection) {}

    async existsByNfeId(nfeId: string): Promise<boolean> {
        const queryResult = await this.dbConnection.query('SELECT nfe_id FROM price_history WHERE nfe_id = $1', [
            nfeId,
        ]);
        return queryResult.length === 0 ? false : true;
    }

    async save(productPrice: ProductPrice): Promise<void> {
        await this.dbConnection.query(
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
    }
}
