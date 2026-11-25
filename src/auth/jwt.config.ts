import { ConfigService } from '@nestjs/config';

/**
 * Single source of truth for the JWT secret.
 * Both the signer (JwtModule) and the verifier (JwtStrategy) call this,
 * so they can never disagree.
 */
export function getJwtSecret(config: ConfigService): string {
  const secret = config.get<string>('JWT_SECRET');
  if (!secret || !secret.trim()) {
    throw new Error(
      'JWT_SECRET is not set. Copy .env.example to .env and set JWT_SECRET to a long random string (32+ characters).',
    );
  }
  return secret;
}
