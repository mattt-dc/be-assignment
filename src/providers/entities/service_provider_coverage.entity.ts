import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ServiceProviderEntity } from './service_provider.entity';
import { WasteStreamEntity } from './waste_stream.entity';

export enum Weekday {
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
  Sunday = 7
}

@Entity()
export class ServiceProviderCoverageEntity implements Identifiable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => ServiceProviderEntity)
  @JoinColumn({ name: 'service_provider_id' })
  service_provider!: ServiceProviderEntity;

  @ManyToOne(() => WasteStreamEntity)
  @JoinColumn({ name: 'waste_stream_id' })
  waste_stream!: WasteStreamEntity;

  @Column()
  postal_code_start!: string;

  @Column()
  postal_code_end!: string;

  @Column('simple-array')
  weekday_availability!: Weekday[];
}