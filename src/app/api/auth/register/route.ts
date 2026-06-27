import { NextResponse } from 'next/server';
import User, { getUserModel } from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required.' }, { status: 400 });
    }

    await getUserModel();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email is already registered.' }, { status: 409 });
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken({ userId: user._id.toString(), email: user.email, name: user.name });

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
