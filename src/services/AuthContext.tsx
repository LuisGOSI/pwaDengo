import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import supabase from "./supabase.js"

type AuthContextType = {
    session: Session | null;
    user: User | null;
    role: number | null;
    loading: boolean;
    userData: any | null;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    role: null,
    loading: true,
    userData: null,
    signOut: async () => { },
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userData, setUserData] = useState<any>(null);

    // Obtener sesión y usuario de Supabase
    useEffect(() => {
        const getInitialSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Consultar el rol en tu tabla de usuarios
    useEffect(() => {
        const fetchRole = async () => {
            if (!user) {
                setRole(null);
                return;
            }

            const { data, error } = await supabase
                .from("usuarios")
                .select("rol_id, nombre, apellidos")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Error obteniendo rol:", error);
                setRole(null);
            } else {
                setRole(Number(data.rol_id));
                setUserData(data);
            }
        };

        fetchRole();
    }, [user]);


    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ session, user, role, loading, userData, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
