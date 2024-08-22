"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Succses from "../alerts/Succses";
import { useTokenContext } from "@/app/context/tokenContext";
import { usePageContext } from "@/app/context/pageToShow";

export default function NavBar() {
    const { role } = useTokenContext();
    const { setBarbers, setAdminScheduling, setScheduling } = usePageContext();

    const router = useRouter();
    const [succses, setSuccses] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            }, 1000);

            return () => clearTimeout(redirectTimer);
        }
    }, [succses]);

    const handleBarbers = () => {
        setBarbers(true);
        setAdminScheduling(false);
        setScheduling(false);
        setIsDropdownOpen(false);
    };

    const hadleScheduling = () => {
        setIsDropdownOpen(false);
        setBarbers(false);

        if (role === "admin") {
            setScheduling(false);
            setAdminScheduling(true);
        } else setScheduling(true);
    };

    return (
        <div className="navbar bg-base-100 shadow-md rounded-lg px-10 m-1 w-screen">
            <div className="dropdown dropdown-end">
                <div className="flex-none">
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
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
                {isDropdownOpen && (
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 gap-1 shadow transform translate-x-40"
                    >
                        {role === "admin" && (
                            <li>
                                <button onClick={handleBarbers}>
                                    Barbeiros
                                </button>
                            </li>
                        )}
                        <li>
                            <a onClick={hadleScheduling}>Agendamentos</a>
                        </li>
                        <li>
                            <a onClick={handleLogout}>Logout</a>
                        </li>
                    </ul>
                )}
            </div>

            <div className="flex-1">
                <a
                    className="btn btn-ghost text-2xl"
                    onClick={hadleScheduling}
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
