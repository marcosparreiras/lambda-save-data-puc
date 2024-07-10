import { SQSEvent, Context } from 'aws-lambda';
import { z, ZodError } from 'zod';
import { SupermarketRepositoryStub } from './test-utils/supermarket-repository-stub';
import type { SupermarketRepository } from './application/bondaries/supermarket-respository';
import type { ProductRepository } from './application/bondaries/product-repository';
import type { ProductPriceRepository } from './application/bondaries/product-price-repository';
import { ProductRepositoryStub } from './test-utils/product-repository-stub';
import { ProductPriceRepositoryStub } from './test-utils/product-price-repository-stub';
import { CreateSupermarketUseCase } from './application/use-cases/create-supermarket-use-case';
import { CreateProductUseCase } from './application/use-cases/create-product-use-case';
import { CreateProductPriceUseCase } from './application/use-cases/create-product-price-use-case';

export async function lambdaHandler(event: SQSEvent, _context?: Context): Promise<void> {
    console.log(JSON.parse(event.Records[0].body));

    const eventRecordsSchema = z.array(
        z.object({
            body: z.object({
                id: z.string(),
                supermarketName: z.string(),
                cnpj: z.string(),
                address: z.string(),
                date: z.coerce.date(),
                items: z.array(
                    z.object({
                        name: z.string(),
                        code: z.string(),
                        price: z.coerce.number(),
                    }),
                ),
            }),
        }),
    );

    try {
        const records = eventRecordsSchema.parse(event.Records.map((record) => ({ body: JSON.parse(record.body) })));

        const supermarketRepository: SupermarketRepository = new SupermarketRepositoryStub();
        const productRepository: ProductRepository = new ProductRepositoryStub();
        const productPriceRepository: ProductPriceRepository = new ProductPriceRepositoryStub();

        const createSupermarketUseCase = new CreateSupermarketUseCase(supermarketRepository);
        const createProductUseCase = new CreateProductUseCase(productRepository);
        const createProductPriceUseCase = new CreateProductPriceUseCase(productPriceRepository);

        for (let record of records) {
            const data = record.body;

            await createSupermarketUseCase.execute({
                cnpj: data.cnpj,
                name: data.supermarketName,
                address: data.address,
            });

            for (let item of data.items) {
                await createProductUseCase.execute({
                    code: item.code,
                    name: item.name,
                });
                await createProductPriceUseCase.execute({
                    nfeId: data.id,
                    date: data.date,
                    price: item.price,
                    productId: item.code,
                    supermarketId: data.cnpj,
                });
            }
        }

        return;
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            console.log(error.format());
            return;
        }
        console.log(error);
        return;
    }
}
