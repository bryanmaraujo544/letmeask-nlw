import './styles.scss';
import '../../styles/global.scss';
import responseImg from '../../assets/images/seta-direita.png'
import { ReactNode } from 'react';

type contentType = {
    content?: string,
    children?: ReactNode,
}

export function Answer(props: contentType){
    return (
        <div className="answer-div">
            <div className="img-div">
                <img src={responseImg} alt="" />

            </div>
            <div className="content-answer">
                <p>{props.content}</p>
                {props.children}
            </div>
        </div>
    )
}