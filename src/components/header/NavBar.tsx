"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Succses from "../alerts/Succses";
import { useTokenContext } from "@/app/context/tokenContext";


export default function NavBar() {
    const router = useRouter();
    const [succses, setSuccses] = useState("");
    const { role } = useTokenContext();

    const handleLogout = async () => {
        try {
            const response = await axios.post("/api/logout");
            if (response.status === 200) {
                setSuccses("Logout efetuado com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    useEffect(() => {
        if (succses) {
            const redirectTimer = setTimeout(() => {
                window.location.reload();
            }, 3000);

            return () => clearTimeout(redirectTimer);
        }
    }, [succses]);

    return (
        <div className="navbar bg-base-100 shadow-md rounded-lg px-10 m-1 w-screen">
            <div className="dropdown dropdown-end">
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-5 w-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 gap-1 shadow transform translate-x-40"
                >
                    {role === "admin" && (
                        <li>
                            <a onClick={() => router.push("/barbeiros")}>
                                Barbeiros
                            </a>
                        </li>
                    )}
                    <li>
                        <a onClick={() => router.push("/barbeiros")}>
                            Agendamentos
                        </a>
                    </li>
                    <li>
                        <a onClick={handleLogout}>Logout</a>
                    </li>
                </ul>
            </div>

            <div className="flex-1">
                <a
                    className="btn btn-ghost text-2xl"
                    onClick={() => router.push("/")}
                >
                    Barbados
                </a>
            </div>
            <div className="w-fit translate-y-8">
                {succses && <Succses succsesMessage={succses} />}
            </div>
        </div>
    );
}
