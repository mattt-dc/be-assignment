export class ServiceProviderEntity implements Identifiable {
  id!: string;
  name!: string;
  address!: string;
  coverage_ids!: string[];
  registered_stream_pickup_ids!: string[];
}
