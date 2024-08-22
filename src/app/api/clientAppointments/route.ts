import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";
import { verifyJWT } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

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

        const client_id = payload.userId;

        await query(
            `
            UPDATE appointments 
            SET status = 'concluído' 
            WHERE client_id = $1 
            AND status = 'agendado' 
            AND appointment_date < CURRENT_DATE 
            OR (appointment_date = CURRENT_DATE AND appointment_time < CURRENT_TIME)
            `,
            [client_id]
        );

        const appointments = await query(
            `
            SELECT 
                a.appointment_id, 
                a.appointment_date, 
                a.appointment_time, 
                b.name AS barber_name, 
                s.name AS specialty_name, 
                a.status 
            FROM appointments a
            JOIN barbers b ON a.barber_id = b.barber_id
            JOIN specialties s ON a.specialty_id = s.specialty_id
            WHERE a.client_id = $1
            ORDER BY a.appointment_date DESC, a.appointment_time ASC
            `,
            [client_id]
        );

        return NextResponse.json(appointments.rows, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return NextResponse.json(
            { error: "Erro ao buscar agendamentos." },
            { status: 500 }
        );
    }
}
