export class Record {
  constructor(
    public id: string,
    public vehicleId: string,
    public date: string,
    public serviceType: string,
    public description: string,
    public mileage: string,
    public cost: string
  ) {}
}