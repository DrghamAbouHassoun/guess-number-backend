import { Body, Controller, Get, Post, UseGuards, Request } from "@nestjs/common";
import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("/auth")
export class AuthController {
    constructor(private authService: AuthService) {}
    
    @Post("/login")
    async login(@Body() data: LoginDto) {
        const result = await this.authService.login(data);
        return {
            success: true,
            messages: ["Login successfully"],
            data: result,
            status: 200,
        }
    }

    @Post("/register")
    async register (@Body() data: RegisterDto) {
        const result = await this.authService.register(data);
        return {
            success: true,
            messages: ["Login successfully"],
            data: result,
            status: 201,
        }
    }

    @UseGuards(AuthGuard)
    @Get("/profile")
    getProfile(@Request() req) {
      return req.user;
    }
}