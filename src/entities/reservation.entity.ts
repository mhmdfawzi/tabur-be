import { AutoMap } from '@automapper/classes';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Queue } from './queue.entity';

@Entity()
export class Reservation {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: new Date() })
  @AutoMap()
  createdDate: Date;

  @ManyToOne(() => User, (user) => user.reservation)
  @JoinColumn()
  reserver: User;

  @Column({ nullable: false, default: false })
  isCancelled: boolean;

  @Column({ nullable: false, default: new Date() })
  @AutoMap()
  cancelationDate: Date;

  @ManyToOne(() => Queue, (queue) => queue.reservations)
  @JoinColumn()
  queue: Queue;

  @BeforeInsert()
  async setCreatedDate() {
    this.createdDate = new Date();
  }

  @BeforeUpdate()
  async setUpdatedDate() {
    this.cancelationDate = new Date();
  }
}
