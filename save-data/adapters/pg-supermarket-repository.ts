import type { SupermarketRepository } from '../application/bondaries/supermarket-respository';
import { Supermarket } from '../entities/supermarket';
import type { PgConnection } from './pg-connection';

export class PgSupermarketRepository implements SupermarketRepository {
    public constructor(readonly dbConnection: PgConnection) {}

    async findByCnpj(cnpj: string): Promise<Supermarket | null> {
        const queryResult = await this.dbConnection.query(
            'SELECT cnpj, name, address, latitude, longitude FROM supermarkets WHERE cnpj = $1',
            [cnpj],
        );
        if (queryResult.length === 0) {
            return null;
        }
        return Supermarket.load({
            cnpj: queryResult[0]['cnpj'],
            name: queryResult[0]['name'],
            address: queryResult[0]['address'],
            latitude: queryResult[0]['latitude'],
            longitude: queryResult[0]['longitude'],
        });
    }

    async save(supermarket: Supermarket): Promise<void> {
        await this.dbConnection.query(
            'INSERT INTO supermarkets(cnpj, name, address, latitude, longitude) VALUES ($1, $2, $3, $4, $5)',
            [
                supermarket.getCnpj(),
                supermarket.getName(),
                supermarket.getAddress(),
                supermarket.getLatitude(),
                supermarket.getLongitude(),
            ],
        );
    }
}
