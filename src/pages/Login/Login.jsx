import React from 'react';
import './Login.css';
import "../../../src/pages/Beneficiary/Beneficiary.css"
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    return (
        <div className="center">
            <div className="background">
                <div className="SignForm">
                    <h1>Connexion</h1>
                    <input className="input_field" type="text" placeholder="Adresse Email"/>
                    <input className="input_field"  type="text" placeholder="Mot de passe"/>

                    <button onClick={() => navigate("/Signing")}> Je n'ai pas de compte</button>
                </div>
            </div>
        </div>
    );
}
