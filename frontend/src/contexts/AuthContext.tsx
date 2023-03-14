import{ createContext, ReactNode, useState, useEffect } from 'react'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiCliente'

import { toast } from 'react-toastify'

type AuthContextData = {
    user: UserProps;
    estaAutenticado: boolean;
    signIn: (credentials: SingInProps) => Promise<void>
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>
}

type SingInProps = {
    email: string;
    password: string
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData )

export function signOut(){
    try{
        destroyCookie(undefined, '@nextauth.token')
        Router.push('/')
    }catch{
        console.log("Erro ao Deslogar");
    }
}

export function AuthProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const estaAutenticado = !!user;

    useEffect(() => {
        //tentar pegar algo no cookie
        const {'@nextauth.token': token} = parseCookies();

        if(token){
            api.get('/me').then(response => {
                const { id, name, email} = response.data;

                setUser({
                    id,
                    name,
                    email
                })

            })
            .catch(() =>{
                //se der erro desloga user
                signOut();
            })
        }

    }, []) 


   async function signIn({ email, password}: SingInProps){
        try{
            const response = await api.post('/session', {
                email,
                password
            })

            const {id, name, token} = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expirar em 1 mes
                path: "/" //quais caminhos terão acesso ao cookie
            })

            setUser({
                id,
                name,
                email
            })

            //Passar para as proximas requisicoes o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            toast.success("Logado com sucesso!")

            //Redirecionar o user para /dashboard
            Router.push('/dashboard')

        }catch(err){
            toast.error("Erro ao Acessar")
            console.log("ERRO AO ACESSSAR", err);
            
        }
    }

    async function signUp({name, email, password}: SignUpProps){
       try{
        const response =  api.post('/users',{
            name,
            email,
            password,
        })

        toast.success("Conta Criada com sucesso!")

        Router.push('/')
        

       }catch(err){
        toast.error("Erro ao Cadastrar")
        console.log("Erro ao cadastrar", err);
        
       }
        
    }

    return(
        <AuthContext.Provider value={{ user, estaAutenticado, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}