import { useParams } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useEffect } from 'react'
import '../styles/room.scss'

// Pra declarar tipagem de um objeto usa-se o Record. chave é string e o valor é um objeto
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    } 
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;
}>

type Question = {
    id: string;

    author: {
        name: string;
        avatar: string;
    } 
    content: string;
    isHighlighted: boolean;
    isAnswered: boolean;

}

// O parâmetro deve ter um propriedade id do tipo string
type PropsParams = {
    id: string;
}

export function Room(){
    // Uso parâmetros para a rota para pegar o códidgo da sala no URL
    const params = useParams<PropsParams>();
    const {user} = useAuth();
    const [newQuestion, setNewQuestion] = useState('');

    //Estado que vai armazenar as perguntas já tratadas
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTitle] = useState('');
    const roomId = params.id;

    useEffect(() => {
        

        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.once('value', room => {
            // Room.val() Retorna as questions como objeto, e precisamos dela como array
            const databaseRoom = room.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            
            //Transforma o objeto de questions em um array {nome: "Bryan", idade: 2} ===> [ ["nome", "Bryan"], ["idade", 2] ]
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })

            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
            

        })
    }, [roomId]);


    async function handleSendQuestion(event: FormEvent){
        event.preventDefault();
        if(newQuestion.trim() === ''){
            return;
        }

        if(!user){
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)

        setNewQuestion('');

    }
    


    return (
        <div id="page-room">
            <header>
            <div className="content">
                <img src={logoImg} alt="letmeask" />
                <RoomCode code={roomId}/>
            </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    
                        {/* Uma outra forma de fazer o operador ternário que não usa else EXPRESÃO ? ALGUMA COISA : NADA */}
                        {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>

                <form onSubmit={handleSendQuestion}>
                    <textarea 
                        placeholder="O que você quer perguntar"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        { user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )}
                        
                        <Button type="submit"> Enviar pergunta</Button> 
                    </div>

                    
                </form>

                {JSON.stringify(questions)}
            </main>
            
        </div>
    )
}