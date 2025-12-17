import React, { useState } from 'react';
import './Login.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

export default function Login({ setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loginSuccess = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/users/login", {
                email,
                password,
            });

            const token = response.data.access_token;
            Cookies.set("access_token", token, { expires: 1 });

            const decoded = jwtDecode(token);
            const userId = decoded.user_id;

            const userResponse = await axios.get(`http://127.0.0.1:8000/users/${userId}`);
            localStorage.setItem("user", JSON.stringify(userResponse.data));
            setUser(userResponse.data);

            navigate("/");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.detail) {
                const detail = err.response.data.detail;

                if (Array.isArray(detail)) {
                    setError(detail.map(d => d.msg).join(", "));
                } else {
                    setError(detail);
                }
            } else {
                setError("Erreur lors de la connexion");
            }
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
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        className="input_field"
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={loginSuccess}>Se connecter</button>
                    <button onClick={() => navigate("/Signing")}>Je n'ai pas de compte</button>

                    {error && <p style={{ color: "red" }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired,
};