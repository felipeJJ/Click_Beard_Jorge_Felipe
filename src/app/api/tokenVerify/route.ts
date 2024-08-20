import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: 'Token is required' }, { status: 400 });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }

        try {
            const decoded = jwt.verify(token, secret);
            return NextResponse.json({ isValid: true, role: (decoded as any).role }, { status: 200 });
        } catch (err) {
            return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong', error: (error as Error).message }, { status: 500 });
    }
}
