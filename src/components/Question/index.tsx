import { ReactNode } from "react"
import cx from 'classnames'


type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

// Receberá como propriedades content, e as info do usuário
export function Question({
    content,
    author,
    children,
    isAnswered = false,
    isHighlighted = false,
}: QuestionProps) {
    return (
        <div className={cx(
            'question',
            {answered: isAnswered}, // Chave do objeto é a classe que será colocada caso o valor do objeto seja true
            { highlighted: isHighlighted && !isAnswered }
        )}>
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