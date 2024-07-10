import { Client } from 'pg';

export interface PgConnection {
    query(instruction: string, params: any[]): Promise<any[]>;
}

export class PostgresConnection implements PgConnection {
    public constructor(readonly connectionUrl: string) {}

    async query(instruction: string, params: any[]): Promise<any> {
        const client = new Client(this.connectionUrl);
        await client.connect();
        const result = await client.query(instruction, params);
        await client.end();
        return result.rows;
    }
}
