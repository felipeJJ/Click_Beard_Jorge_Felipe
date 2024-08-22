import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";
import { verifyJWT } from "@/app/lib/auth";

export async function POST(req: NextRequest) {
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

        const { barber_id, specialty_id, appointment_date, appointment_time } =
            await req.json();

        if (
            !barber_id ||
            !specialty_id ||
            !appointment_date ||
            !appointment_time
        ) {
            return NextResponse.json(
                { error: "Todos os campos são obrigatórios." },
                { status: 400 }
            );
        }

        const currentDateTime = new Date();
        const appointmentDateTime = new Date(
            `${appointment_date}T${appointment_time}`
        );

        if (appointmentDateTime < currentDateTime) {
            return NextResponse.json(
                {
                    error: "Não é possível agendar para uma data e hora passada.",
                },
                { status: 402 }
            );
        }

        const existingAppointment = await query(
            `
            SELECT appointment_id
            FROM appointments
            WHERE barber_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != 'cancelado'
            `,
            [barber_id, appointment_date, appointment_time]
        );

        if (existingAppointment?.rowCount && existingAppointment.rowCount > 0) {
            return NextResponse.json(
                { error: "O barbeiro já possui um agendamento neste horário." },
                { status: 409 }
            );
        }

        const result = await query(
            `
            INSERT INTO appointments (client_id, barber_id, specialty_id, appointment_date, appointment_time, duration_minutes, status, created_at)
            VALUES ($1, $2, $3, $4, $5, 30, 'agendado', NOW())
            RETURNING appointment_id
            `,
            [
                payload.userId,
                barber_id,
                specialty_id,
                appointment_date,
                appointment_time,
            ]
        );

        return NextResponse.json(
            {
                message: "Agendamento realizado com sucesso!",
                appointment_id: result.rows[0].appointment_id,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        return NextResponse.json(
            { error: "Erro ao criar agendamento." },
            { status: 500 }
        );
    }
}
