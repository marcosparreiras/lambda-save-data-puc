import type { ProductPrice } from '../../entities/product-price';

export interface ProductPriceRepository {
    save(productPrice: ProductPrice): Promise<void>;
    existsByNfeId(nfeId: string): Promise<boolean>;
}
