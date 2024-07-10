import type { ProductPriceRepository } from '../application/bondaries/product-price-repository';
import type { ProductPrice } from '../entities/product-price';

export class ProductPriceRepositoryStub implements ProductPriceRepository {
    public items: ProductPrice[] = [];

    async save(productPrice: ProductPrice): Promise<void> {
        this.items.push(productPrice);
    }

    async existsByNfeIdAndProductsId(nfeId: string, productId: string): Promise<boolean> {
        const nfeExists = this.items.find((item) => item.getNfeId() === nfeId && item.getProductId() === productId);
        return nfeExists ? true : false;
    }
}
