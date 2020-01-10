import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '@Auth/get-user.decorator';
import { User } from '@Auth/user.entity';

import { AuthCredentialsDto } from '../dtos/auth-credentials.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {

  public constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('/signUp')
  public async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return AuthService.signUp(authCredentialsDto);
  }

  @Post('/signIn')
  public async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string; }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User) {
    console.log(user);
  }
}
