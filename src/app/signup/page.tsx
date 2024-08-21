"use client";

import PasswordIcon from "@/components/login/PasswordIcon";
import EmailIcon from "@/components/login/EmailIcon";
import UserIcon from "@/components/signup/UserIcon";
import Succses from "@/components/alerts/Succses";
import Alert from "@/components/alerts/Alert";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [succses, setSuccses] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email || !password || !name) {
            setError("Por favor, preencha todos os campos");
            return;
        } else {
            try {
                const response = await axios.post("/api/users", {
                    name,
                    email,
                    password,
                });
                if (response.status === 200) {
                    setSuccses("Usário criado com sucesso!");

                }
            } catch (error: any) {
                setError("Erro ao criar o usuário, tente mais tarde!");
            }
        }
    };

    useEffect(() => {
        if (succses) {
            setError("");
            const redirectTimer = setTimeout(() => {
                router.push("/");
            }, 1000);

            return () => clearTimeout(redirectTimer);
        }

        if (error) {
            const errorTimer = setTimeout(() => {
                setError("");
                setSuccses("");
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
                    <h2 className="font-bold text-3xl mb-3 ">
                        Crie seu usuário
                    </h2>
                    <div>
                        <label className="input input-bordered min-w-max flex items-center gap-2">
                            <UserIcon />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="grow"
                                placeholder="Nome"
                            />
                        </label>
                    </div>
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
                        Confirmar{" "}
                    </button>
                </form>
                {error && <Alert errorMessage={error} />}
                {succses && <Succses succsesMessage={succses} />}
            </div>
        </div>
    );
}
