import { useParams } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import '../styles/room.scss'

import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useEffect } from 'react'
import { useRoom } from '../hooks/useRoom'

import { useHistory } from 'react-router'

import { Question } from '../components/Question'
import '../components/Question/styles.scss'





// O parâmetro deve ter um propriedade id do tipo string
type PropsParams = {
    id: string;
}

export function AdminRoom(){
    // Uso parâmetros para a rota para pegar o códidgo da sala no URL
    const params = useParams<PropsParams>();
    const {user} = useAuth();
    const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;

    const history = useHistory();

    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`/rooms/${roomId}`).update({
            closedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que você deseja excluir esta pergunta?")){
            const questionRef = await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
        }
    }    


    
    return (
        <div id="page-room">
            <header>
            <div className="content">
                <img src={logoImg} alt="letmeask" />
                <div>
                    <RoomCode code={roomId}/>
                    <Button 
                        isOutlined
                        onClick={handleEndRoom}
                    >
                        Encerrar sala
                    </Button>
                </div>
            </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>{title}</h1>
                    
                        {/* Uma outra forma de fazer o operador ternário que não usa else EXPRESÃO ? ALGUMA COISA : NADA */}
                        {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                    
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                // uma chave única para o react acessá-la individualemte.
                                /* Cado a quesão 454 for deletada, sem a chave, o React recriaria toda a lista novamente 
                                apenas sem o elemento que foi deleteado */
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="" />
                                </button>
                            </Question>
                        )
                    })}
                </div>

                
            </main>
            
        </div>
    )
}