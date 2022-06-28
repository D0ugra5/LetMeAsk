import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseCommands } from "../service/firebase";

interface User {
    id: string;
    name: string;
    avatar: string;
}

type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType)

type AuthContextProviderProps = {
    children: ReactNode;
}


export function AuthContentProvider({ children }: AuthContextProviderProps) {


    const navigatePage = useNavigate();
    const [user, setUser] = useState<User>();
    useEffect(() => {
        firebaseCommands.firebaseInit();
        const auth = firebaseCommands.auth.getAuth();
        const unsubscribe = firebaseCommands.auth.onAuthStateChanged(auth, user => {
            if (user) {
                const { displayName, photoURL, uid } = user;
                if (!displayName || !photoURL) {
                    throw new Error("missing information from google account");
                }

                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                });
                // navigatePage({pathname:'/rooms/new'});
            }
        });
        return () => unsubscribe();
    }, [])

    async function signInWithGoogle() {
        const providers = new firebaseCommands.auth.GoogleAuthProvider();
        const auth = firebaseCommands.auth.getAuth();
        const results = await firebaseCommands.auth.signInWithPopup(auth, providers);
        if (results.user) {
            const { displayName, photoURL, uid } = results.user;
            if (!displayName || !photoURL) {
                throw new Error("missing information from google account");
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            });
        }

    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {children}
        </AuthContext.Provider>

    )
}

export function useAuthContext(): AuthContextType {
    const content = useContext(AuthContext);
    return content;
}


