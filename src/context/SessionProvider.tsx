import api from "@/api";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from 'uuid';
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type SessionContextType = {
    sessionId: string | null;
    error: Error | null;
};

const SessionContext = createContext<SessionContextType | undefined>(
    undefined
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [sessionId, setSessionId] = useState<string | null>(null);

    if (sessionId === null) {
        setSessionId(
            uuidv4()
        );
    }


    const createSession = async () => {
        const result = await api.post(
            `https://dev.waterpath.venthic.com/api/session/create/?session_id=${sessionId}`
        );
        return result.data;
    };

    const { data, error, isFetching } = useQuery({
        queryKey: ["session"],
        queryFn: createSession,
        enabled: sessionId !== null,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    const obj = useMemo(
        () => ({
            sessionId,
            error
        }),
        [data, isFetching, error]
    );



    return (
        <SessionContext.Provider value={obj}>
            {children}
        </SessionContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSession = (): SessionContextType => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
