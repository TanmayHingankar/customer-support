import { NextResponse } from 'next/server';
import User, { getUserModel } from '@/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const auth = verifyAuth(request);
    await getUserModel();

    const user = await User.findById(auth.userId).select('name email');
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Not authenticated.';
    return NextResponse.json({ success: false, error: message }, { status: 401 });
  }
}
