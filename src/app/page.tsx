"use client";

import { useEffect, useState } from "react";
import SigninForm from "@/components/login/SigninForm";
import { usePageContext } from "./context/pageToShow";
import { useTokenContext } from "./context/tokenContext";
import BarbersForm from "@/components/barbersCreation/BarbersForm";
import CustomerScheduling from "@/components/scheduling/ScheduleAppointment";

export default function Home() {
    const { isValid } = useTokenContext();
    const { barbers, scheduling, setScheduling } = usePageContext();
    const [loading, setLoading] = useState(true);

    if (isValid && !scheduling && !barbers) {
        setScheduling(true);
    }

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
            {!isValid && <SigninForm />}
            {barbers && <BarbersForm />}
        </main>
    );
}
