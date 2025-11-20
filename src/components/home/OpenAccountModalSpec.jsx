import React, { useRef, useEffect, useState } from "react";
import "../../../src/pages/Account/Account.css";
import axios from "axios";
import Cookies from "js-cookie";

export default function OpenAccountModal({
    isOpen,
    onClose,
    children,
    title,
    paragraphe,
    accountTypes,
    existingAccounts
}) {
    const [error, setError] = useState("");

    // Types déjà utilisés
    const usedTypes = existingAccounts?.map(acc => acc.type) || [];

    // Types encore disponibles
    const availableTypes = accountTypes.filter(type => !usedTypes.includes(type));

    const [selectedType, setSelectedType] = useState("");

    // Met automatiquement le premier type disponible
    useEffect(() => {
        if (availableTypes.length > 0) {
            setSelectedType(availableTypes[0]);
        }
    }, [availableTypes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = Cookies.get("access_token");
            if (!token) {
                setError("Utilisateur non connecté.");
                return;
            }

            await axios.post(
                "http://127.0.0.1:8000/accounts/",
                { account_type: selectedType },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Nouveau compte créé !");
            window.location.reload();
        } catch (err) {
            if (err.response) {
                setError(err.response.data.detail || "Erreur lors de l'ouverture du compte");
            } else {
                setError("Erreur réseau ou serveur indisponible");
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

                <label>Type de compte :</label>

                {/* Affiche un message si plus aucun type dispo */}
                {availableTypes.length === 0 ? (
                    <p style={{ color: "#ff8080", fontWeight: "bold", marginTop: "10px" }}>
                        Vous avez déjà ouvert tous les types de comptes disponibles.
                    </p>
                ) : (
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        {availableTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                )}

                {error && <p className="error-message">{error}</p>}

                <div className="modal-actions">
                    <button className="modal-close-btn" onClick={onClose}>Annuler</button>

                    {/* Désactive si aucune option disponible */}
                    <button
                        className="modal-close-btn"
                        onClick={handleSubmit}
                        disabled={availableTypes.length === 0}
                        style={{
                            opacity: availableTypes.length === 0 ? 0.5 : 1,
                            cursor: availableTypes.length === 0 ? "not-allowed" : "pointer",
                        }}
                    >
                        Valider
                    </button>
                </div>
            </div>
        </div>
    );
}
