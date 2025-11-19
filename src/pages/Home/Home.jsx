import React, { useState } from "react";
import './Home.css';
import "../../../src/pages/Beneficiary/Beneficiary.css"

export default function Home() {
  // --------------------------
  // Etat connexion
  // --------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    accounts: [
      {
        id: "ACC-001",
        name: "Compte courant",
        balance: 2540.75,
        type: "principal",
      },
      {
        id: "ACC-002",
        name: "Compte épargne",
        balance: 8200.5,
        type: "secondaire",
      },
    ],
  };

  const totalBalance = user.accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  return (
    <section className="home-container">
      {!isLoggedIn ? (
        // --------------------------
        // PAGE D'ACCUEIL NON CONNECTÉ
        // --------------------------
        <div className="welcome-section">
          <h1>Bienvenue sur Votre Banque</h1>
          <p>Connectez-vous pour accéder à vos comptes, ou inscrivez-vous si vous êtes nouveau.</p>
          <div className="welcome-actions">
            <button onClick={() => setIsLoggedIn(true)}>Se connecter</button>
            <button onClick={() => alert("Redirection vers l'inscription")}>
              S'inscrire
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="home-header">
            <h1>Bonjour {user.name}</h1>
            <p>Connecté avec : {user.email}</p>
          </div>

          {/* Menu */}
          <nav className="navbar">
            <ul>
              <li>Compte principal</li>
              <li>Épargne</li>
              <li>Nouveau compte</li>
              <li>Historique</li>
              <li>Infos personnelles</li>
            </ul>
          </nav>

          {/* Solde total */}
          <section className="balance-section">
            <h2>Solde total : {totalBalance.toFixed(2)} €</h2>
          </section>

          {/* Comptes */}
          <section className="accounts-section">
            <h3>Mes comptes</h3>
            <div className="accounts-list">
              {user.accounts
                .filter((account) => account.type === "principal")
                .map((account) => (
                  <div
                    key={account.id}
                    className={`account-card principal`}
                  >
                    <h4>{account.name}</h4>
                    <p>ID : {account.id}</p>
                    <p>Solde : {account.balance.toFixed(2)} €</p>

                    <div className="quick-actions">
                      <button>Virement</button>
                      <button>RIB</button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Footer */}
          <footer className="home-footer">
            <p>© 2025 Votre Banque — Tous droits réservés</p>
          </footer>
        </>
      )}
    </section>
  );
}
