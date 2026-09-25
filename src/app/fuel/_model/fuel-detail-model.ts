/**
 * A fuel log entry as returned by the Web API.
 * Property names are PascalCase because the API serialises its C# model as-is.
 */
export interface FuelDetail {
  Id: number;
  UserId: number;
  MeterReading: number;
  TotalPrice: number;
  AddedFuel: number;
  Note: string | null;
  /** ISO-8601 date text; the API sends dates as strings, not `Date` objects. */
  CreatedAt: string;
  ModifiedAt: string;
}

/** Payload for creating an entry; the API assigns `Id` and `ModifiedAt`. */
export type NewFuelDetail = Omit<FuelDetail, 'Id' | 'ModifiedAt'>;
