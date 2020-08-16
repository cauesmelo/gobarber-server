import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('SendForgotPasswordEmail', () => {
  it('should be able to recover the password using the email', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();
    const createUsers = new SendForgotPasswordEmailservice(fakeUsersRepository);

    const user = await createUsers.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123123',
    });

    expect(user).toHaveProperty('id');
  });
});
