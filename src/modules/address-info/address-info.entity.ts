import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ADDRESS_INFO' })
export class AddressInfo {
  @PrimaryGeneratedColumn({
    type: 'int',
    name: 'NO',
    unsigned: true,
  })
  no: number;

  @Column({
    type: 'varchar',
    name: 'ADDRESS_CODE',
  })
  addressCode: string;

  @Column({
    type: 'varchar',
    name: 'NAME',
  })
  name: string;
}
