import { useEffect, useState } from "react";
import { isCallLikeExpression } from "typescript";
import { firebaseCommands } from "../service/firebase";
import { useAuthContext } from "./AuthContext";

type Question = {
    id: string,
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likeCount: number,
    likeId: string | undefined,

}

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    }
    content: string,
    isAnswered: boolean,
    isHighLighted: boolean,
    likes: Record<string, {
        authorId: string
    }>,
    hasLiked: boolean,


}>

export function useRoom(roomId: string | undefined) {
    const { user } = useAuthContext();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [title, setTtitle] = useState('');


    useEffect(() => {
        const roomRef = firebaseCommands.database.ref(
            firebaseCommands.database.getDatabase(),
            `rooms/${roomId}`
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
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
                }


            });
            setTtitle(databaseRoom.title)
            setQuestions(parsedQuestion);
        })
        // return firebaseCommands.database.off(roomRef);
    }, [roomId, user?.id])

    return { questions, title };
}