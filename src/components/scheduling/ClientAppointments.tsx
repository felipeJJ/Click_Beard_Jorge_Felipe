import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTokenContext } from "@/app/context/tokenContext";

interface Appointment {
    appointment_id: string;
    appointment_date: string;
    appointment_time: string;
    barber_name: string;
    specialty_name: string;
    status: string;
}

export default function ClientAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { isValid } = useTokenContext();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const response = await axios.get<Appointment[]>(
                    "/api/clientAppointments"
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isValid) {
            fetchAppointments();
        }
    }, [isValid]);

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            await axios.delete(`/api/appointments/${appointmentId}`);
            setAppointments((prevAppointments) =>
                prevAppointments.filter(
                    (appointment) =>
                        appointment.appointment_id !== appointmentId
                )
            );
        } catch (error) {
            console.error("Erro ao cancelar agendamento:", error);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (timeString: string) => {
        return timeString.slice(0, 5);
    };

    if (loading) {
        return <p>Carregando agendamentos...</p>;
    }

    return (
        <div className="font-serif text-gray-500 ">
            <h2 className="font-bold text-3xl mb-4">Meus Agendamentos</h2>
            {appointments.length === 0 ? (
                <p>Você não possui agendamentos.</p>
            ) : (
                <ul className="space-y-4">
                    {appointments.map((appointment) => (
                        <li
                            key={appointment.appointment_id}
                            className="border p-4 rounded-lg shadow border-gray-700"
                        >
                            <p>
                                <strong>Data:</strong>{" "}
                                {formatDate(appointment.appointment_date)}
                            </p>
                            <p>
                                <strong>Horário:</strong>{" "}
                                {formatTime(appointment.appointment_time)}
                            </p>
                            <p>
                                <strong>Barbeiro:</strong>{" "}
                                {appointment.barber_name}
                            </p>
                            <p>
                                <strong>Serviço:</strong>{" "}
                                {appointment.specialty_name}
                            </p>
                            <p>
                                <strong>Status:</strong> {appointment.status}
                            </p>
                            {appointment.status === "agendado" && (
                                <button
                                    className="btn btn-neutral object-center mx-auto bg-gray-700 mt-2"
                                    onClick={() =>
                                        handleCancelAppointment(
                                            appointment.appointment_id
                                        )
                                    }
                                >
                                    Cancelar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
