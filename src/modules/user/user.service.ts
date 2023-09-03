import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UserDto } from '../../dtos/userDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
// import { UserRole } from 'src/enums/userRole.enum';
// import { Role } from '../../entities/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findUsers(): Promise<UserDto[]> {
    return (await this.userRepo.find()).map((u) => {
      return <UserDto>{ name: u.name, email: u.email, phone: u.phone };
    });
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({ where: { id: id } });
  }

  async findOneWithUserName(userName: string) {
    return await this.userRepo.findOne({ where: { email: userName } });
  }

  async createUser(createUserDto: CreateUserDto, role: string) {
    const user = await this.userRepo.create({
      ...createUserDto,
      role: role,
    });
    await this.userRepo.save(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(id, updateUserDto);
  }

  async delete(id: number) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (user) {
      user.isDeleted = true;
      await this.userRepo.update(id, user);
      return true;
    } else {
      return false;
    }
  }
}
