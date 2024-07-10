import { describe } from '@jest/globals';
import { ProductRepositoryStub } from '../../test-utils/product-repository-stub';
import { CreateProductUseCase } from './create-product-use-case';
import { Product } from '../../entities/product';

describe('CreateProductUseCase', () => {
    let createProductRepository: ProductRepositoryStub;
    let createProductUseCase: CreateProductUseCase;

    beforeEach(() => {
        createProductRepository = new ProductRepositoryStub();
        createProductUseCase = new CreateProductUseCase(createProductRepository);
    });

    it('Should be able to create a new product', async () => {
        const input = {
            code: '01',
            name: 'product01',
        };

        await createProductUseCase.execute(input);

        expect(createProductRepository.items).toHaveLength(1);
        expect(createProductRepository.items[0]).toEqual(
            expect.objectContaining({
                ...input,
            }),
        );
    });

    it('Should not be able to create a product with a already registered code', async () => {
        const code = '01';
        createProductRepository.items.push(Product.load({ code, name: 'product01' }));

        const input = {
            code,
            name: 'product02',
        };

        await createProductUseCase.execute(input);

        expect(createProductRepository.items).toHaveLength(1);
        expect(createProductRepository.items[0].getName()).toEqual('product01');
    });
});
