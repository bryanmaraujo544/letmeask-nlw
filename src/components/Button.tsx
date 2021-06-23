// Importo todas as propriedades que posso ter no html num botão padrão
import {ButtonHTMLAttributes } from 'react'
import '../styles/button.scss'

// Elemento do botão é global
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;


export function Button(props: ButtonProps){
    return (
        <button className="button" {...props}/>
            
        
    )
}

<Button />