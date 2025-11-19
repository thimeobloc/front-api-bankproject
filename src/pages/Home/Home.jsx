import React from 'react';
import './Home.css';
import "../../../src/pages/Beneficiary/Beneficiary.css"

export default function Home() {
  const totalSomme = 12500; // en euros

  const comptes = [
    { type: 'Compte Principal', nom: 'Compte Courant', solde: 8000 },
    { type: 'Compte Secondaire', nom: 'Livret A', solde: 3000 },
    { type: 'Compte Secondaire', nom: 'Compte Jeunes', solde: 500 }
  ];

  const notifications = [
    { message: "Votre virement de 200€ a été effectué.", type: "success" },
    { message: "Votre carte bancaire arrive à expiration.", type: "warning" }
  ];

  return (
    <div className="home-container">

      <section className="home-header">
        <h1>Bienvenue dans votre espace bancaire</h1>
        <p>Gérez tous vos comptes en un seul endroit</p>
      </section>

      <section className="balance-section">
        <h2>Solde total : {totalSomme} €</h2>
        <div className="quick-actions">
          <button>Virement</button>
          <button>Dépôt</button>
          <button>Historique</button>
        </div>
      </section>

      <section className="notifications-section">
        <h3>Notifications</h3>
        <ul>
          {notifications.map((note, index) => (
            <li key={index} className={`notification ${note.type}`}>{note.message}</li>
          ))}
        </ul>
      </section>

      <section className="accounts-section" id="accounts">
        <h3>Mes comptes</h3>
        <div className="accounts-list">
          {comptes.map((compte, index) => (
            <div key={index} className={`account-card ${compte.type === 'Compte Principal' ? 'principal' : 'secondaire'}`}>
              <h4>{compte.nom}</h4>
              <p>{compte.type}</p>
              <p>Solde : {compte.solde} €</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="home-footer">
        <p>© 2025 Banque Exemple - Tous droits réservés</p>
        <p>
          <a href="#">Mentions légales</a> | <a href="#">Contact</a> | <a href="#">FAQ</a>
        </p>
      </footer>
    </div>
  );
}
