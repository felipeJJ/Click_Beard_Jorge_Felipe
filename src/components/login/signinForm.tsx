"use client";

import PasswordIcon from "./PasswordIcon";
import EmailIcon from "./EmailIcon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../alerts/Alert";
import Succses from "../alerts/Succses";

export default function Signin() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [succses, setSuccses] = useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const res = await axios.post("/api/auth/login", {
                email,
                password,
            });
            if (res.status === 200) {
                console.log("entroi");
                setSuccses("Login efetuado com sucesso!");
            }
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                setError("Email ou senha inválidos");
            } else {
                console.error(
                    "Falha no login",
                    error.response?.data?.error || error.message
                );
                setError("Ocorreu um erro inesperado.");
            }
        }
    };

    useEffect(() => {
        if (succses) {
            const redirectTimer = setTimeout(() => {
                router.push("/");
            }, 2000);

            return () => clearTimeout(redirectTimer);
        }

        if (error) {
            const errorTimer = setTimeout(() => {
                setError("");
                setEmail("");
                setPassword("");
            }, 5000);

            return () => clearTimeout(errorTimer);
        }
    }, [error, succses, router]);

    return (
        <div className="font-serif flex items-center justify-center  text-gray-700 overflow-hidden">
            <div className="bg-gray-200 py-20 p-12 rounded-2xl w-96 max-w-full my-24">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col justify-center items-center gap-4"
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
                <div className="w-full flex gap-2 mt-3">
                    <div className="w-2/5 h-[1px] bg-[#DCE2E5] mt-6"></div>
                    <p className="text-lg translate-y-2">ou</p>
                    <div className="w-2/5 h-[1px] bg-[#DCE2E5] mt-6"></div>
                </div>
                <button
                    className="btn btn-neltral w-full text-lg mt-7 bg-gray-300"
                    onClick={() => router.push("/signup")}
                >
                    {" "}
                    Inscrever-se{" "}
                </button>
                {error && <Alert errorMessage={error} />}
                {succses && <Succses succsesMessage={succses} />}
            </div>
        </div>
    );
}
