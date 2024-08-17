import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";
import { UserService } from "src/modules/users/user.service";

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}
  private readonly logger = new Logger(WsGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean>  {
    this.logger.log('WsGuard invoked here');
    const client = context.switchToWs().getClient();
    const bearerToken = client.headers?.handshack?.authorization || null;
    if (!bearerToken) {
      throw new WsException("No bearer token provided");
    }
    const [type, token] = bearerToken.split(" ")
    if (type!== "Bearer") {
      throw new WsException("Invalid bearer token format");
    }
    if (!token) {
      throw new WsException("No bearer token provided");
    }
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_AUTH_TOKEN })
      context.switchToWs().getData().user = payload
    } catch (error) {
      throw new WsException("Something went wrong")
    }
    return true;
  }
}