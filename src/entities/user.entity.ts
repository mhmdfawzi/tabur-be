import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Reservation } from './reservation.entity';
// import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: false, nullable: false })
  name: string;
  @Column({ unique: true, nullable: false })
  email: string;
  @Column({ nullable: false })
  password: string;
  @Column({ nullable: false })
  phone: string;
  @Column({ nullable: false, default: new Date() })
  createdDate: Date;
  @Column({ nullable: false, default: false })
  isDeleted: boolean;
  @Column({ nullable: false })
  role: string;
  @Column({ nullable: true })
  refreshToken: string;
  // @OneToOne(() => Role)
  // @JoinColumn()
  // role: Role;

  @ManyToOne(() => Reservation, (reservation) => reservation.reserver)
  @JoinColumn()
  reservation: Reservation;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
