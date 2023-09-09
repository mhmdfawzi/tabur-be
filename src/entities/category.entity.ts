import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, nullable: false })
  @AutoMap()
  name: string;
  @Column({ nullable: false, default: new Date() })
  createdDate: Date;
  @Column({ nullable: false, default: false })
  isDeleted: boolean;
}
