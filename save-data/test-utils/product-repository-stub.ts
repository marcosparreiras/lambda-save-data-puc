import type { ProductRepository } from '../application/bondaries/product-repository';
import type { Product } from '../entities/product';

export class ProductRepositoryStub implements ProductRepository {
    public items: Product[] = [];

    async findByCode(code: string): Promise<Product | null> {
        const product = this.items.find((item) => item.getCode() === code);
        return product ?? null;
    }

    async save(product: Product): Promise<void> {
        this.items.push(product);
    }
}
