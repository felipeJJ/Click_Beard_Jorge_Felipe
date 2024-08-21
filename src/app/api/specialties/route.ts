import { NextResponse, NextRequest } from "next/server";
import { query } from "@/app/lib/db";

export async function GET(req: NextRequest) {
    try {
        const result = await query(
            "SELECT specialty_id, name FROM specialties ORDER BY name"
        );

        if (result?.rowCount && result.rowCount > 0) {
            const specialties = result.rows;
            return NextResponse.json(specialties, { status: 200 });
        } else {
            return NextResponse.json(
                { error: "Nenhuma especialidade encontrada." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Erro ao buscar especialidades:", error);
        return NextResponse.json(
            { error: "Erro ao buscar especialidades." },
            { status: 500 }
        );
    }
}
