import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';
// import { RoleDto } from '../../dtos/roleDto';
import { UserRole, UserRoleType } from '../../enums/userRole.enum';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async getAll(): Promise<UserRoleType> {
    return UserRole;
  }

  // async getById(id: number) {
  //   return await this.roleRepo.findOne({ where: { id: id } });
  // }

  // async create(role: RoleDto) {
  //   const savedRole = await this.roleRepo.create(role);
  //   return await this.roleRepo.save(savedRole);
  // }
  // async update(id: number, role: RoleDto) {
  //   return await this.roleRepo.update(id, role);
  // }
  // async remove(id: number) {
  //   const role = await this.roleRepo.findOne({ where: { id: id } });
  //   if (role) {
  //     role.isDeleted = true;
  //     await this.roleRepo.update(id, role);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
}
