import { NextApiRequest, NextApiResponse } from "next";
import { parseCookies } from "nookies";
import jwt from "jsonwebtoken";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { token } = parseCookies({ req });

    if (!token) {
        return res.status(401).json({ error: "Token não encontrado" });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET ?? "default-secret"
        );
        res.status(200).json({ user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
    }
}
