import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_TOKEN_KEY = 'access_token';


export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const authToken = cookieStore.get(AUTH_TOKEN_KEY);
    if (authToken) {
        return NextResponse.json({ isSignedIn: true });
    }
    return NextResponse.json({ isSignedIn: false });
}

export async function DELETE(request: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_TOKEN_KEY);
    return NextResponse.json({ isSignedIn: false });
}