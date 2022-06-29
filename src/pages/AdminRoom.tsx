import { Link, useNavigate, useParams } from 'react-router-dom';


import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/Room.scss'
import { useState } from 'react';
import { FormEvent } from 'react';
import { useAuthContext } from './../hooks/AuthContext';
import { firebaseCommands } from './../service/firebase';
import { useEffect } from 'react';
import { Question } from './../components/Question';
import { useRoom } from './../hooks/useRoom';
import { ref } from 'firebase/database';
import { toast } from 'react-hot-toast';
type RoomParams = {
    id: string
}
type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
}>
type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
}
export function AdminRoom() {
    const { user } = useAuthContext();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const navigatePage = useNavigate();
    const { questions, title } = useRoom(params.id);
    async function handleEndRoom() {
        const refroom = await firebaseCommands.database.ref(firebaseCommands.database.getDatabase(),
            `rooms/${params.id}`);
        await firebaseCommands.database.update(refroom, {
            endedAt: new Date(),
        });

        navigatePage({ pathname: '/' })
    }


 

    async function handleDeleteQuestion(idQuestion: string) {
        if (window.confirm("Tem certeza que você deseja excluir esta pergunta?")) {
            const refroom = await firebaseCommands.database.ref(firebaseCommands.database.getDatabase(),
                `rooms/${params.id}/questions/${idQuestion}`);
            await firebaseCommands.database.remove(refroom);

        };

    }
    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <Link to='/'>
                    <img src={logoImg} alt="Letmeask" />
                    </ Link>

                    <div>
                        <RoomCode code={params.id} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main className='content'>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} perguntas</span>
                    )}
                </div>

                <div className="question-list">
                    {questions.map((question) => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        >
                            <button
                                type="submit"
                                onClick={() => handleDeleteQuestion(question.id)}
                            >
                                <img src={deleteImg} alt="remover pergunta" />
                            </button>
                        </Question>


                    ))}
                </div>

            </main>
        </div>
    )
}