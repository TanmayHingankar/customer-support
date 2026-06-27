import jwt from 'jsonwebtoken';

export type AuthPayload = {
  userId: string;
  email: string;
  name: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  return secret;
}

export function generateToken(payload: AuthPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyAuth(request: Request) {
  const token = request.cookies?.get('token')?.value ??
    request.headers.get('cookie')
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('token='))
      ?.split('=')[1];

  if (!token) {
    throw new Error('Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as AuthPayload;
    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
}
