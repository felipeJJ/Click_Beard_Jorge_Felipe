import { NextRequest, NextResponse } from "next/server";
import { query } from "@/app/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios." },
                { status: 400 }
            );
        }

        const passwordHash = bcrypt.hashSync(password, 8);

        const result = await query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id",
            [name, email, passwordHash, "user"]
        );

        if (result?.rowCount && result.rowCount > 0) {
            return NextResponse.json(
                { message: "Usuário criado com sucesso!" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "Erro ao criar o usuário." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Erro ao criar o usuário:", error);
        return NextResponse.json(
            { error: "Erro ao criar o usuário." },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        const password = searchParams.get("password");

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email e senha são obrigatórios." },
                { status: 400 }
            );
        }

        const result = await query(
            "SELECT user_id, password_hash FROM users WHERE email = $1",
            [email]
        );

        if (result?.rowCount && result.rowCount > 0) {
            const user = result.rows[0];
            const isPasswordValid = bcrypt.compareSync(password, user.password_hash);

            if (isPasswordValid) {
                return NextResponse.json(
                    { message: "Usuário autenticado com sucesso!", userId: user.user_id },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { error: "Senha incorreta." },
                    { status: 401 }
                );
            }
        } else {
            return NextResponse.json(
                { error: "Usuário não encontrado." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Erro ao verificar o usuário:", error);
        return NextResponse.json(
            { error: "Erro ao verificar o usuário." },
            { status: 500 }
        );
    }
}

