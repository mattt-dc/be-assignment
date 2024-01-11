export class CustomerEntity implements Identifiable {
  id!: string;
  name!: string;
  address!: string;
  postal_code!: string;
  registered_stream_pickup_ids!: string[];
}
