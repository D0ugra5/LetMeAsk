import { useNavigate } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import '../styles/auth.scss'

import { Button } from './../components/Button';
import { useAuthContext } from './../hooks/AuthContext';
import { FormEvent, useState } from "react";
import { firebaseCommands } from './../service/firebase';


export function Home() {
  const { user, signInWithGoogle } = useAuthContext();
  const [roomCode, setRoomCode] = useState('');

  const navigatePage = useNavigate();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    navigatePage({ pathname: './rooms/new' });
  }


  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') return;
    const connectionDatabase = await firebaseCommands.database.getDatabase();
    const roomRef = await firebaseCommands.database.ref(connectionDatabase);

    await firebaseCommands.database.get(
      firebaseCommands.database.child(roomRef, `rooms/${roomCode}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          navigatePage({ pathname: `rooms/${roomCode}` });
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });




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
          <button
            className="create-room"
            onClick={handleCreateRoom}
          >
            <img src={googleIconImg} alt="logo do google" />
            Crie sua sala com Google
          </button>
          <div className="separator">ou entre em uma sala </div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
              placeholder="Digite o código da sala"
            />
            <Button type='submit'>Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}

