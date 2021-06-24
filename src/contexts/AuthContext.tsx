import { createContext, ReactNode, useEffect, useState } from 'react';
import { firebase, auth } from '../services/firebase'


type User = {
    id: string;
    name: string;
    avatar: string
}
  
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
    // Sempre que for componente eu uso o ReactNode
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)


export function AuthContextProvider(props: AuthContextProviderProps){
    const [user, setUser] = useState<User>()
  
    // Função que vai disparar quando a variável for mudada. Variável que será monitorada
    // Função que serve o usuário não precisar logar novamente se já tiver logado anteriormente
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        if (user){
            const { displayName, photoURL, uid } = user

            if(!displayName || !photoURL){
                throw new Error('Missing information from Google Account')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
        })

        // Parar de rodar a função caso o usuário saia da sessão
        return () => {
            unsubscribe()
        }
    }, [])


    async function signInWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider()
        const result = await auth.signInWithPopup(provider)
        
        if(result.user){
            const { displayName, photoURL, uid } = result.user

            if(!displayName || !photoURL){
                throw new Error('Missing information from Google Account')
            }

            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }


    return (
        <AuthContext.Provider value={{user, signInWithGoogle}}>
            {props.children}
        </AuthContext.Provider>
    );
}