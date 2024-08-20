import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const user = {
    id: "1",
    email: "1",
    password: bcrypt.hashSync("1", 8),
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (
            email !== user.email ||
            !bcrypt.compareSync(password, user.password)
        ) {
            throw new Error("Email ou senha inválidos");
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        } else {
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1h",
                }
            );
            const cookie = serialize("token", token, {
                secure: process.env.NODE_ENV !== "development",
                maxAge: 3600,
                path: "/",
            });
            const response = NextResponse.json(
                { message: "Login bem-sucedido" },
                { status: 200 }
            );
            response.headers.append("Set-Cookie", cookie);
    
            return response;
        }
    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Erro ao fazer Login", error: (error as Error).message },
            { status: 500 }
        );
    }
}
