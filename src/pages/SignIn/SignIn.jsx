import React from 'react';
import {useNavigate} from "react-router-dom";

export default function Signing() {
    const navigate = useNavigate();
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
            <button onClick={() => navigate("/Login")}> J'ai déja un compte</button>
            </div>
        </div>
    );
}

