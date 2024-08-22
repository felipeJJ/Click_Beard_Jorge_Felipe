import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { name, age, hiredAt, selectedSpecialties } = await req.json();

        const [day, month, year] = hiredAt.split("/");
        const formattedHiredAt = `${month}/${day}/${year}`;

        await query("BEGIN");

        const result = await query(
            "INSERT INTO barbers (name, age, hired_date, created_at) VALUES ($1, $2, $3, NOW()) RETURNING barber_id",
            [name, age, formattedHiredAt]
        );

        const barberId = result.rows[0].barber_id;

        for (const specialty of selectedSpecialties) {
            await query(
                "INSERT INTO barber_specialties (barber_id, specialty_id, created_at) VALUES ($1, $2, NOW())",
                [barberId, specialty.value]
            );
        }

        await query("COMMIT");

        return NextResponse.json(
            { message: "Barbeiro cadastrado com sucesso!" },
            { status: 200 }
        );
    } catch (error) {
        await query("ROLLBACK");
        console.error("Erro ao cadastrar barbeiro:", error);
        return NextResponse.json(
            { error: "Erro ao cadastrar barbeiro." },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const specialty_id = req.nextUrl.searchParams.get("specialty_id");
        const appointment_date =
            req.nextUrl.searchParams.get("appointment_date");

        if (!specialty_id || !appointment_date) {
            return NextResponse.json(
                {
                    error: "Especialidade e data do agendamento são obrigatórios.",
                },
                { status: 400 }
            );
        }

        const barbersResult = await query(
            `
            SELECT b.barber_id, b.name
            FROM barbers b
            INNER JOIN barber_specialties bs ON b.barber_id = bs.barber_id
            WHERE bs.specialty_id = $1
            `,
            [specialty_id]
        );

        const barbers = barbersResult.rows;

        if (barbers.length === 0) {
            return NextResponse.json(
                {
                    error: "Nenhum barbeiro encontrado para a especialidade selecionada.",
                },
                { status: 404 }
            );
        }

        const availableBarbers = [];

        for (const barber of barbers) {
            const appointmentsResult = await query(
                `
                SELECT appointment_time
                FROM appointments
                WHERE barber_id = $1 AND appointment_date = $2 AND status != 'cancelado'
                `,
                [barber.barber_id, appointment_date]
            );

            const appointments = appointmentsResult.rows;

            if (appointments.length === 0) {
                availableBarbers.push(barber);
            } else {
                const bookedTimes = appointments.map(
                    (appointment) => appointment.appointment_time
                );

                let isAvailable = true;
                for (let hour = 8; hour <= 18; hour++) {
                    for (let minute = 0; minute < 60; minute += 30) {
                        const time = `${String(hour).padStart(2, "0")}:${String(
                            minute
                        ).padStart(2, "0")}`;
                        if (!bookedTimes.includes(time)) {
                            isAvailable = true;
                            break;
                        } else {
                            isAvailable = false;
                        }
                    }
                    if (isAvailable) break;
                }

                if (isAvailable) {
                    availableBarbers.push(barber);
                }
            }
        }

        if (availableBarbers.length > 0) {
            return NextResponse.json(availableBarbers, { status: 200 });
        } else {
            return NextResponse.json(
                {
                    error: "Nenhum barbeiro disponível para o horário e data selecionados.",
                },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
        return NextResponse.json(
            { error: "Erro ao buscar barbeiros." },
            { status: 500 }
        );
    }
}
