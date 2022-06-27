import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { useAuthContext } from "../hooks/AuthContext";
import '../styles/auth.scss'

import { Button } from './../components/Button';
import { firebaseCommands } from './../service/firebase';

export function NewRoom() {

    const { user, signInWithGoogle } = useAuthContext();
    const [newRoom, setNewRoom] = useState('');


    const navigatePage = useNavigate();

    async function handleCreateRoom(event: FormEvent) {
        event.preventDefault();
        if (newRoom.trim() === '') return;

        try {
            const databaseConnection = firebaseCommands.database.getDatabase();
            const roomRef = firebaseCommands.database.ref(databaseConnection, 'rooms');
            const firebaseSave =await firebaseCommands.database.push(roomRef, {
                title: newRoom,
                authorId: user?.id,
            })
            navigatePage({ pathname: `/rooms/${firebaseSave.key}` });
        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div id="page-auth">
            <aside>
                <img
                    src={illustrationImg}
                    alt="ilustração simbolizando perguntas e resposta "
                />
                <strong>Crie salas de Q&amp;A </strong>
                <p>Tire as dúvidas da sua audiéncia em tempo-real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="Letmeask" />
                    <h1>{user?.name}</h1>
                    <h2>Cria uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
                        />
                        <Button type='submit'>Criar  sala</Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
