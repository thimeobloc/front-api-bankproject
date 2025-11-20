import React, { useState, useEffect } from "react";
import './Home.css';
import "../../../src/pages/Beneficiary/Beneficiary.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser) {
      setUser(JSON.parse(savedUser));

      if (token) {
        fetch("http://127.0.0.1:8000/accounts/myaccounts/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Erreur API: ${res.status} - ${text}`);
          }
          return res.json();
        })
        .then(data => {
          if (Array.isArray(data)) setAccounts(data);
          else setAccounts([]);
        })
        .catch(err => console.error("Erreur chargement comptes :", err));
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="welcome-section">
        <h1>Bienvenue sur Votre Banque</h1>
        <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);

  return (
    <section className="home-container">
      <div className="home-header">
        <h1>Bonjour {user.name}</h1>
        <p>Connecté avec : {user.email}</p>
      </div>

      <nav className="navbar">
        <ul>
          {accounts.map(acc => (
            <li key={acc.id}>Compte #{acc.id} — {acc.balance.toFixed(2)} €</li>
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
            <div key={account.id} className={`account-card ${account.type || ""}`}>
              <h4>Compte #{account.id}</h4>
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

      <footer className="home-footer">
        <p>© 2025 Votre Banque — Tous droits réservés</p>
      </footer>
    </section>
  );
}
