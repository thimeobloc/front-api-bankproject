import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import AccountInfo from "../../components/account/AccountInfo";
import TransactionsTable from "../../components/account/TransactionsTable";
import DepositModal from "../../components/account/DepositModal";
import WithdrawModal from "../../components/account/WithdrawModal";
import CloseAccountModal from "../../components/account/CloseAccountModal";

export default function Account() {
  const navigate = useNavigate();

  //États locaux
  const [account, setAccount] = useState(null);            // Compte sélectionné
  const [userName, setUserName] = useState("");            // Nom de l'utilisateur
  const [filter, setFilter] = useState("Tous");            // Filtre pour transactions
  const [transactions, setTransactions] = useState([]);   // Toutes les transactions
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Transactions filtrées
  const [showDepositModal, setShowDepositModal] = useState(false);  
  const [depositAmount, setDepositAmount] = useState("");  
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");  
  const [showCloseModal, setShowCloseModal] = useState(false);

  //Récupération du compte sélectionné depuis localStorage
  useEffect(() => {
    const savedAccount = localStorage.getItem("selectedAccount");
    if (savedAccount) setAccount(JSON.parse(savedAccount));
  }, []);

  //Rafraîchissement du compte depuis l'API
  const refreshAccount = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");
      const res = await fetch(`http://localhost:8000/accounts/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAccount(data); // Mise à jour de l'état du compte
    } catch (error) {
      console.error("Erreur lors du rafraîchissement du compte :", error);
    }
  };

  //Récupération du nom de l'utilisateur
  useEffect(() => {
    if (!account) return;
    const fetchUserName = async () => {
      try {
        const token = Cookies.get("access_token");
        const res = await fetch(`http://localhost:8000/users/${account.user_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserName(data.name);
      } catch {
        setUserName("John Doe"); // Valeur par défaut si erreur
      }
    };
    fetchUserName();
  }, [account]);

  //Récupération des transactions depuis l'API
  const fetchTransactions = async () => {
    if (!account) return;
    try {
      const token = Cookies.get("access_token");

      // Récupération des dépôts
      const deposits = await (await fetch(`http://localhost:8000/balances/deposits/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

      // Récupération des retraits
      const withdraws = await (await fetch(`http://localhost:8000/balances/withdraws/${account.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

      // Récupération des transferts
      let transfers = await (await fetch(`http://localhost:8000/balances/transfers`, {
        headers: { Authorization: `Bearer ${token}` }
      })).json();

      // Filtrer les transferts liés au compte
      transfers = transfers.filter(t => t.from_account_id === account.id || t.to_account_id === account.id);

      // Combiner toutes les transactions
      const allTransactions = [
        ...deposits.map(d => ({ id: d.id, type: "Dépôt", amount: d.amount, date: d.date })),
        ...withdraws.map(w => ({ id: w.id, type: "Retrait", amount: w.amount, date: w.date })),
        ...transfers.map(t => ({
          id: t.id,
          type: "Transfert",
          amount: t.amount,
          date: t.date,
          direction: t.from_account_id === account.id ? "Envoyé" : "Reçu"
        }))
      ];

      // Tri par date décroissante
      allTransactions.sort((a,b) => new Date(b.date) - new Date(a.date));
      setTransactions(allTransactions);
    } catch (error) {
      console.error(error);
    }
  };

  //Mise à jour automatique des transactions à chaque compte
  useEffect(() => {
    if (account) fetchTransactions();
  }, [account]);

  //Filtrage des transactions
  useEffect(() => {
    if (filter === "Tous") setFilteredTransactions(transactions);
    else setFilteredTransactions(transactions.filter(tx => tx.type === filter));
  }, [filter, transactions]);

  //Affichage si aucun compte sélectionné
  if (!account) {
    return (
      <div className="account-page">
        <h2>Aucun compte sélectionné</h2>
        <button className="btn" onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  //Rendu principal de la page compte
  return (
    <section className="account-page two-columns">
      <AccountInfo
        account={account}
        userName={userName}
        setShowDepositModal={setShowDepositModal}
        setShowWithdrawModal={setShowWithdrawModal}
        setShowCloseModal={setShowCloseModal}
      />
      <TransactionsTable
        transactions={transactions}
        filteredTransactions={filteredTransactions}
        filter={filter}
        setFilter={setFilter}
      />

      {/* Modales conditionnelles */}
      {showDepositModal && <DepositModal
        account={account}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        setShowDepositModal={setShowDepositModal}
        fetchTransactions={fetchTransactions}
        refreshAccount={refreshAccount}
      />}
      {showWithdrawModal && <WithdrawModal
        account={account}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        setShowWithdrawModal={setShowWithdrawModal}
        fetchTransactions={fetchTransactions}
        refreshAccount={refreshAccount}
      />}
      {showCloseModal && <CloseAccountModal
        account={account}
        setAccount={setAccount}
        setShowCloseModal={setShowCloseModal}
        refreshAccount={refreshAccount}
      />}
    </section>
  );
}
