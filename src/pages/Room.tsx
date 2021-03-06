import { Link, useNavigate, useParams } from 'react-router-dom';


import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { useState } from 'react';
import { FormEvent } from 'react';
import { useAuthContext } from './../hooks/AuthContext';
import { firebaseCommands } from './../service/firebase';
import { useEffect } from 'react';
import { Question } from './../components/Question';

import { useRoom } from './../hooks/useRoom';
import '../styles/Room.scss'
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
    const { user, signInWithGoogle } = useAuthContext();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const navigatePage = useNavigate();
    const { questions, title } = useRoom(params.id);

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

    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {

        if (!likeId) {

            const roomref = await firebaseCommands.database.
                ref(firebaseCommands.database.getDatabase(), `rooms/${params.id}/questions/${questionId}/likes`)
            firebaseCommands.database.push(roomref, {
                authorId: user?.id,
            });
        } else {
            const roomref = await firebaseCommands.database.
                ref(firebaseCommands.database.getDatabase(), `rooms/${params.id}/questions/${questionId}/likes/${likeId}`)
            firebaseCommands.database.remove(roomref)
        }



    }
    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <Link to="/">
                        <img className='logo-img' src={logoImg} alt="Letmeask" />
                    </Link>
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
                        placeholder='Qual a sua pergunta?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}

                    ></textarea>
                    <div className='form-footer'>

                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} referrerPolicy="no-referrer" alt={user.name} />
                                <span>{user.name}</span>
                            </div>

                        ) : (
                            <span>Para enviar uma pergunta,
                                <button
                                    type='submit'
                                    onClick={() => signInWithGoogle() }
                                >fa??a seu login</button>.</span>
                        )}
                        <Button type="submit">Enviar Pergunta</Button>
                    </div>
                </form>
                <div className="question-list">
                    {questions.map((question) => (
                        <Question
                            key={question.id}
                            content={question.content}
                            author={question.author}
                        >
                            <button
                                className={`like-button ${question.likeId ? 'liked' : ''}`}
                                type='button'
                                arial-label='Marcar como gostei'
                                onClick={() => handleLikeQuestion(question.id, question.likeId)}
                            >
                                {question.likeCount > 0 && <span>{question.likeCount}</span>}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737373" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </Question>
                    ))}
                </div>

            </main>
        </div>
    )
}