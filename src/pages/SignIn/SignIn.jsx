import React from 'react';

export default function Signing() {
    return (
        <div className="background">
            <div className="SignForm">
            <h1>Inscription</h1>
            <input type="text" placeholder="Nom" />
            <input type="text" placeholder="Prenom"/>
            <input type="text" placeholder="Adresse Email"/>
            <input type="text" placeholder="Mot de passe"/>
            <input type="text" placeholder="Confirmer le Mot de passe"/>

            <button> S'inscrire</button>
            <button> J'ai déja un compte</button>
            </div>
        </div>
    );
}

