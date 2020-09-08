import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

// import { assign } from 'nodemailer/lib/shared';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  oldPassword?: string;
  password?: string;
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    oldPassword,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);
    if (userWithUpdatedEmail) {
      if (userWithUpdatedEmail.id !== user_id) {
        throw new AppError('E-mail already in use.');
      }
    }
    if (!user) {
      throw new AppError('User not found!');
    }

    if (password && !oldPassword) {
      throw new AppError('Old password not informed.');
    }

    if (password && oldPassword) {
      const checkOldPassword = await this.hashProvider.compareHash(
        oldPassword,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old password not match.');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    user.name = name;
    user.email = email;

    return this.usersRepository.save(user);
  }
}
