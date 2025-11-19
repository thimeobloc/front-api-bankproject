import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import "../../../src/pages/Beneficiary/Beneficiary.css"

export default function Signing() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
        }
        try {
            const response = await fetch("http://localhost:8000/users/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
            });

            if (response.ok) {
                alert("Compte créé avec succès !");
                navigate("/Login");
            } else {
                const data = await response.json();
                alert("Erreur : " + data.detail);
            }

        } catch (error) {
            console.error(error);
            alert("Impossible de contacter le serveur.")
        }

    };

    return (
        <section>
            <div className="center">
                <div className="background">
                    <div className="SignForm">
                    <h1>Inscription</h1>
                    <input className="input_field" type="text" placeholder="Nom"
                           value={name} onChange={(e) => setName(e.target.value)} />
                    <input className="input_field" type="text" placeholder="Adresse Email"
                           value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input className="input_field" type="text" placeholder="Mot de passe"
                           value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <input className="input_field" type="text" placeholder="Confirmer le Mot de passe"
                           value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

                    <button onClick={handleSubmit}> S'inscrire</button>
                    <button onClick={() => navigate("/Login")}> J'ai déja un compte</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

