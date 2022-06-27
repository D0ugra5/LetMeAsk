import { useContext } from "react";
import { Link } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import { useAuthContext } from "../hooks/AuthContext";
import '../styles/auth.scss'

import { Button } from './../components/Button';

export function NewRoom() {

    const { user, signInWithGoogle } = useAuthContext();

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
                    <form>
                        <input
                            type="text"
                            placeholder="Digite o código da sala"
                        />
                        <Button type='submit'>Criar  sala</Button>
                    </form>
                    <p>
                        quer entrar em uma sala existente <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}
