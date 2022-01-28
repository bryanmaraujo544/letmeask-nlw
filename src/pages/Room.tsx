import '../styles/global.scss'
import cn from 'classnames'

import { Answer } from '../components/Answer'

import { useParams } from 'react-router-dom'
import { FormEvent, useState } from 'react'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import emptyQuestion from '../assets/images/empty-questions.svg'

import '../styles/room.scss'

import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { useRoom } from '../hooks/useRoom'

import { Question } from '../components/Question'
import '../components/Question/styles.scss'

import '../components/DarkButton/styles.scss'

// O parâmetro deve ter um propriedade id do tipo string
type PropsParams = {
    id: string;
}

export function Room(){
    // Uso parâmetros para a rota para pegar o códidgo da sala no URL
    const params = useParams<PropsParams>();
    const {user} = useAuth();
    const [newQuestion, setNewQuestion] = useState('');

    // Pego o parâmetro passado em path no APP
    const roomId = params.id;   

    const { questions, title } = useRoom(roomId);

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
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        }

        await database.ref(`rooms/${roomId}/questions`).push(question)
        setNewQuestion('');
    }

    async function handleLikeQuestion(questionId: string, likeId: string | undefined){
        if(likeId){
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove()
        } else{
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }

        
    }

    async function showAnswers(questionId: string){
        const roomRef = await database.ref(`rooms/${roomId}/questions/${questionId}`).get( );
        return roomRef.val().answer
    }

    return (
        <div id="page-room">
            <header>
            <div className="content">
                <img src={logoImg} alt="letmeask" />
                <div>
                    <RoomCode code={roomId}/>
                    
                </div>
                    
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
                                <img src={user.avatar} alt={user.name || ''} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button></span>
                        )}
                        
                        <Button type="submit"> Enviar pergunta</Button> 
                    </div>
                    
                </form>
                

                <div className="question-list">
                    <img src={emptyQuestion} className={`${questions.length === 0 ? 'empty-question' : 'no-empty'}`} alt="" />

                    {questions.map(question => {
                        showAnswers(question.id)
                        return (
                            <Question
                                // uma chave única para o react acessá-la individualemte.
                                /* Cado a quesão 454 for deletada, sem a chave, o React recriaria toda a lista novamente 
                                apenas sem o elemento que foi deleteado */
                                key={question.id}
                                hasAnswers={question.answered}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                                
                            >
                                <div 
                                    className={
                                        cn(
                                            'div-answer',
                                            {active: question.isAnswered}
                                        )
                                    }
                                >
                                    {question.answered && !question.isAnswered ? <Answer content={question?.answer}/> : ''}
                                </div>
                                
                                
                                
                                
                                    <button
                                        className={`like-button ${question.likeId ? 'liked' : ''}`}
                                        type="button"
                                        aria-label="Marcar como gostei"
                                        // No onClick preciso de uma função, não a execução dela já de cara
                                        onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                    >
                                        {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>

                                </button>
                                
                            
                            </Question>
                            
                            
                        )

                    })}
                </div>

                
            </main>
            
        </div>
    )
}