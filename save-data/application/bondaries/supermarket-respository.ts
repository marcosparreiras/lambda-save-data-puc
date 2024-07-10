import type { Supermarket } from '../../entities/supermarket';

export interface SupermarketRepository {
    findByCnpj(cnpj: string): Promise<Supermarket | null>;
    save(supermarket: Supermarket): Promise<void>;
}
