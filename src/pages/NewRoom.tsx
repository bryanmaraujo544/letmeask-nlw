import '../styles/global.scss'

import { FormEvent } from 'react';
import { database } from '../services/firebase';
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router';

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import { Button } from '../components/Button'
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth'



export function NewRoom(){  
    const {user} = useAuth()

    const history = useHistory();

    const [newRoom, setNewRoom] = useState('')

    // Utilizo um tipo FormEvent que me possibilita usar as propriedades de um evento
    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();

        // Removo os espaçoes da esquerda e direita caso o input esteja vazi
        if(newRoom.trim() === ''){
            return;
        }

        // Criar uma "Categoria, grupo de registros"
        const roomRef = database.ref('rooms');  

        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        })

        history.push(`/admin/rooms/${firebaseRoom.key }`)
    }

    return (
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="ilustração simbolizando perguntas e respostas"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">

                    <img src={logoImg} alt="Logo da aplicação" />
                    
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text" 
                            placeholder="Nome da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}               
                        />
                        <Button type="submit">
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entra em uma sala já existente? <Link to="/">Clique aqui</Link></p>
                </div>
            </main>
        </div>
    )
}