import { useParams } from 'react-router-dom';


import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import '../styles/Room.scss'
import { useState } from 'react';
import { FormEvent } from 'react';
import { useAuthContext } from './../hooks/AuthContext';
import { firebaseCommands } from './../service/firebase';
import { push } from 'firebase/database';
import { useEffect } from 'react';
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
export function Room() {
    const { user } = useAuthContext();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTtitle] = useState('')
    useEffect(() => {
        const roomRef = firebaseCommands.database.ref(
            firebaseCommands.database.getDatabase(),
            `rooms/${params.id}`
        )
        firebaseCommands.database.onValue(roomRef, (snapshot) => {
            const databaseRoom = snapshot.val();
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};
            const parsedQuestion = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                }
            });
            setTtitle(databaseRoom.title)
            setQuestions(parsedQuestion);
        })
    }, [params.id])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();


        if (newQuestion.trim() === '') {
            return
        }

        if (!user) {
            throw new Error('You must be logged in')
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false
        };
        const databaseConnection = await firebaseCommands.database.ref(
            firebaseCommands.database.getDatabase(),
            `rooms/${params.id}/questions`
        );
        await firebaseCommands.database.push(databaseConnection, question);
        setNewQuestion('');

    }
    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Letmeask" />
                    <RoomCode code={params.id} />
                </div>
            </header>
            <main className='content'>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && (
                        <span>{questions.length} perguntas</span>
                    )}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='O Que você quer perguntar?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}

                    ></textarea>
                    <div className='form-footer'>

                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>

                        ) : (
                            <span>Para enviar uma pergunta, <button>faça seu login</button>.</span>
                        )}
                        <Button type="submit">Enviar Pergunta</Button>
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}