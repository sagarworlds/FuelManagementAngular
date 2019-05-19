/*interface IFuelDetail {
  Id: number;
  UserId: number;
  MeterReading: number;
  TotalPrice: number;
  AddedFuel: number;
  Note: string;
  CreatedAt: Date;
  ModifiedAt: Date;
}*/
export class FuelDetail {
  public constructor(init?: FuelDetail) {
    Object.assign(this, init);
  }
  public Id: number;
  public UserId: number;
  public MeterReading: number;
  public TotalPrice: number;
  public AddedFuel: number;
  public Note: string;
  public CreatedAt: Date;
  public ModifiedAt: Date;
  // public constructor(init?: Partial<IFuelDetail>) {
  //   Object.assign(this, init);
  // }
}
