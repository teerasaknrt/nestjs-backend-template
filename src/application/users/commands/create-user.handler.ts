import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { User } from 'src/domain/entities/user.entity';
import { IUserRepository } from 'src/domain/repositories/user.repository';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { HashUtil } from 'src/infrastructure/utils/hash.util';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const user = new User();
    user.name = command.name;
    user.email = command.email;
    user.password = await HashUtil.hashPassword(command.password);

    return this.userRepository.create(user);
  }
}
