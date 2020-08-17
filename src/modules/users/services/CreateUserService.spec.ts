import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUsers.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsers = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUsers.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    await expect(
      createUsers.execute({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
