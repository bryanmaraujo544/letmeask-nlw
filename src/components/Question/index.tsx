import { ReactNode } from "react"

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode;
}

// Receberá como propriedades content, e as info do usuário
export function Question({
    content,
    author,
    children
}: QuestionProps) {
    return (
        <div className="question">
            <p>{content}</p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                {/* Div que irá conter os botôes, mas será diferente para um usuário e para um admin */}
                <div>
                    {children}
                </div>

            </footer>
        </div>
    )



}