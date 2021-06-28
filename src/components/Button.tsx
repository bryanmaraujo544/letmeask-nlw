import '../styles/global.scss'

// Importo todas as propriedades que posso ter no html num botão padrão
import {ButtonHTMLAttributes } from 'react'
import '../styles/button.scss'

// Elemento do botão é global
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean
};


export function Button({isOutlined = false, ...props}: ButtonProps){
    return (
        <button 
            className={`button ${isOutlined ? 'outlined' : ''} `}
            {...props}
        />
            
        
    )
}

<Button />