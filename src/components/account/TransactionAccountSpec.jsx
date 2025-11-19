import { useEffect, useState } from "react";
import TransactionModal from "./TransactionModalSpec";

function formatDate(dateString) {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} à ${hours}:${minutes}`;
}


export default function Transaction() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const [depositsRes, withdrawsRes, transfersRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/balances/deposits/1/1"),
          fetch("http://127.0.0.1:8000/balances/withdraws/1/1"),
          fetch("http://127.0.0.1:8000/balances/transfers/user/1")
        ]);

        const deposits = await depositsRes.json();
        const withdraws = await withdrawsRes.json();
        const transfers = await transfersRes.json();

        // Vérification: si l'API a renvoyé une erreur
        if (!Array.isArray(deposits) || !Array.isArray(withdraws) || !Array.isArray(transfers)) {
          console.error("API returned an error structure:", { deposits, withdraws, transfers });
          return;
        }

        const combined = [
          ...deposits.map(d => ({
            Date: formatDate(d.date),
            Beneficiaries: "Vous",
            Categorie: "Dépôt reçu",
            Solde: `+${d.amount}€`
          })),
          ...withdraws.map(w => ({
            Date: formatDate(w.date),
            Beneficiaries: "Vous",
            Categorie: "Retrait",
            Solde: `-${w.amount}€`
          })),
          ...transfers.map(t => ({
            Date: formatDate(t.date),
            Beneficiaries: t.to_account_id === 1 ? "Reçu" : "Envoyé",
            Categorie: "Virement",
            Solde: `${t.to_account_id === 1 ? "+" : "-"}${t.amount}€`
          }))
        ];

        setTransactions(combined);

      } catch (err) {
        console.error("Erreur lors de la récupération :", err);
      }
    }

    fetchTransactions();
  }, []);

  const openModal = (t) => setSelectedTransaction(t);
  const closeModal = () => setSelectedTransaction(null);

  return (
    <div className="transaction-container">

      {transactions.map((t, index) => (
        <div key={index}>
          <div className="transaction-date">{t.Date}</div>

          <div
            className="transaction-item"
            onClick={() => openModal(t)}
            style={{ cursor: "pointer" }}
          >
            <div className="transaction-left">
              <div className="transaction-beneficiary">{t.Beneficiaries}</div>
              <div className="transaction-category">{t.Categorie}</div>
            </div>
            <div className="transaction-saldo">{t.Solde}</div>
          </div>
        </div>
      ))}

      <TransactionModal
        transaction={selectedTransaction}
        onClose={closeModal}
      />
    </div>
  );
}
