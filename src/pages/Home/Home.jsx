import React, { useState, useEffect } from "react";
import './Home.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return (
      <div className="welcome-section">
        <h1>Bienvenue sur Votre Banque</h1>
        <p>Connectez-vous pour accéder à vos comptes, ou inscrivez-vous si vous êtes nouveau.</p>
      </div>
    );
  }

  const accounts = user.accounts || [];
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <section className="home-container">
      <div className="home-header">
        <h1>Bonjour {user.name}</h1>
        <p>Connecté avec : {user.email}</p>
      </div>

      <nav className="navbar">
        <ul>
          {accounts.map(acc => (
            <li key={acc.id}>{acc.name}</li>
          ))}
        </ul>
      </nav>

      <section className="balance-section">
        <h2>Solde total : {totalBalance.toFixed(2)} €</h2>
      </section>

      <section className="accounts-section">
        <h3>Mes comptes</h3>
        <div className="accounts-list">
          {accounts.map(account => (
            <div key={account.id} className={`account-card ${account.type}`}>
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

      <footer className="home-footer">
        <p>© 2025 Votre Banque — Tous droits réservés</p>
      </footer>
    </section>
  );
}
