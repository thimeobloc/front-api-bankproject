import React, { useRef, useEffect, useState } from "react";
import "../../../src/pages/Account/Account.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function TransferModal({isOpen, onClose, title, paragraphe, accountId}) {
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [rib, setRib] = useState("");
    const [user, setUser] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const savedUser = localStorage.getItem("user");
            const parsedUser = savedUser ? JSON.parse(savedUser) : null;

            const token = Cookies.get("access_token");
            if (!token) {
                setError("Utilisateur non connecté.");
                return;
            }

            if (!rib || !name) {
                setError("RIB et nom sont requis");
                return;
            }

            await axios.post(`http://127.0.0.1:8000/accounts/beneficiary/${accountId}`, 
                { rib, name }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Nouveau bénéficiaire enregistré !");
            window.location.reload();
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Erreur lors de la création du bénéficiaire");
            }
        }
    };


    const popupRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" ref={popupRef}>
                <h2>{title}</h2>
                <p>{paragraphe}</p>

                <label>Name :</label>
                <input className="input_field" type="text" placeholder="Nom"
                       value={name} onChange={(e) => setName(e.target.value)}/>

                <label>Rib :</label>
                <input className="input_field" type="text" placeholder="Rib"
                       value={rib} onChange={(e) => setRib(e.target.value)}/>

                <div className="modal-actions">
                    <button className="modal-close-btn" onClick={onClose}>Annuler</button>

                    {/* Désactive si aucune option disponible */}
                    <button
                        className="modal-close-btn"
                        onClick={handleSubmit}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}