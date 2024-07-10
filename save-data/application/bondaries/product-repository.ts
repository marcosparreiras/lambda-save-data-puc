import type { Product } from '../../entities/product';

export interface ProductRepository {
    findByCode(code: string): Promise<Product | null>;
    save(product: Product): Promise<void>;
}
