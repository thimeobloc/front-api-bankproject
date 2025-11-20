import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AfficheModal from "./HistoriqueModalSpec";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function Affiche({ accountId }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const token = Cookies.get("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!accountId || !userId) return;

    async function fetchTransactions() {
      try {
        const [depositsRes, withdrawsRes, transfersSentRes, transfersReceivedRes] =
          await Promise.all([
            fetch(`http://127.0.0.1:8000/balances/deposits/${accountId}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://127.0.0.1:8000/balances/withdraws/${accountId}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://127.0.0.1:8000/transfers/sent/${accountId}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://127.0.0.1:8000/transfers/received/${accountId}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        const deposits = await depositsRes.json();
        const withdraws = await withdrawsRes.json();
        const transfersSent = await transfersSentRes.json();
        const transfersReceived = await transfersReceivedRes.json();

        const formatted = [
          // DEPOTS
          ...deposits.map((d) => ({
            Date: formatDate(d.date),
            Beneficiaries: "Vous",
            Categorie: "Dépôt reçu",
            Solde: `+${d.amount}€`,
          })),

          // RETRAITS
          ...withdraws.map((w) => ({
            Date: formatDate(w.date),
            Beneficiaries: "Vous",
            Categorie: "Retrait",
            Solde: `-${w.amount}€`,
          })),

          // TRANSFERTS ENVOYÉS
          ...transfersSent.map((t) => ({
            Date: formatDate(t.date),
            Beneficiaries: t.receiver_name || "Destinataire inconnu",
            Categorie: "Virement envoyé",
            Solde: `-${t.amount}€`,
          })),

          // TRANSFERTS RECUS
          ...transfersReceived.map((t) => ({
            Date: formatDate(t.date),
            Beneficiaries: t.sender_name || "Expéditeur inconnu",
            Categorie: "Virement reçu",
            Solde: `+${t.amount}€`,
          })),
        ];

        // Trie du plus récent au plus ancien
        formatted.sort((a, b) => new Date(b.Date) - new Date(a.Date));

        setTransactions(formatted);
      } catch (err) {
        console.error("Erreur chargement transactions :", err);
      }
    }

    fetchTransactions();
  }, [accountId, userId]);

  const openModal = (t) => setSelectedTransaction(t);
  const closeModal = () => setSelectedTransaction(null);

  return (
    <div className="transaction-container">
      {transactions.length === 0 && <p>Aucune transaction trouvée.</p>}

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

      <AfficheModal transaction={selectedTransaction} onClose={closeModal} />
    </div>
  );
}
