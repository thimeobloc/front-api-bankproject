import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import AfficheModal from "./HistoriqueModalSpec"; // Assure-toi que le chemin est correct

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function Historique() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const token = Cookies.get("access_token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    if (!userId || !token) return;

    async function loadAllTransactions() {
      try {
        // 1️⃣ Récupérer tous les comptes de l'utilisateur
        const accountsRes = await fetch("http://127.0.0.1:8000/accounts/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!accountsRes.ok) {
          console.warn("Impossible d'obtenir les comptes :", accountsRes.status);
          setLoading(false);
          return;
        }

        const accounts = await accountsRes.json();
        if (!accounts.length) {
          console.log("Aucun compte trouvé");
          setLoading(false);
          return;
        }

        let allTransactions = [];

        // Pour créer un mapping id -> type compte pour les virements
        const accountMap = {};
        accounts.forEach(acc => {
          accountMap[acc.id] = acc.type;
        });

        // 2️⃣ Récupérer dépôts et retraits
        for (const acc of accounts) {
          const [depositsRes, withdrawsRes] = await Promise.all([
            fetch(`http://127.0.0.1:8000/balances/deposits/${acc.id}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://127.0.0.1:8000/balances/withdraws/${acc.id}/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          const deposits = depositsRes.ok ? await depositsRes.json() : [];
          const withdraws = withdrawsRes.ok ? await withdrawsRes.json() : [];

          allTransactions.push(
            ...deposits.map((d) => ({
              date: formatDate(d.date),
              label: `Dépôt sur ${acc.type}`,
              amount: `+${d.amount}€`,
              category: "Dépôt",
            }))
          );

          allTransactions.push(
            ...withdraws.map((w) => ({
              date: formatDate(w.date),
              label: `Retrait sur ${acc.type}`,
              amount: `-${w.amount}€`,
              category: "Retrait",
            }))
          );
        }

        // 3️⃣ Récupérer tous les virements
        const transfersRes = await fetch(
          `http://127.0.0.1:8000/balances/transfers/user/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (transfersRes.ok) {
          const transfers = await transfersRes.json();

          allTransactions.push(
            ...transfers.map((t) => {
                const isSent = accounts.some(acc => acc.id === t.from_account_id);
                const fromType = accountMap[t.from_account_id] || `Compte ${t.from_account_id}`;
                const toType = accountMap[t.to_account_id] || `Compte ${t.to_account_id}`;

                return {
                date: formatDate(t.date),
                label: isSent
                    ? `Virement envoyé vers ${toType}`
                    : `Virement reçu de ${fromType}`,
                amount: isSent ? `-${t.amount}€` : `+${t.amount}€`,
                category: "Virement",
                from_account: fromType,
                to_account: toType,
                };
            })
            );
        }

        // Trier par date DESC
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        setTransactions(allTransactions);
      } catch (error) {
        console.error("Erreur chargement historique :", error);
      } finally {
        setLoading(false);
      }
    }

    loadAllTransactions();
  }, [userId, token]);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="transaction-container">
      <h2>Historique des transactions</h2>

      {transactions.length === 0 ? (
        <p>Aucune transaction trouvée.</p>
      ) : (
        transactions.map((t, i) => (
          <button
            key={i}
            className="transaction-item"
            onClick={() => setSelectedTransaction(t)}
          >
            <div className="transaction-left">
              <span className="transaction-beneficiary">{t.label}</span>
              <span className="transaction-category transaction-date">{t.date}</span>
            </div>
            <div className="transaction-saldo">{t.amount}</div>
          </button>
        ))
      )}

      {selectedTransaction && (
        <AfficheModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

