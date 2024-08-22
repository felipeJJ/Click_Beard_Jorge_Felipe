import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
    try {
        const appointments = await query(`
            SELECT 
                u.name AS client_name,
                b.name AS barber_name, 
                s.name AS specialty_name, 
                a.appointment_date, 
                a.appointment_time, 
                a.status
            FROM appointments a
            JOIN users u ON a.client_id = u.user_id AND u.role = 'client'
            JOIN barbers b ON a.barber_id = b.barber_id
            JOIN specialties s ON a.specialty_id = s.specialty_id
            WHERE a.status != 'cancelado'
            ORDER BY a.appointment_date, a.appointment_time
        `);

        return NextResponse.json(appointments.rows, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return NextResponse.json({ error: "Erro ao buscar agendamentos." }, { status: 500 });
    }
}
