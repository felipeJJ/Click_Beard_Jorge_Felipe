import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
    try {
        const barber_id = req.nextUrl.searchParams.get("barber_id");
        const appointment_date =
            req.nextUrl.searchParams.get("appointment_date");

        if (!barber_id || !appointment_date) {
            return NextResponse.json(
                { error: "Barbeiro e data do agendamento são obrigatórios." },
                { status: 400 }
            );
        }

        const result = await query(
            `
            SELECT appointment_time 
            FROM appointments 
            WHERE barber_id = $1 AND appointment_date = $2 AND status != 'cancelado'
            `,
            [barber_id, appointment_date]
        );

        const bookedTimes = result.rows.map((row) => row.appointment_time);

        const times = [];
        for (let hour = 8; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${String(hour).padStart(2, "0")}:${String(
                    minute
                ).padStart(2, "0")}`;
                if (!bookedTimes.includes(time)) {
                    times.push(time);
                }
            }
        }

        return NextResponse.json(times, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error);
        return NextResponse.json(
            { error: "Erro ao buscar horários disponíveis." },
            { status: 500 }
        );
    }
}
