import '../styles/global.scss'
import cn from 'classnames'

import { useParams } from 'react-router-dom'
import { useState, useRef } from 'react'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import emptyQuestion from '../assets/images/empty-questions.svg'

import { Answer } from '../components/Answer'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import '../components/Question/styles.scss'


import '../components/DarkButton/styles.scss'

import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useRoom } from '../hooks/useRoom'

import { useHistory } from 'react-router'

import '../styles/room.scss'

// O parâmetro deve ter um propriedade id do tipo string
type PropsParams = {
    id: string;
}

export function AdminRoom(){
    console.log('re-rendered')
    // Uso parâmetros para a rota para pegar o códidgo da sala no URL
    const params = useParams<PropsParams>();
    const {user} = useAuth();
    const roomId = params.id;
    const history = useHistory();
    console.log("User", user?.id)
    const answerQ = useRef('')


    async function handleSecurity() {
        const roomRef = await database.ref(`rooms/${roomId}`).get( )
        const roomVal = await roomRef.val().authorId
        console.log("Quem fez a sala", roomVal)
        if (roomVal !== user?.id) {
            window.alert("Você não tem acesso a essa sala")
            history.push("/")
        } else {
           
        }
    }

    if (user?.id) {
        handleSecurity()
    }

    const answerRef = useRef<HTMLTextAreaElement>(null)
    //ansRef.current?.classList.add('oi')
    
    // const [answerQ, setAnswerQ] = useState('');

    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`/rooms/${roomId}`).update({
            closedAt: new Date(),
        })

        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string){
        if(window.confirm("Tem certeza que você deseja excluir esta pergunta?")){
           await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string){
        const currentQuestion = questions.filter(question => question.id === questionId)
        const questionAnswered = currentQuestion[0].isAnswered;
        
        if(questionAnswered === false){
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: true,
            })
        } else {
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                isAnswered: false,
            })
        }

        // await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
        //     isAnswered: true,
        // });
    }

    async function handleHighlightQuestion(questionId: string) {
        const currentQuestion = questions.filter(question => question.id === questionId)
        const questionHighlighted = currentQuestion[0].isHighlighted;
        // const isHighLightedRef = roomRef.val().isHighLighted;
        if(questionHighlighted === false){
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: true,
            });
        } else{
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                isHighlighted: false,
            });
        }     
    }

    async function handleAnswer(questionId: string){
        
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: false,
        });
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            answer: answerQ,
        })
        const roomRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).get( );
       
        if(roomRef.val().answer){
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                answered: true,
            })
        } 

        // Vejo se está sendo digitado algo
        if(roomRef.val().isAnswered){
            await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
                answered: false,
            })
        }


    }

    async function handleDeleteAnswer(questionId: string){
        await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
            answered: false,
        })
    }

    function handleEnterUserRoom(){
        history.push(`/rooms/${roomId}`)
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
                    <Button
                        isOutlined={false}
                        onClick={handleEnterUserRoom}
                    >
                        Visão usuário
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
                    <img src={emptyQuestion} className={`${questions.length === 0 ? 'empty-question' : 'no-empty'}`} alt="empty-question" />
                    {questions.map(question => {
                        return (
                            
                            <Question
                                // uma chave única para o react acessá-la individualemte.
                                /* Cado a quesão 454 for deletada, sem a chave, o React recriaria toda a lista novamente 
                                apenas sem o elemento que foi deleteado */
                                answer={question.answer}
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                hasAnswers={question.answered}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                
                                    {/* // fragment */}
                                    <> 
                                        {/* Botão de highlight */}
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta" />
                                        </button>

                                        {/* Botão de resposta */}
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={answerImg} alt="Responder mensagem" />
                                        </button>
                                    </>
                                
                                
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                                
                                <div 
                                    className={
                                        cn(
                                            'div-answer',
                                            {active: question.isAnswered}
                                        )
                                    }
                                >
                                    
                                    <textarea
                                        ref={answerRef}
                                        className={
                                            cn(
                                                'textarea',
                                                {textareaActive: question.isAnswered}
                                            )
                                        }
                                        onChange={event => answerQ.current = event.target.value}
                                    />
                                    
                                    {question.answered && !question.isAnswered ? 
                                    
                                        <Answer content={question?.answer}>
                                            <button
                                                type="button"
                                                className="delete-answer"
                                                onClick={() => handleDeleteAnswer(question.id)}
                                            >
                                                <img src={deleteImg} alt="Remover pergunta" />
                                            </button>
                                        </Answer>
                                    
                                    : ''}
                                    
                        
                                    <Button
                                            type="button"
                                            onClick={() => handleAnswer(question.id)}
                                            isOutlined={true}
                                        >
                                            Responder
                                    </Button>
                                </div>
                                
                            </Question>
                        )
                    })}
                </div>
                

                
            </main>
            
        </div>
    )
}