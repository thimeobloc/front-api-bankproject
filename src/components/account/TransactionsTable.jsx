import React from "react";

export default function TransactionsTable({ transactions, filteredTransactions, filter, setFilter }) {
  const filterOptions = ["Tous", "Dépôt", "Retrait", "Transfert"];

  return (
    <div className="transactions-column">
      <h1>Historique des transactions</h1>

      <div className="transaction-filter-buttons">
        {filterOptions.map(option => (
          <button
            key={option}
            className={`btn filter-btn ${filter === option ? "active" : ""}`}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Montant (€)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((tx, index) => (
            <tr key={`${tx.id}-${index}`}>
              <td>{tx.id}</td>
              <td>{tx.type} {tx.direction ? `(${tx.direction})` : ""}</td>
              <td>{(tx.amount ?? 0).toFixed(2)}</td>
              <td>{tx.date ? new Date(tx.date).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.string.isRequired,
      direction: PropTypes.string,
      amount: PropTypes.number,
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ).isRequired,

  filteredTransactions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      type: PropTypes.string.isRequired,
      direction: PropTypes.string,
      amount: PropTypes.number,
      date: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    })
  ).isRequired,

  filter: PropTypes.string.isRequired,
  setFilter: PropTypes.func.isRequired,
};
