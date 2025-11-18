import React from 'react';
import './Login.css';
export default function Login() {
    return (
        <div className="SignForm">
            <h1>Connexion</h1>
            <input type="text" placeholder="Adresse Email"/>
            <input type="text" placeholder="Mot de passe"/>

            <button> Je n'ai pas de compte</button>
        </div>
    );
}
