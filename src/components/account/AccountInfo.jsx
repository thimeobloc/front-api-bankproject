import React from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf"; // librairie pour générer des PDF côté client
import autoTable from "jspdf-autotable"; // extension jsPDF pour créer des tableaux
import Cookies from "js-cookie"; // pour gérer les cookies (auth token)

export default function AccountInfo({
  account,
  userName,
  transactions,
  setShowDepositModal,
  setShowWithdrawModal,
  setShowCloseModal,
}) {
  const navigate = useNavigate(); // hook pour naviguer entre les pages

  // Fonction principale pour générer le PDF du relevé
  const downloadPdf = () => {
    const doc = new jsPDF(); // init du PDF
    const bankColor = "#4CAF50"; // couleur thème banque
    const titleColor = "#1B5E20"; // couleur titre

    // Titre banque
    doc.setFontSize(22);
    doc.setTextColor(bankColor);
    doc.text("BANQU'INNOV", 14, 20);

    // Titre document
    doc.setFontSize(18);
    doc.setTextColor(titleColor);
    doc.text("Relevé de compte", 14, 32);

    // Infos utilisateur et compte
    doc.setFontSize(12);
    doc.setTextColor(0,0,0);
    doc.text(`Nom : ${userName}`, 14, 42);
    doc.text(`Type : ${account.type}`, 14, 50);
    doc.text(`RIB : ${account.rib}`, 14, 58);
    doc.text(`Solde : ${account.balance.toFixed(2)} €`, 14, 66);
    doc.text(`Date : ${new Date().toLocaleDateString()}`, 14, 74);

    // Préparer le tableau des transactions
    const tableBody = transactions.map(tx => [
      tx.date ? new Date(tx.date).toLocaleString() : "-", // date formatée
      tx.type + (tx.direction ? ` (${tx.direction})` : ""), // type et direction (transfert)
      (tx.amount ?? 0).toFixed(2) // montant formaté à 2 décimales
    ]);

    // Création du tableau avec jspdf-autotable
    autoTable(doc, {
      head: [["Date", "Type", "Montant (€)"]],
      body: tableBody,
      startY: 84, // position verticale du tableau
      styles: { fillColor: [230, 255, 230], textColor: [0, 0, 0] }, // style lignes normales
      headStyles: { fillColor: [165, 214, 167], textColor: [0, 0, 0], fontStyle: "bold" }, // style header
    });

    // Téléchargement automatique du PDF avec un nom dynamique
    doc.save(`releve_${account.id}.pdf`);
  };

  return (
    <div className="account-info-column">
      <h1>Infos du compte</h1>

      <div className="account-info">
        <p><strong>Type :</strong> {account?.type || "-"}</p>
        <p><strong>Solde :</strong> {account?.balance != null ? account.balance.toFixed(2) : "-"} €</p>
        <p><strong>RIB :</strong> {account?.rib || "-"}</p>
        <p><strong>Date de création :</strong> {account?.date ? new Date(account.date).toLocaleString() : "-"}</p>
        <p><strong>Statut :</strong> {account?.closed ? "Fermé" : "Actif"}</p>
      </div>

      <div className="account-buttons">
        <button className="btn" onClick={() => navigate("/")}>Retour</button>
        {!account?.closed && (
          <button className="btn danger" onClick={() => setShowCloseModal(true)}>Clôturer</button> // ouvrir modal fermeture compte
        )}
        {!account?.closed && (
          <button className="btn" onClick={downloadPdf}>Télécharger le relevé</button> // déclenche download PDF
        )}
      </div>

      <div className="deposit-withdraw-buttons">
        {!account?.closed && (
          <button className="btn" onClick={() => setShowDepositModal(true)}>Dépôt</button> // ouvrir modal dépôt
        )}
        {!account?.closed && (
          <button className="btn" onClick={() => setShowWithdrawModal(true)}>Retrait</button> // ouvrir modal retrait
        )}
      </div>
    </div>
  );
}
