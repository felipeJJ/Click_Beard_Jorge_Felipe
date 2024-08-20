"use client";

import PasswordIcon from "./PasswordIcon";
import EmailIcon from "./EmailIcon";
import React, { useState } from "react";
import axios from "axios";

export default function Signin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", {
                email,
                password,
            });
            if (res.status === 200) {
            }
        } catch (error: any) {
            console.error("Falha no login", error.response.data.error);
        }

        setEmail("");
        setPassword("");
    };

    return (
        <main className="font-serif flex items-center justify-center h-full text-gray-700 overflow-hidden">
            <form
                onSubmit={handleSubmit}
                className="bg-gray-100 py-20 p-12 rounded-lg w-96 max-w-full flex justify-center items-center flex-col gap-4 my-24"
            >
                <h2 className="font-bold text-3xl mb-3 ">Faça seu login</h2>
                <div>
                    <label className="input input-bordered flex items-center gap-2">
                        <EmailIcon />
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="grow"
                            placeholder="Email"
                        />
                    </label>
                </div>
                <div>
                    <label className="input input-bordered min-w-max flex items-center gap-2">
                        <PasswordIcon />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="grow"
                            placeholder="Senha"
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className="btn btn-neltral w-full text-lg mt-5 bg-gray-300"
                >
                    {" "}
                    Entrar{" "}
                </button>
            </form>
        </main>
    );
}
