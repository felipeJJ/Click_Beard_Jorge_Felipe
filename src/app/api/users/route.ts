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
            [name, email, passwordHash, "client"]
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
