import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PublicAccess } from 'src/decorators/public_access.decorator';

@Injectable()
// AuthGuard is a custom guard to handle authentication and authorization.
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService, // Service to handle JWT operations.
    private reflector: Reflector, // Used to retrieve metadata set by decorators.
    private configService: ConfigService, // Service to access application configuration.
  ) {}

  // Determines if the current request is allowed to proceed.
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is marked as public using the PublicAccess decorator.
    const isPublic = this.reflector.getAllAndOverride<boolean>(PublicAccess, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true; // Allow access if the route is public.

    const req = context.switchToHttp().getRequest(); // Get the HTTP request object.
    const token = this.extractToken(req); // Extract the JWT token from the request.
    const secret = this.configService.get<string>('JWT_SECRET'); // Retrieve the JWT secret from configuration.

    if (!token) {
      // If no token is provided, throw an UnauthorizedException.
      throw new UnauthorizedException();
    }

    try {
      // Verify the token and attach the payload to the request object.
      const payload = await this.jwtService.verifyAsync(token, {
        secret,
      });
      req['user'] = payload; // Attach the decoded user information to the request.
      return true; // Allow access if the token is valid.
    } catch (err) {
      // If token verification fails, throw a RequestTimeoutException.
      throw new RequestTimeoutException(err);
    }
  }

  // Extracts the JWT token from the Authorization header of the request.
  protected extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') || [];
    if (type !== 'Bearer' || !token) {
      // If the token type is not Bearer or the token is missing, throw an exception.
      throw new ForbiddenException('Invalid token type.');
    }
    return token; // Return the extracted token.
  }
}
