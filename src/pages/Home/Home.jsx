import React, { useState, useEffect } from "react";
import "./Home.css";
import "../../../src/pages/Beneficiary/Beneficiary.css";
import OpenAccountModal from "../../components/home/OpenAccountModalSpec";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function Home() {
  // État pour stocker les informations de l'utilisateur connecté
  const [user, setUser] = useState(null);

  // État pour gérer l'ouverture du popup de création de compte
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // État pour gérer l'ouverture du modal affichant le RIB
  const [isRibModalOpen, setIsRibModalOpen] = useState(false);

  // État pour stocker le RIB sélectionné quand on ouvre le modal
  const [selectedRib, setSelectedRib] = useState(null);

  // Récupération du token d'accès stocké dans les cookies
  const token = Cookies.get("access_token");

  // État pour stocker tous les comptes de l'utilisateur
  const [accounts, setAccounts] = useState([]);

  // Hook pour naviguer entre les pages
  const navigate = useNavigate();

  // Fonction utilitaire pour naviguer vers une page spécifique
  // Si un compte est passé, il sera stocké dans le localStorage
  const handleNavigation = (path, account = null) => {
    if (account) {
      localStorage.setItem("selectedAccount", JSON.stringify(account));
    }
    navigate(path);
  };

  // Liste des types de comptes disponibles
  const ACCOUNT_TYPES = [
    "Livret A",
    "LDDS",
    "Livret Jeune",
    "PEL",
    "Compte à terme",
    "Assurance-vie",
  ];

  useEffect(() => {
    // On récupère l'utilisateur stocké en localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));

    // Si aucun token, on ne fait pas l'appel à l'API
    if (!token) return;

    // Appel API pour récupérer tous les comptes de l'utilisateur
    axios
      .get("http://127.0.0.1:8000/accounts/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setAccounts(res.data); // On stocke la réponse dans l'état
      })
      .catch((err) => {
        console.error("Erreur de chargement des comptes :", err);
      });
  }, [token]); // Dépendance sur le token pour relancer l'effet si le token change

  // Filtre pour ne récupérer que les comptes actifs (non fermés)
  const activeAccounts = accounts.filter((account) => !account.closed);

  // Calcul du solde total des comptes actifs
  const totalBalance = activeAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Fonctions pour ouvrir et fermer le popup de création de compte
  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  // Fonctions pour ouvrir et fermer le modal RIB
  const openRibModal = (rib) => {
    setSelectedRib(rib);
    setIsRibModalOpen(true);
  };

  const closeRibModal = () => {
    setIsRibModalOpen(false);
    setSelectedRib(null);
  };

  // Liste des types de comptes disponibles que l'utilisateur n'a pas encore ouverts
  const availableAccountTypes = ACCOUNT_TYPES.filter(
    (type) => !activeAccounts.some((acc) => acc.type === type)
  );

  // Si l'utilisateur n'est pas connecté, affichage de la page d'accueil
  if (!user) {
    return (
      <div className="welcome-section">
        <h1>Bienvenue sur Votre Banque</h1>
        <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
        <div className="auth-buttons">
          <button onClick={() => navigate("/Login")}>Se connecter</button>
          <button onClick={() => navigate("/Signing")}>S'inscrire</button>
        </div>
      </div>
    );
  }

  // Affichage principal pour un utilisateur connecté
  return (
    <section className="home-container">
      <div className="home-header">
        <h1>Bonjour {user.name}</h1>
        <p>Connecté avec : {user.email}</p>
      </div>

      <div className="action-buttons">
        <button onClick={openPopup}>Nouveau compte</button>
        <button onClick={() => handleNavigation("/historique")}>Historique</button>
      </div>

      <section className="balance-section">
        <h2>Solde total : {totalBalance.toFixed(2)} €</h2>
      </section>

      <section className="accounts-section">
        <h3>Mes comptes</h3>
        <div className="accounts-list">
          {activeAccounts.map((account) => (
            <div
              key={account.id}
              className={`account-card ${account.type === "Compte courant" ? "current-account" : ""}`}
            >
              {/* Redirection vers la page du compte au clic */}
              <div onClick={() => handleNavigation(`/account/${account.id}`, account)} role="button">
                <h4>{account.type}</h4>
                <p>Solde : {account.balance.toFixed(2)} €</p>
                <p>RIB : {account.rib}</p>
                <p>Date ouverture : {new Date(account.date).toLocaleString()}</p>
              </div>
              <div className="quick-actions">
                {/* Bouton pour ouvrir le modal RIB */}
                <button onClick={() => openRibModal(account.rib)}>RIB</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Composant modal pour ouvrir un nouveau compte */}
      <OpenAccountModal
        isOpen={isPopupOpen}
        onClose={closePopup}
        title="Ouvrir un nouveau compte"
        accountTypes={availableAccountTypes}
        existingAccounts={activeAccounts}
      />

      {/* Modal affichant les informations RIB */}
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
