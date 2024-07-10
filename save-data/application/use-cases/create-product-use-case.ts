import { Product } from '../../entities/product';
import type { ProductRepository } from '../bondaries/product-repository';

type Input = {
    code: string;
    name: string;
};

export class CreateProductUseCase {
    public constructor(readonly productRepository: ProductRepository) {}

    public async execute({ code, name }: Input): Promise<void> {
        const productAlreadyExists = await this.productRepository.findByCode(code);
        if (productAlreadyExists) {
            return;
        }
        const product = Product.load({ code, name });
        await this.productRepository.save(product);
        return;
    }
}
