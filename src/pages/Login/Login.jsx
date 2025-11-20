import React, { useState } from 'react';
import './Login.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as jwt_decode from "jwt-decode"; // compatible Vite

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loginSuccess = async (e) => {
        e.preventDefault();
        setError("");
        console.log("[Login] Tentative de connexion avec :", { email, password });

        try {
            // Envoi de la requête login
            console.log("[Login] Envoi de la requête POST /users/login");
            const response = await axios.post("http://127.0.0.1:8000/users/login", {
                email,
                password,
            });
            console.log("[Login] Réponse de l'API login :", response.data);

            const token = response.data.access_token;
            console.log("[Login] Token reçu :", token);
            if (!token) throw new Error("Aucun token reçu");

            localStorage.setItem("token", token);
            console.log("[Login] Token enregistré dans localStorage");

            // Décodage du token
            console.log("[Login] Décodage du token");
            const decoded = jwt_decode(token);
            console.log("[Login] Token décodé :", decoded);

            const userId = decoded.user_id;
            console.log("[Login] user_id extrait du token :", userId);
            if (!userId) throw new Error("user_id introuvable dans le token");

            // Récupération des informations utilisateur
            console.log(`[Login] Récupération des données utilisateur via /users/${userId}`);
            const userResponse = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
            console.log("[Login] Données utilisateur récupérées :", userResponse.data);

            localStorage.setItem("user", JSON.stringify(userResponse.data));
            console.log("[Login] Données utilisateur stockées dans localStorage");

            // Navigation
            console.log("[Login] Navigation vers / et reload");
            navigate("/");
            window.location.reload();

        } catch (err) {
            console.error("[Login] Erreur lors de la connexion :", err);
            setError(err.response?.data?.detail || err.message || "Erreur lors de la connexion");
        }
    };

    return (
        <div className="center">
            <div className="background">
                <div className="SignForm">
                    <h1>Connexion</h1>

                    <input
                        className="input_field"
                        type="text"
                        placeholder="Adresse Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            console.log("[Login] email mis à jour :", e.target.value);
                        }}
                    />

                    <input
                        className="input_field"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            console.log("[Login] password mis à jour :", e.target.value);
                        }}
                    />

                    <button onClick={loginSuccess}>Se connecter</button>
                    <button onClick={() => {
                        console.log("[Login] Navigation vers /Signing");
                        navigate("/Signing");
                    }}>Je n'ai pas de compte</button>

                    {error && <p style={{ color: "red" }}>[Login] Erreur affichée : {error}</p>}
                </div>
            </div>
        </div>
    );
}
