import { SQSEvent, Context } from 'aws-lambda';
import { z, ZodError } from 'zod';
import type { SupermarketRepository } from './application/bondaries/supermarket-respository';
import type { ProductRepository } from './application/bondaries/product-repository';
import type { ProductPriceRepository } from './application/bondaries/product-price-repository';
import { CreateSupermarketUseCase } from './application/use-cases/create-supermarket-use-case';
import { CreateProductUseCase } from './application/use-cases/create-product-use-case';
import { CreateProductPriceUseCase } from './application/use-cases/create-product-price-use-case';
import { PgSupermarketRepository } from './adapters/pg-supermarket-repository';
import { PgProductPriceRepository } from './adapters/pg-product-price-repository';
import { PgProductRepository } from './adapters/pg-product-repository';
import { PostgresConnection, type PgConnection } from './adapters/pg-connection';
import { GeoLocationGatewayRegistry } from './application/registry/geo-location-getaway-registry';
import { GeoLocationGetawayStub } from './test-utils/geo-location-gateway-stub';
import { AppException } from './exception/app-exception';

export async function lambdaHandler(event: SQSEvent, _context?: Context): Promise<void> {
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

        const geoLocationGateway = new GeoLocationGetawayStub();
        GeoLocationGatewayRegistry.getInstance().setGeoLocationGetaway(geoLocationGateway);

        const dbConnection: PgConnection = new PostgresConnection('postgres://admin:admin@localhost:5432/my_db');

        const supermarketRepository: SupermarketRepository = new PgSupermarketRepository(dbConnection);
        const productRepository: ProductRepository = new PgProductRepository(dbConnection);
        const productPriceRepository: ProductPriceRepository = new PgProductPriceRepository(dbConnection);

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
        if (error instanceof AppException) {
            console.log(error.message);
            return;
        }
        console.log(error);
        return;
    }
}
