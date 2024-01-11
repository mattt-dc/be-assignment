export class RegisteredStreamPickupEntity implements Identifiable {
  id!: string;
  customer_id!: string;
  waste_stream_id!: string;
  service_provider_id!: string;
  pickup_date!: Date;
}
