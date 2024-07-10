import { Product } from '../entities/product';
import type { ProductRepository } from '../application/bondaries/product-repository';
import type { PgConnection } from './pg-connection';

export class PgProductRepository implements ProductRepository {
    public constructor(readonly dbConnection: PgConnection) {}

    async findByCode(code: string): Promise<Product | null> {
        const queryResult = await this.dbConnection.query('SELECT code, name FROM products WHERE code = $1', [code]);
        if (queryResult.length === 0) {
            return null;
        }
        return Product.load({
            code: queryResult[0]['code'],
            name: queryResult[0]['name'],
        });
    }

    async save(product: Product): Promise<void> {
        await this.dbConnection.query('INSERT INTO products(code, name) VALUES($1, $2)', [
            product.getCode(),
            product.getName(),
        ]);
    }
}
