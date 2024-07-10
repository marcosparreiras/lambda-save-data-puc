import type { ProductPriceRepository } from '../application/bondaries/product-price-repository';
import type { ProductPrice } from '../entities/product-price';

export class ProductPriceRepositoryStub implements ProductPriceRepository {
    public items: ProductPrice[] = [];

    async save(productPrice: ProductPrice): Promise<void> {
        this.items.push(productPrice);
    }

    async existsByNfeId(nfeId: string): Promise<boolean> {
        const nfeExists = this.items.find((item) => item.getNfeId() === nfeId);
        return nfeExists ? true : false;
    }
}
