import React, { useState } from 'react';
import './Login.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loginSuccess = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/login", {
                email,
                password,
            });

            Cookies.set("token", response.data.access_token, { expires: 1 });

            navigate("/Home");
        } catch (err) {
                setError(err.response.data.detail || "Erreur lors de la connexion");
            }
    };

    return (
        <div className="center">
            <div className="background">
                <div className="SignForm">
                    <h1>Connexion</h1>

                    <input className="input_field" type="text" placeholder="Adresse Email"
                           value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input className="input_field" type="password" placeholder="Mot de passe"
                           value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button onClick={loginSuccess}>Se connecter</button>
                    <button onClick={() => navigate("/Signing")}>Je n'ai pas de compte</button>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}
