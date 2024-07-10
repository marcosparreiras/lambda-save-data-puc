export class Supermarket {
    private cnpj: string;
    private name: string;
    private address: string;
    private latitude: number;
    private longitude: number;

    public getCnpj(): string {
        return this.cnpj;
    }
    public getName(): string {
        return this.name;
    }
    public getAddress(): string {
        return this.address;
    }
    public getLatitude(): number {
        return this.latitude;
    }
    public getLongitude(): number {
        return this.longitude;
    }

    private constructor(cnpj: string, name: string, address: string, latitude: number, longitude: number) {
        this.cnpj = cnpj;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public static load(data: { cnpj: string; name: string; address: string; latitude: number; longitude: number }) {
        return new Supermarket(data.cnpj, data.name, data.address, data.latitude, data.longitude);
    }

    public static create(data: { cnpj: string; name: string; address: string }) {
        return new Supermarket(data.cnpj, data.name, data.address, 0, 0);
    }
}
