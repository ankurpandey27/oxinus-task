import { ROLES } from '@constants';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from '../../utility/entity';

@Entity('account')
export class AccountEntity extends BaseEntity {
  @PrimaryColumn({
    generated: 'uuid',
  })
  id: string;

  @Column({ type: 'uuid' })
  firebase_user_id: string;

  @Column({
    type: 'enum',
    enum: ROLES,
  })
  role: string;

  @Column('text')
  email: string;

  @Column({ type: 'text', nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column('int', { nullable: true })
  phone: number;

  @Column({ nullable: true })
  birthday_date: Date;

  @Column('text', { nullable: true })
  first_name: string;

  @Column('text', { nullable: true })
  last_name: string;
}
