import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";

export default function AccountInfo({ account, userName, setShowDepositModal, setShowWithdrawModal, setShowCloseModal }) {
  const navigate = useNavigate();

  // Fonction pour générer et télécharger le relevé de compte en PDF
  const downloadPdf = () => {
    const doc = new jsPDF();
    const bankColor = "#4CAF50";
    const titleColor = "#1B5E20";
    const tableHeaderBg = "#A5D6A7";

    // Titre de la banque
    doc.setFontSize(22);
    doc.setTextColor(bankColor);
    doc.text("Iluv Bank", 14, 20);

    // Titre du document
    doc.setFontSize(18);
    doc.setTextColor(titleColor);
    doc.text("Relevé de compte", 14, 32);

    // Informations du compte
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text(`Nom : ${userName}`, 14, 42);
    doc.text(`Type : ${account.type}`, 14, 50);
    doc.text(`RIB : ${account.rib}`, 14, 58);
    doc.text(`Solde : ${account.balance.toFixed(2)} €`, 14, 66);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 14, 74);

    // Table des transactions (vide pour l'instant)
    autoTable(doc, {
      head: [["Date","Type","Montant (€)"]],
      body: [],
      startY: 84,
      styles: { fillColor: [230,255,230], textColor:[0,0,0] },
      headStyles: { fillColor: [165,214,167], textColor:[0,0,0], fontStyle:"bold" },
    });

    // Téléchargement du PDF
    doc.save(`releve_${account.id}.pdf`);
  };

  return (
    <div className="account-info-column">
      <h1>Infos du compte</h1>

      {/* Détails du compte */}
      <div className="account-info">
        <p><strong>Type :</strong> {account.type}</p>
        <p><strong>Solde :</strong> {account.balance.toFixed(2)} €</p>
        <p><strong>RIB :</strong> {account.rib}</p>
        <p><strong>Date de création :</strong> {new Date(account.date).toLocaleString()}</p>
        <p><strong>Statut :</strong> {account.closed ? "Fermé" : "Actif"}</p>
      </div>

      {/* Boutons principaux */}
      <div className="account-buttons">
        <button className="btn" onClick={() => navigate("/")}>Retour</button>
        {!account.closed && <button className="btn danger" onClick={() => setShowCloseModal(true)}>Clôturer</button>}
        {!account.closed && <button className="btn" onClick={downloadPdf}>Télécharger le relevé</button>}
      </div>

      {/* Boutons dépôt/retrait */}
      <div className="deposit-withdraw-buttons">
        <button className="btn" onClick={() => setShowDepositModal(true)}>Dépôt</button>
        <button className="btn" onClick={() => setShowWithdrawModal(true)}>Retrait</button>
      </div>
    </div>
  );
}
