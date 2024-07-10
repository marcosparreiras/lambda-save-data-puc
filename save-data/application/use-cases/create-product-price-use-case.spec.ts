import { describe } from '@jest/globals';
import { CreateProductPriceUseCase } from './create-product-price-use-case';
import { ProductPriceRepositoryStub } from '../../test-utils/product-price-repository-stub';
import { ProductPrice } from '../../entities/product-price';

describe('CreateProductPriceUseCaseProductPriceUseCase', () => {
    let productPriceRepository: ProductPriceRepositoryStub;
    let createProductPriceUseCase: CreateProductPriceUseCase;

    beforeEach(() => {
        productPriceRepository = new ProductPriceRepositoryStub();
        createProductPriceUseCase = new CreateProductPriceUseCase(productPriceRepository);
    });

    it('Should be able to save new product prices', async () => {
        const input = {
            nfeId: '01',
            productId: '01',
            supermarketId: '01',
            price: 10.33,
            date: new Date(),
        };

        await createProductPriceUseCase.execute(input);

        expect(productPriceRepository.items).toHaveLength(1);
        expect(productPriceRepository.items[0]).toEqual(
            expect.objectContaining({
                ...input,
                id: expect.any(String),
            }),
        );
    });

    it('Should not be able to save a product if a nfe is already registered', async () => {
        const nfeId = '01';
        productPriceRepository.items.push(
            ProductPrice.create({ nfeId, price: 55.89, date: new Date(), productId: '02', supermarketId: '02' }),
        );

        const input = {
            nfeId,
            productId: '01',
            supermarketId: '01',
            price: 10.33,
            date: new Date(),
        };

        await createProductPriceUseCase.execute(input);
        expect(productPriceRepository.items).toHaveLength(1);
        expect(productPriceRepository.items[0].getSupermarketId()).toEqual('02');
    });
});
