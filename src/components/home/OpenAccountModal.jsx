import React, { useState } from "react";
import '../../../src/pages/Account/Account.css';

export default function OpenAccountModal({ open}) {

    const setOpen = useState(false);
    const closeModal =()=> setOpen(false);
    return (
        <div className="modal-overlay" open={open}>
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Détails de la transaction</h2>

                <p>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</p>

                <button className="modal-close-btn" onClick={closeModal}>
                    Fermer
                </button>
            </div>
        </div>
    );
}