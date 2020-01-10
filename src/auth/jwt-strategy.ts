import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

export class JwtStrategy extends PassportStrategy(Strategy) {

  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret',
    });
  }

  public async validate(payload: JwtPayload) {
    const { username }: JwtPayload = payload;
    const user: User = await this.userRepository.findOne({ username });

    if(!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
