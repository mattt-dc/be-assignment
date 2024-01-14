import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum WasteStreamCategory {
  hazardous = 'hazardous',
  recyclable = 'recyclable',
  compostable = 'compostable',
  residual_waste = 'residual_waste',
}

@Entity()
export class WasteStreamEntity implements Identifiable {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  label!: string;

  @Column({
    type: 'enum',
    enum: WasteStreamCategory,
    default: WasteStreamCategory.residual_waste
  })
  category!: WasteStreamCategory;
}