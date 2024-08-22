import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { name, age, hiredAt, selectedSpecialties } = await req.json();

        await query("BEGIN");

        const result = await query(
            "INSERT INTO barbers (name, age, hired_date, created_at) VALUES ($1, $2, $3, NOW()) RETURNING barber_id",
            [name, age, hiredAt]
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
