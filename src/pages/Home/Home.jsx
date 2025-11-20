import React, { useState, useEffect } from "react";
import './Home.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";
import OpenAccountModal from "../../../src/components/home/OpenAccountModal"
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const token = Cookies.get("access_token");
  const [accounts, setAccounts] = useState([]);

  // Liste des types de comptes épargne autorisés
  const ACCOUNT_TYPES = [
    "Livret A",
    "LDDS",
    "Livret Jeune",
    "PEL",
    "Compte à terme",
    "Assurance-vie"
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    if (!token) return; 

    axios
      .get("http://127.0.0.1:8000/accounts/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAccounts(res.data);
      })
      .catch((err) => {
        console.error("Erreur de chargement des comptes :", err);
      });
  }, [token]);

  if (!user) {
    return (
      <div className="welcome-section">
        <h1>Bienvenue sur Votre Banque</h1>
        <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <section className="home-container">
      <div className="home-header">
        <h1>Bonjour {user.name}</h1>
        <p>Connecté avec : {user.email}</p>
      </div>

      {/* Menu */}
      <nav className="navbar">
        <ul>
          <li>Compte principal</li>
          <li>Épargne</li>
          <li><a onClick={openPopup}>Nouveau compte</a></li>
          <li>Historique</li>
          <li>Infos personnelles</li>
        </ul>
      </nav>

      <section className="balance-section">
        <h2>Solde total : {totalBalance.toFixed(2)} €</h2>
      </section>

      <section className="accounts-section">
        <h3>Mes comptes</h3>
        <div className="accounts-list">
        {accounts.map(account => (
          <div key={account.id} className={`account-card ${account.type || ""}`}>
            <h4>{account.type}</h4>
            <p>Solde : {account.balance.toFixed(2)} €</p>
            <p>RIB : {account.rib}</p>
            <div className="quick-actions">
              <button>Virement</button>
              <button>RIB</button>
            </div>
          </div>
        ))}
      </div>
      </section>

      {/* Modal pour ouverture de compte */}
      <OpenAccountModal 
        isOpen={isPopupOpen} 
        onClose={closePopup} 
        title="Ouvrir un nouveau compte"
        accountTypes={ACCOUNT_TYPES} // On passe la liste des types à la modal
      />

      <footer className="home-footer">
        <p>© 2025 Votre Banque — Tous droits réservés</p>
      </footer>
    </section>
  );
}
