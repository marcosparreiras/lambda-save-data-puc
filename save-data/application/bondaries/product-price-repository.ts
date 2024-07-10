import type { ProductPrice } from '../../entities/product-price';

export interface ProductPriceRepository {
    existsByNfeId(nfeId: string): Promise<boolean>;
    save(productPrice: ProductPrice): Promise<void>;
}
