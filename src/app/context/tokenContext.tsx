import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { parseCookies } from "nookies";

const TokenContext = createContext({
    isValid: false,
    role: "",
    setIsValid: (value: boolean) => {},
    setRole: (value: string) => {},
});

export const useTokenContext = () => {
    return useContext(TokenContext);
};

interface providerProps {
    children: ReactNode;
}

export function TokenContextProvider({ children }: providerProps) {
    const [isValid, setIsValid] = useState(false);
    const [role, setRole] = useState("");

    useEffect(() => {
        const cookies = parseCookies();
        const token = cookies.token;

        if (token) {
            fetch("/api/tokenVerify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.isValid) {
                        setIsValid(true);
                        setRole(data.role);
                    } else {
                        setIsValid(false);
                    }
                })
                .catch((err) => {
                    console.error("Error verifying token:", err);
                    setIsValid(false);
                });
        } else {
            setIsValid(false);
        }
    }, []);

    return (
        <TokenContext.Provider
            value={{
               isValid, role, setRole, setIsValid,
            }}
        >
            {children}
        </TokenContext.Provider>
    );
}
