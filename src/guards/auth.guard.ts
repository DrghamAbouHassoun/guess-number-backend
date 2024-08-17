import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException({
        success: false,
        messages: ["Invalid token"],
        status: 498,
        data: [],
      }, 200)
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_AUTH_TOKEN
        },
      )

      request["user"] = payload;
    } catch (error) {
      throw new HttpException({
        success: false,
        messages: ["Unauthorized"],
        status: 401,
        data: [],
      }, 200)
    }
    return true;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization.split(" ");
    return type === "Bearer" ? token : undefined;
  }
}