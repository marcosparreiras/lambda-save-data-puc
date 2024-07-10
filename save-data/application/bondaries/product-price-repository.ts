import type { ProductPrice } from '../../entities/product-price';

export interface ProductPriceRepository {
    existsByNfeIdAndProductsId(nfeId: string, productId: string): Promise<boolean>;
    save(productPrice: ProductPrice): Promise<void>;
}
