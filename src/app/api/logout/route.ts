import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ message: 'Logout bem-sucedido' });
    
    response.headers.set(
        'Set-Cookie',
        `token=; Path=/; Max-Age=0; HttpOnly; Secure=${process.env.NODE_ENV !== 'development'}`
    );

    return response;
}
