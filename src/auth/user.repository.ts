import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

import { AuthCredentialsDto } from './dtos/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password }: AuthCredentialsDto = authCredentialsDto;
    const user: User = await this.findOne({ username });

    if (user && await user.validatePassword(password)) {
      return user.username;
    }

    return null;
  }

  public static async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password }: AuthCredentialsDto = authCredentialsDto;
    const user: User = new User();

    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await UserRepository.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already Exists');
      }

      throw new InternalServerErrorException();
    }
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
