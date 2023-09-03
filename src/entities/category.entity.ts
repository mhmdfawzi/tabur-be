import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true, nullable: false })
  name: string;
  @Column({ nullable: false, default: new Date() })
  createdDate: Date;
  @Column({ nullable: false, default: false })
  isDeleted: boolean;
}
