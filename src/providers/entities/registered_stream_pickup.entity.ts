import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { CustomerEntity } from './customer.entity';
import { WasteStreamEntity } from './waste_stream.entity';
import { ServiceProviderEntity } from './service_provider.entity';

@Entity()
export class RegisteredStreamPickupEntity implements Identifiable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => CustomerEntity)
  @JoinColumn({ name: 'customer_id' })
  customer!: CustomerEntity;

  @ManyToOne(() => WasteStreamEntity)
  @JoinColumn({ name: 'waste_stream_id' })
  waste_stream!: WasteStreamEntity;

  @ManyToOne(() => ServiceProviderEntity)
  @JoinColumn({ name: 'service_provider_id' })
  service_provider!: ServiceProviderEntity;

  @Column()
  pickup_date!: Date;
}