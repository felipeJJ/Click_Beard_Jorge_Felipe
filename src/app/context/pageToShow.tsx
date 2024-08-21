import { ReactNode, createContext, useContext, useState } from "react";

const PageContext = createContext({
    scheduling: false,
    adminScheduling: false,
    barbers: false,
    setScheduling: (value: boolean) => {},
    setAdminScheduling: (value: boolean) => {},
    setBarbers: (value: boolean) => {},
});

export const usePageContext = () => {
    return useContext(PageContext);
};

interface providerProps {
    children: ReactNode;
}

export function PageContextProvider({ children }: providerProps) {
    const [scheduling, setScheduling] = useState(false);
    const [adminScheduling, setAdminScheduling] = useState(false);
    const [barbers, setBarbers] = useState(false);

    return (
        <PageContext.Provider
            value={{
                scheduling,
                adminScheduling,
                barbers,
                setBarbers,
                setAdminScheduling,
                setScheduling,
            }}
        >
            {children}
        </PageContext.Provider>
    );
}
