import React from 'react';
import {useNavigate} from "react-router-dom";
import "../../../src/pages/Beneficiary/Beneficiary.css"

export default function Signing() {
    const navigate = useNavigate();
    return (
        <div className="center">
            <div className="background">
                <div className="SignForm">
                <h1>Inscription</h1>
                <input className="input_field" type="text" placeholder="Nom" />
                <input className="input_field" type="text" placeholder="Prenom"/>
                <input className="input_field" type="text" placeholder="Adresse Email"/>
                <input className="input_field" type="text" placeholder="Mot de passe"/>
                <input className="input_field" type="text" placeholder="Confirmer le Mot de passe"/>

                <button> S'inscrire</button>
                <button onClick={() => navigate("/Login")}> J'ai déja un compte</button>
                </div>
            </div>
        </div>
    );
}

