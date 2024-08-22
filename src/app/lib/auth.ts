import jwt from 'jsonwebtoken';

export function verifyJWT(token: string) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined");
        }
        const decoded = jwt.verify(token, secret);
        return decoded as { userId: string, role: string };
    } catch (error) {
        console.error("Erro ao verificar JWT:", error);
        return null;
    }
}
