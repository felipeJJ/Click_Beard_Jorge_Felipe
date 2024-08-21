import { NextResponse } from "next/server";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(req: Request) {
    const api = axios.create({
        baseURL:
            process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    });

    try {
        const body = await req.json();
        const { email, password } = body;

        const apiResponse = await api.get("/api/users", {
            params: {
                email,
                password,
            },
        });

        if (apiResponse.status !== 200) {
            throw new Error(apiResponse.data.error || "Erro de autenticação");
        } else {
            const user = apiResponse.data;
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            } else {
                const token = jwt.sign(
                    { id: user.id, email: user.email, role: user.role },
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
        }

    } catch (error: unknown) {
        return NextResponse.json(
            { message: "Erro ao fazer Login", error: (error as Error).message },
            { status: 500 }
        );
    }
}
