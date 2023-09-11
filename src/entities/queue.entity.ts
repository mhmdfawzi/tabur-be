import { AutoMap } from '@automapper/classes';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Provider } from './provider.entity';
import { Reservation } from './reservation.entity';

@Entity()
export class Queue {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  @AutoMap()
  name: string;

  @Column({ nullable: false, default: new Date() })
  @AutoMap()
  createdDate: Date;

  @Column({ nullable: false, default: new Date() })
  @AutoMap()
  updatedDate: Date;

  @Column({ nullable: false, default: false })
  isDeleted: boolean;

  @Column({ nullable: false, default: 0 })
  @AutoMap()
  nowServing: number;

  @Column({ nullable: false, default: 0 })
  @AutoMap()
  nextServing: number;

  @Column({ nullable: false, default: 0 })
  @AutoMap()
  bookCount: number;

  @Column({ nullable: false, default: false })
  @AutoMap()
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn()
  createdBy: User;

  @ManyToOne(() => Provider, (provider) => provider.queues)
  @JoinColumn()
  serviceProvider: Provider;

  @OneToOne(() => User)
  @JoinColumn()
  manager: User;

  @OneToMany(() => Reservation, (reservation) => reservation.queue)
  reservations: Reservation[];

  @BeforeInsert()
  async setCreatedDate() {
    this.createdDate = new Date();
  }

  @BeforeUpdate()
  async setUpdatedDate() {
    this.updatedDate = new Date();
  }
}
