import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RegisteredStreamPickupEntity } from './registered_stream_pickup.entity';
import { Identifiable } from './interfaces/identifiable.interface';

@Entity()
export class CustomerEntity implements Identifiable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column()
  postal_code!: string;

  @OneToMany(
    () => RegisteredStreamPickupEntity,
    (pickup: RegisteredStreamPickupEntity) => pickup.customer
  )
  registered_stream_pickups!: RegisteredStreamPickupEntity[];
}