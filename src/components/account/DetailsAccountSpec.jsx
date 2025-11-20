import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie"; // ← n'oublie pas

export default function Details({ accountId }) {
  const [account, setAccount] = useState(null);
  const token = Cookies.get("access_token"); // récupère le token JWT
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (!accountId || !token) return;
    console.log("TOKEN =", token);
    
    axios.get(`http://127.0.0.1:8000/accounts/${accountId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ← obligatoire pour l'API
      },
    })
    .then(res => setAccount(res.data))
    .catch(err => console.error(err));
  }, [accountId, token]);
  if (!user) {
    return (
      <div className="welcome-section">
        <h1>Bienvenue sur Votre Banque</h1>
        <p>Connectez-vous pour accéder à vos comptes ou créez un compte.</p>
      </div>
    );
  }

  if (!account) return <p>Chargement...</p>;

  return (
    <div className="infosAccount">
      <h1 className="bankName">BoursoBank</h1>
      <p className="ibanAccount">{account.rib}</p>
      <p className="solde">{account.balance} €</p>
    </div>
  );
}
