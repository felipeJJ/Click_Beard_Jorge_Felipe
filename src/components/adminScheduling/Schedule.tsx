import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

interface Appointment {
    barber_name: string;
    specialty_name: string;
    client_name: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
}

interface Barber {
    barber_id: string;
    barber_name: string;
}

export default function BarberScheduleTable() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [barbers, setBarbers] = useState<Barber[]>([]);
    const [currentDate, setCurrentDate] = useState(moment().startOf("day"));

    useEffect(() => {
        const fetchBarbers = async () => {
            try {
                const response = await axios.get<Barber[]>(
                    "/api/barbers/getAllBarbers"
                );
                setBarbers(response.data);
            } catch (error) {
                console.error("Erro ao buscar barbeiros:", error);
            }
        };

        const fetchAppointments = async () => {
            try {
                const response = await axios.get<Appointment[]>(
                    "/api/appointments/getAppointments"
                );
                setAppointments(response.data);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
            }
        };

        fetchBarbers();
        fetchAppointments();
    }, []);

    const getAppointmentsForBarberAndTime = (
        barber_name: string,
        time: string
    ) => {
        return appointments.filter(
            (appointment) =>
                appointment.barber_name === barber_name &&
                moment(appointment.appointment_date).isSame(
                    currentDate,
                    "day"
                ) &&
                appointment.appointment_time.startsWith(time)
        );
    };

    const times = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
    ];

    const handlePreviousDay = () => {
        setCurrentDate(currentDate.clone().subtract(1, "days"));
    };

    const handleNextDay = () => {
        setCurrentDate(currentDate.clone().add(1, "days"));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="btn btn-outline"
                    onClick={handlePreviousDay}
                    disabled={currentDate.isSame(moment(), "day")}
                >
                    Dia Anterior
                </button>
                <h2 className="text-2xl font-bold">
                    Agendamentos para {currentDate.format("DD/MM/YYYY")}
                </h2>
                <button
                    className="btn btn-outline"
                    onClick={handleNextDay}
                    disabled={currentDate.isSame(
                        moment().add(14, "days"),
                        "day"
                    )}
                >
                    Próximo Dia
                </button>
            </div>
            <div className="overflow-x-auto">
                <table
                    className="table table-zebra w-full"
                    style={{ tableLayout: "fixed" }}
                >
                    <thead>
                        <tr>
                            <th className="">Horário</th>
                            {barbers.map((barber, index) => (
                                <th key={index}>{barber.barber_name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time) => (
                            <tr key={time}>
                                <td>{time}</td>
                                {barbers.map((barber, index) => {
                                    const appointmentsForTime =
                                        getAppointmentsForBarberAndTime(
                                            barber.barber_name,
                                            time
                                        );
                                    return (
                                        <td
                                            key={index}
                                            className="overflow-hidden text-ellipsis whitespace-nowrap"
                                        >
                                            {appointmentsForTime.length > 0 ? (
                                                <div>
                                                    {appointmentsForTime.map(
                                                        (appointment, i) => (
                                                            <div key={i}>
                                                                {
                                                                    appointment.specialty_name
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    appointment.client_name
                                                                }
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div>Disponível</div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
