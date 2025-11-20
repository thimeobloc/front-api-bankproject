import React, { useRef, useEffect, useState} from "react";
import '../../../src/pages/Account/Account.css';
import axios from "axios";
import Cookies from "js-cookie";

export default function OpenAccountModal({ isOpen, onClose, children, title, paragraphe}) {
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const token = Cookies.get("access_token");
            if (!token) {
                setError("Utilisateur non connecté.");
                return;
            }
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/",
                {},
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
                console.log("slurp")
                setError(err.response.data.detail || "Erreur lors de l'inscription");
            } else {
                setError("Erreur réseau ou serveur indisponible");
            }
        }
        
    }

    const popupRef = useRef();

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
        <div className="modal-content" ref={popupRef}>
            <h2>{title}</h2>
            <p>{paragraphe}</p>
            {children}
            <button className="modal-close-btn" onClick={onClose}>
                &times;
            </button>
            <button className="modal-close-btn" onClick={handleSubmit}>
                Valider
            </button>
        </div>
    </div>
    );
}