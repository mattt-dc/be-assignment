export class ServiceProviderCoverageEntity implements Identifiable {
  id!: string;
  waste_stream_id!: string;
  postal_code_start!: string;
  postal_code_end!: string;
  weekday_availability!: Weekday[];
}

export enum Weekday {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}