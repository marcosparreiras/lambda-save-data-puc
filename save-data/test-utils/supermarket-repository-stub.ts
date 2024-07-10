import type { SupermarketRepository } from '../application/bondaries/supermarket-respository';
import type { Supermarket } from '../entities/supermarket';

export class SupermarketRepositoryStub implements SupermarketRepository {
    public items: Supermarket[] = [];

    async findByCnpj(cnpj: string): Promise<Supermarket | null> {
        const supermarket = this.items.find((item) => item.getCnpj() === cnpj);
        return supermarket ?? null;
    }

    async save(supermarket: Supermarket): Promise<void> {
        this.items.push(supermarket);
    }
}
