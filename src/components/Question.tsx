import '../styles/question.scss';
import { ReactNode } from 'react';
type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;

    }
    children?: ReactNode;
}

export function Question({ children, ...props }: QuestionProps) {
    return (
        <div className="question">
            <p>{props.content}</p>
            <footer>
                <div className="user-info">
                    <img src={props.author.avatar} alt={props.author.name} />
                    <span>{props.author.name}</span>
                </div>
                <div>{children}</div>
            </footer>
        </div>
    );
}