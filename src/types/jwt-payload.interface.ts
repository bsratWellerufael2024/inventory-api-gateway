// src/types/jwt-payload.interface.ts

export interface JwtPayload {
  sub: string; // User ID or whatever is in the JWT payload
  username: string; // Example, can be whatever is part of your JWT payload
}
