import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import TransactionModal from "./TransactionModalSpec"

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export default function Transaction({ accountId }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const token = Cookies.get("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!accountId || !userId) return;

    async function fetchTransactions() {
      try {
        const [depositsRes, withdrawsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/balances/deposits/${accountId}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`http://127.0.0.1:8000/balances/withdraws/${accountId}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const deposits = await depositsRes.json();
        const withdraws = await withdrawsRes.json();

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
          }))
        ];

        setTransactions(combined);

      } catch (err) {
        console.error(err);
      }
    }

    fetchTransactions();
  }, [accountId, userId]);

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

      <TransactionModal transaction={selectedTransaction} onClose={closeModal} />
    </div>
  );
}
