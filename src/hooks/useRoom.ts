import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { database } from '../services/firebase'
import { NODE_PARENT_VALIDATIONS } from "@babel/types";

// Pra declarar tipagem de um objeto usa-se o Record. chave é string e o valor é um objeto
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    } 
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

type QuestionType = {
    id: string;

    author: {
        name: string;
        avatar: string;
    } 
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
    likeCount: number;
    likeId: string | undefined;    

}

export function useRoom(roomId: string){
    const { user } = useAuth();
    //Estado que vai armazenar as perguntas já tratadas
    const [questions, setQuestions] = useState<QuestionType[]>([]);
    const [title, setTitle] = useState('');

    // Disparo uma função sempre que a variável roomId sofrer alteração
    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        // Toda vez que a sala em questão sofre alteração nos seus valores, uma função é disparada
        roomRef.on('value', room => {
            
            // Room.val() Retorna as questions como objeto, e precisamos dela como array
            const databaseRoom = room.val();

            // São as questões já tipadas. Se caso não tiver pergunta retorna um objeto vazio
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            console.log(firebaseQuestions)
            
            //Transforma o objeto de questions em um array {nome: "Bryan", idade: 2} ===> [ ["nome", "Bryan"], ["idade", 2] ]
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,

                    /* O user.id é uma dependencia do use effect, pois é uma variável externa. Caso o usuário 
                    troque de id, teria que carregar tudo isso novamente, por isso ela também deve ser monitada */
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                    // Caso não retorne nada, ele nem acessa a posição zero, que é a chave
                }
            })

            setTitle(databaseRoom.title) 
            setQuestions(parsedQuestions)
            
            return () => {
                roomRef.off('value')
            }

        })
    }, [roomId, user?.id]);

    return { questions, title }
}