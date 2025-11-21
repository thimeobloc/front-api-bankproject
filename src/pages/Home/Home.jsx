import React, { useState, useEffect } from "react";
import "./Home.css";
import "../../../src/pages/Beneficiary/Beneficiary.css";
import OpenAccountModal from "../../components/home/OpenAccountModalSpec";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isRibModalOpen, setIsRibModalOpen] = useState(false);
  const [selectedRib, setSelectedRib] = useState(null);
  const token = Cookies.get("access_token");
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  const handleNavigation = (path, account = null) => {
    if (account) {
      localStorage.setItem("selectedAccount", JSON.stringify(account));
    }
    navigate(path);
  };

  const ACCOUNT_TYPES = [
    "Livret A",
    "LDDS",
    "Livret Jeune",
    "PEL",
    "Compte à terme",
    "Assurance-vie",
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

  const activeAccounts = accounts.filter((account) => !account.closed);
  const totalBalance = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  const openRibModal = (rib) => {
    setSelectedRib(rib);
    setIsRibModalOpen(true);
  };

  const closeRibModal = () => {
    setIsRibModalOpen(false);
    setSelectedRib(null);
  };

  const availableAccountTypes = ACCOUNT_TYPES.filter(
    (type) => !activeAccounts.some((acc) => acc.type === type)
  );

  return (
    <section className="home-container">
      <div className="home-header">
        <h1>Bonjour {user.name}</h1>
        <p>Connecté avec : {user.email}</p>
      </div>

      <nav className="navbar">
        <ul>
          <li>
            <a onClick={openPopup}>Nouveau compte</a>
          </li>
          <li onClick={() => handleNavigation("/historique")} style={{ cursor: "pointer" }}>
            Historique
          </li>
        </ul>
      </nav>

      <section className="balance-section">
        <h2>Solde total : {totalBalance.toFixed(2)} €</h2>
      </section>

      <section className="accounts-section">
        <h3>Mes comptes</h3>
        <div className="accounts-list">
          {activeAccounts.map((account) => (
            <div
              key={account.id}
              className={`account-card ${
                account.type === "Compte courant" ? "current-account" : ""
              }`}
            >
              <div onClick={() => handleNavigation(`/account/${account.id}`, account)}>
                <h4>{account.type}</h4>
                <p>Solde : {account.balance.toFixed(2)} €</p>
                <p>RIB : {account.rib}</p>
                <p>Date ouverture : {new Date(account.date).toLocaleString()}</p>
              </div>
              <div className="quick-actions">
                <button onClick={() => openRibModal(account.rib)}>RIB</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <OpenAccountModal
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Ouvrir un nouveau compte"
        accountTypes={availableAccountTypes}
        existingAccounts={activeAccounts}
      />

      {isRibModalOpen && (
        <div className="rib-modal-overlay">
          <div className="rib-modal">
            <h2>Informations RIB</h2>
            <p>{selectedRib}</p>
            <button onClick={closeRibModal}>Fermer</button>
          </div>
        </div>
      )}

      <footer className="home-footer">
        <p>© 2025 Votre Banque — Tous droits réservés</p>
      </footer>
    </section>
  );
}
