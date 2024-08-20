import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { setCookie } from "nookies";
import { NextResponse } from "next/server";

const user = {
    id: "1",
    email: "user@example.com",
    password: bcrypt.hashSync('password123', 8),
};

export async function POST(
    req: Request,
    res: Response
) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (email !== user.email || !bcrypt.compareSync(password, user.password)) {
            throw new Error("Email ou senha inválidos");
        }
    
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "default-secret",
            {
                expiresIn: "1h",
            }
        );
    
        setCookie({ res }, "token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 3600,
            path: "/",
        });

        return(
            NextResponse.json(
                { message: "Login bem-sucedido"},
                { status: 200 }
            )
        );
    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Erro ao fazer Login", error: (error as Error).message },
            { status: 500 }
        )
    }
}

