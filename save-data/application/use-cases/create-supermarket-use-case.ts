import { Supermarket } from '../../entities/supermarket';
import type { SupermarketRepository } from '../bondaries/supermarket-respository';

type Input = {
    cnpj: string;
    name: string;
    address: string;
};

export class CreateSupermarketUseCase {
    public constructor(readonly supermarketRepository: SupermarketRepository) {}

    public async execute({ cnpj, name, address }: Input): Promise<void> {
        const supermarketAlreadyExists = await this.supermarketRepository.findByCnpj(cnpj);
        if (supermarketAlreadyExists) {
            return;
        }
        const supermarket = await Supermarket.create({ cnpj, name, address });
        await this.supermarketRepository.save(supermarket);
        return;
    }
}
