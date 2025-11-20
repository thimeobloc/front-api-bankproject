import React, { useRef, useEffect, useState } from "react";
import "../../../src/pages/Account/Account.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function TransferModal({isOpen, onClose, title, paragraphe, accountId, rib}) {
    const [error, setError] = useState("");
    const [balance, setBalance] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const savedUser = localStorage.getItem("user");

            const token = Cookies.get("access_token");
            if (!token) {
                setError("Utilisateur non connecté.");
                return;
            }

            if (!balance) {
                setError("La valeur donnée est vide");
                return;
            }

            if (!balance || balance <= 0) {
                setError("Montant invalide");
                return;
            }

            const res = await axios.post(`http://127.0.0.1:8000/balances/transfer`, 
                { from_account_id: accountId, to_rib: rib, amount: parseFloat(balance) }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );


            alert("Nouveau bénéficiaire enregistré !");
            window.location.reload();
        } catch (err) {
            console.log(err);
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Erreur lors du virement");
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
                <h2>{title} compte user : {accountId} rib benef : {rib}</h2>
                <p>{paragraphe}</p>

                <label>Montant :</label>
                <input className="input_field" type="number" placeholder="00.00"
                       value={balance} onChange={(e) => setBalance(e.target.value)}/>

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