import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
    try {
        const barbers = await query(`
            SELECT 
                barber_id, 
                name AS barber_name 
            FROM barbers
            ORDER BY name
        `);

        return NextResponse.json(barbers.rows, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar barbeiros:", error);
        return NextResponse.json(
            { error: "Erro ao buscar barbeiros." },
            { status: 500 }
        );
    }
}
