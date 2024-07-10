import { ProductPrice } from '../../entities/product-price';
import type { ProductPriceRepository } from '../bondaries/product-price-repository';

type Input = {
    nfeId: string;
    productId: string;
    supermarketId: string;
    price: number;
    date: Date;
};

export class CreateProductPriceUseCase {
    public constructor(readonly productPriceRepository: ProductPriceRepository) {}

    public async execute({ nfeId, productId, supermarketId, price, date }: Input): Promise<void> {
        const nfeAlreadyRegistered = await this.productPriceRepository.existsByNfeId(nfeId);
        if (nfeAlreadyRegistered) {
            return;
        }
        const productPrice = ProductPrice.create({ nfeId, price, date, supermarketId, productId });
        await this.productPriceRepository.save(productPrice);
        return;
    }
}
