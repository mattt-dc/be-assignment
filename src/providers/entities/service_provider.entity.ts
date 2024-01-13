import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ServiceProviderCoverageEntity } from './service_provider_coverage.entity';
import { RegisteredStreamPickupEntity } from './registered_stream_pickup.entity';

@Entity()
export class ServiceProviderEntity implements Identifiable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  address!: string;

  @OneToMany(() => ServiceProviderCoverageEntity, coverage => coverage.service_provider)
  coverages!: ServiceProviderCoverageEntity[];

  @OneToMany(() => RegisteredStreamPickupEntity, pickup => pickup.service_provider)
  registered_stream_pickups!: RegisteredStreamPickupEntity[];
}