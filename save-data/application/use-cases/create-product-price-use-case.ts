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
        const productOfNFEAlreadyExists = await this.productPriceRepository.existsByNfeIdAndProductsId(
            nfeId,
            productId,
        );
        if (productOfNFEAlreadyExists) {
            return;
        }
        const productPrice = ProductPrice.create({ nfeId, price, date, supermarketId, productId });
        await this.productPriceRepository.save(productPrice);
        return;
    }
}
