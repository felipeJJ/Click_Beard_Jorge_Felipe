"use client";

import { useEffect, useState } from "react";
import SigninForm from "@/components/login/SigninForm";
import { usePageContext } from "./context/pageToShow";
import { useTokenContext } from "./context/tokenContext";
import BarbersForm from "@/components/barbersCreation/BarbersForm";
import CustomerScheduling from "@/components/scheduling/ScheduleAppointment";
import Schedule from "@/components/adminScheduling/Schedule";

export default function Home() {
    const { isValid, role } = useTokenContext();
    const {
        barbers,
        scheduling,
        adminScheduling,
        setScheduling,
        setAdminScheduling,
    } = usePageContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isValid && role === "admin" && !barbers) {
            setAdminScheduling(true);
        } else {
            if (isValid && !scheduling && !barbers) {
                setScheduling(true);
            }
        }
    }, [barbers, isValid, role, scheduling, setAdminScheduling, setScheduling]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <span className="loading loading-dots loading-sm"></span>
            </div>
        );
    }

    return (
        <main className="h-screen w-screen">
            {scheduling && <CustomerScheduling />}
            {adminScheduling && <Schedule />}
            {!isValid && <SigninForm />}
            {barbers && <BarbersForm />}
        </main>
    );
}
