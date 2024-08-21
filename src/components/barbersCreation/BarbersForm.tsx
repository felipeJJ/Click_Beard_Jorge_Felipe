import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "../signup/UserIcon";
import CalendarIcon from "./CalendarIcon";
import Alert from "../alerts/Alert";
import AgeIcon from "./AgeIcon";
import SpecialtySelect from "./SpecialtySelect";

export default function BarbersForm() {
    const [age, setAge] = useState("");
    const [name, setName] = useState("");
    const [hiredAt, setHiredAt] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(
        []
    );
    const [succses, setSuccses] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value.length > 2) {
            value = value.slice(0, 2) + "/" + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + "/" + value.slice(5);
        }
        setHiredAt(value);
    };

    const isValidDate = (dateString: string) => {
        const [day, month, year] = dateString.split("/").map(Number);
        const currentYear = new Date().getFullYear();
        const daysInMonth = new Date(year, month, 0).getDate();

        if (year > currentYear || year < 1900) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > daysInMonth) return false;

        return true;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!name) {
            setError("O nome é obrigatório.");
            return;
        }

        if (!age || parseInt(age, 10) < 18 || parseInt(age, 10) > 100) {
            setError("Idade inválida. Deve ser entre 18 e 100 anos.");
            return;
        }

        if (!hiredAt || hiredAt.length !== 10 || !isValidDate(hiredAt)) {
            setError("Data inválida. Por favor, insira uma data coerente.");
            return;
        }

        if (selectedSpecialties.length === 0) {
            setError("Por favor, selecione ao menos uma especialidade.");
            return;
        }

        setError("");

        console.log({
            name,
            age,
            hiredAt,
            specialties: selectedSpecialties,
        });

        setSuccses("Formulário enviado com sucesso!");
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
            }, 3000);

            return () => clearTimeout(errorTimer);
        }
    }, [error, succses, router]);

    return (
        <main className="font-serif flex items-center justify-center h-full text-gray-500 overflow-hidden">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center gap-4 w-80"
            >
                <h2 className="font-bold text-3xl mb-3">Cadastrar Barbeiro</h2>
                <div className="w-full">
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <UserIcon />
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full"
                            placeholder="Nome"
                        />
                    </label>
                </div>
                <div className="w-full">
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <CalendarIcon />
                        <input
                            id="hiredAt"
                            type="text"
                            value={hiredAt}
                            onChange={handleDateChange}
                            className="w-full"
                            placeholder="Data de contratação"
                            maxLength={10}
                        />
                    </label>
                </div>
                <div className="w-full">
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <AgeIcon />
                        <input
                            id="age"
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="w-full"
                            placeholder="Idade"
                            min={18}
                            max={100}
                        />
                    </label>
                </div>
                <SpecialtySelect
                    selectedSpecialties={selectedSpecialties}
                    setSelectedSpecialties={setSelectedSpecialties}
                />
                {error && (
                    <div className="w-full relative mb-8">
                        <div className="absolute w-full -translate-y-11 m">
                            <Alert errorMessage={error} />
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="btn btn-neutral w-full text-lg mt-5 bg-gray-700"
                >
                    Confirmar
                </button>
            </form>
        </main>
    );
}
