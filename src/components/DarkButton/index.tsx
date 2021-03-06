import '../../styles/global.scss'
import './styles.scss';
import {ButtonHTMLAttributes } from 'react'

// Elemento do botão é global
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    changedDark?: boolean;
}

export function DarkButton({changedDark = false, ...props}: ButtonProps){
    return(
        <button
            {...props}
        >
            
            <div className="ball"></div>
        </button>
    )
}