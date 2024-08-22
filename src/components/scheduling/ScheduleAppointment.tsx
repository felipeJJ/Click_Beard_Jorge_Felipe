import React, { useState, useEffect } from "react";
import axios from "axios";
import CalendarIcon from "../barbersCreation/CalendarIcon";
import Scissors from "./Scissors";
import UserIcon from "../signup/UserIcon";
import Alert from "../alerts/Alert";
import Succses from "../alerts/Succses";

interface Specialty {
    specialty_id: string;
    name: string;
}

interface Barber {
    barber_id: string;
    name: string;
}

export default function ScheduleAppointment() {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState("");
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [selectedBarber, setSelectedBarber] = useState("");
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [appointmentDate, setAppointmentDate] = useState("");
    const [succses, setSuccses] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const response = await axios.get<Specialty[]>(
                    "/api/specialties"
                );
                setSpecialties(response.data);
            } catch (error) {
                console.error("Erro ao buscar especialidades:", error);
            }
        };

        fetchSpecialties();
    }, []);

    useEffect(() => {
        if (selectedSpecialty && appointmentDate) {
            const fetchBarbers = async () => {
                try {
                    const response = await axios.get<Barber[]>("/api/barbers", {
                        params: {
                            specialty_id: selectedSpecialty,
                            appointment_date: appointmentDate,
                        },
                    });
                    setBarbers(response.data);
                } catch (error) {
                    console.error("Erro ao buscar barbeiros:", error);
                }
            };

            fetchBarbers();
        }
    }, [selectedSpecialty, appointmentDate]);

    useEffect(() => {
        if (selectedBarber && appointmentDate) {
            const fetchAvailableTimes = async () => {
                try {
                    const response = await axios.get<string[]>(
                        "/api/availableTimes",
                        {
                            params: {
                                barber_id: selectedBarber,
                                appointment_date: appointmentDate,
                            },
                        }
                    );
                    setAvailableTimes(response.data);
                } catch (error) {
                    console.error(
                        "Erro ao buscar horários disponíveis:",
                        error
                    );
                }
            };

            fetchAvailableTimes();
        }
    }, [selectedBarber, appointmentDate]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post("/api/appointments", {
                barber_id: selectedBarber,
                specialty_id: selectedSpecialty,
                appointment_date: appointmentDate,
                appointment_time: selectedTime,
            });
            if (response.status === 200) {
                setSuccses("Hora agendado com sucesso!");
            }
        } catch (error) {
            setError("Ocorreu um erro inesperado, por favor mais tarde.");
        }
    };

    useEffect(() => {
        if (succses) {
            setError("");
            const redirectTimer = setTimeout(() => {
                setSuccses("");
                setAppointmentDate("");
                setSelectedSpecialty("");
                setSelectedBarber("");
                setSelectedTime("");
            }, 3000);

            return () => clearTimeout(redirectTimer);
        }
    
        if (error) {
            setSuccses("");
            const errorTimer = setTimeout(() => {
                setError("");
            }, 5000);
    
            return () => clearTimeout(errorTimer);
        }
    }, [error, succses]);

    return (
        <main className="font-serif flex items-center justify-center h-full text-gray-500 ">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center gap-4 w-72"
            >
                <h2 className="font-bold text-3xl mb-3">Agende um horário</h2>
                <div className="w-full">
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <CalendarIcon />
                        <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full"
                            placeholder="Data de contratação"
                            maxLength={10}
                            required
                        />
                    </label>
                </div>
                <div className="w-full">
                    <label className="input input-bordered w-full flex items-center gap-2">
                        <Scissors />
                        <select
                            className="bg-transparent border-none outline-none w-full"
                            value={selectedSpecialty}
                            onChange={(e) =>
                                setSelectedSpecialty(e.target.value)
                            }
                            required
                        >
                            <option value="">
                                Selecione uma especialidade
                            </option>
                            {specialties.map((specialty) => (
                                <option
                                    key={specialty.specialty_id}
                                    value={specialty.specialty_id}
                                >
                                    {specialty.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                {barbers.length > 0 && (
                    <div className="w-full">
                        <label className="input input-bordered w-full flex items-center gap-2">
                            <UserIcon />
                            <select
                                className="bg-transparent border-none outline-none w-full"
                                value={selectedBarber}
                                onChange={(e) =>
                                    setSelectedBarber(e.target.value)
                                }
                                required
                            >
                                <option value="">Selecione um barbeiro</option>
                                {barbers.map((barber) => (
                                    <option
                                        key={barber.barber_id}
                                        value={barber.barber_id}
                                    >
                                        {barber.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}
                {availableTimes.length > 0 && (
                    <div className="w-full">
                        <label className="input input-bordered w-full flex items-center gap-2">
                            <select
                                className="bg-transparent border-none outline-none w-full"
                                value={selectedTime}
                                onChange={(e) =>
                                    setSelectedTime(e.target.value)
                                }
                                required
                            >
                                <option value="">Selecione um horário</option>
                                {availableTimes.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                )}
                {error && (
                    <div className="w-full relative mb-8">
                        <div className="absolute w-full -translate-y-11 m">
                            <Alert errorMessage={error} />
                        </div>
                    </div>
                )}
                {succses && (
                    <div className="w-full relative mb-8">
                        <div className="absolute w-full -translate-y-11 m">
                            <Succses succsesMessage={succses} />
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
