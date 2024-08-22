import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";
import { verifyJWT } from "@/app/lib/auth";

export async function PUT(
    req: NextRequest,
    { params }: { params: { appointment_id: string } }
) {
    try {
        const cookies = req.cookies;
        const token = cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { error: "Token não fornecido." },
                { status: 401 }
            );
        }

        const payload = verifyJWT(token);
        if (!payload) {
            return NextResponse.json(
                { error: "Token inválido." },
                { status: 401 }
            );
        }

        const { appointment_id } = params;

        if (!appointment_id) {
            return NextResponse.json(
                { error: "ID do agendamento não fornecido." },
                { status: 400 }
            );
        }

        const result = await query(
            `
            UPDATE appointments 
            SET status = 'cancelado' 
            WHERE appointment_id = $1 AND client_id = $2
            RETURNING *
            `,
            [appointment_id, payload.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                {
                    error: "Agendamento não encontrado ou você não tem permissão para cancelá-lo.",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Agendamento cancelado com sucesso." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao cancelar agendamento:", error);
        return NextResponse.json(
            { error: "Erro ao cancelar agendamento." },
            { status: 500 }
        );
    }
}
