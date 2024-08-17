import { HttpException, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service";
import { LoginDto, RegisterDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) { };

  public salt = bcrypt.genSaltSync();

  async login(data: LoginDto) {
    const user = await this.userService.findUserByEmail(data.email);
    if (!bcrypt.compare(data.password, user.password)) {
      throw new HttpException({
        success: false,
        messages: ["Wrong credentials"],
        status: 400,
        data: [],
      }, 200)
    }
    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_AUTH_TOKEN, expiresIn: "1h" }),
    }
  }

  async register (data: RegisterDto) {
    const user = await this.userService.createUserAccount({
      email: data.email,
      name: data.name,
      password: await bcrypt.hash(data.password, this.salt),
    })

    const payload = user;

    return {
      access_token: await this.jwtService.signAsync(payload, { secret: process.env.JWT_AUTH_TOKEN, expiresIn: "1h" }),
    }
  }
}