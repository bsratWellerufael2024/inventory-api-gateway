// src/types/request.d.ts

import { JwtPayload } from '@nestjs/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Assuming JwtPayload is the decoded token payload
    }
  }
}
