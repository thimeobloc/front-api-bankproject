import React from "react";
import "./Home.css";

export default function Home() {
  // --------------------------
  // Données en dur (mock)
  // --------------------------
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
    <div className="home-container">
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
          {user.accounts.map((account) => (
            <div
              key={account.id}
              className={`account-card ${
                account.type === "principal" ? "principal" : "secondaire"
              }`}
            >
              <h4>{account.name}</h4>
              <p>ID : {account.id}</p>
              <p>Solde : {account.balance.toFixed(2)} €</p>

              {account.type === "principal" && (
                <div className="quick-actions">
                  <button>Virement</button>
                  <button>RIB</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2025 Votre Banque — Tous droits réservés</p>
      </footer>
    </div>
  );
}
