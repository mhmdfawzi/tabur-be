import {
  Column,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  // Index,
  // Point,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { AutoMap } from '@automapper/classes';
import { Queue } from './queue.entity';

@Entity()
export class Provider {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @AutoMap()
  @Column({ unique: true, nullable: false })
  name: string;

  @AutoMap()
  @Column({ nullable: false, default: new Date() })
  createdDate: Date;

  @AutoMap()
  @Column({ nullable: false, default: false })
  isDeleted: boolean;

  @AutoMap()
  @Column({ nullable: true })
  description: string;

  @AutoMap()
  @Column({ nullable: false })
  phone: string;

  @AutoMap()
  @Column({ nullable: false })
  address: string;

  @AutoMap()
  @Column({ nullable: false })
  logo: string;

  @AutoMap()
  @Column({ type: 'double precision', name: 'd_long' })
  long: number;

  @AutoMap()
  @Column({ type: 'double precision', name: 'd_lat' })
  lat: number;

  // @Index({ spatial: true })
  // @AutoMap()
  // @Column({
  //   type: 'geography',
  //   spatialFeatureType: 'Point',
  //   srid: 4326,
  //   nullable: true,
  // })
  // location: Point;

  @AutoMap()
  @Column()
  workingDays: string;

  @AutoMap()
  @Column()
  workingHours: string;

  @AutoMap()
  @Column({ nullable: false, default: true })
  isSubscribed: boolean;

  @AutoMap()
  @Column({ nullable: false, default: false })
  isPublished: boolean;

  @OneToOne(() => User)
  @JoinColumn()
  owner: User;

  @OneToOne(() => Category)
  @JoinColumn()
  category: Category;

  @OneToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @OneToMany(() => Queue, (queue) => queue.serviceProvider)
  queues: Queue[];
}
