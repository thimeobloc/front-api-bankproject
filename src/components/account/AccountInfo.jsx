import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Component displaying bank account information,
 * along with buttons for deposit, withdrawal, account closure, 
 * and downloading the account statement PDF.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.account - Bank account information
 * @param {string|number} props.account.id - Unique account identifier
 * @param {string} props.account.type - Account type (e.g., Checking, Savings)
 * @param {string} props.account.rib - Account RIB
 * @param {number} props.account.balance - Account balance
 * @param {string} [props.account.date] - Account creation date
 * @param {boolean} [props.account.closed] - Account status (true = closed)
 * @param {string} props.userName - User's name
 * @param {Array<Object>} props.transactions - List of account transactions
 * @param {string} [props.transactions[].date] - Transaction date
 * @param {string} props.transactions[].type - Transaction type
 * @param {string} [props.transactions[].direction] - Transaction direction (incoming/outgoing)
 * @param {number} [props.transactions[].amount] - Transaction amount
 * @param {function} props.setShowDepositModal - Function to open the deposit modal
 * @param {function} props.setShowWithdrawModal - Function to open the withdrawal modal
 * @param {function} props.setShowCloseModal - Function to open the account closure modal
 */
export default function AccountInfo({
  account,
  userName,
  transactions,
  setShowDepositModal,
  setShowWithdrawModal,
  setShowCloseModal,
}) {
  const navigate = useNavigate();

  /**
   * Generates and downloads a PDF containing the account statement.
   * Uses jsPDF and jspdf-autotable to format the PDF and the transactions table.
   */
  const downloadPdf = () => {
    const doc = new jsPDF();
    const bankColor = "#4CAF50";
    const titleColor = "#1B5E20";

    // Bank title
    doc.setFontSize(22);
    doc.setTextColor(bankColor);
    doc.text("BANQU'INNOV", 14, 20);

    // Document title
    doc.setFontSize(18);
    doc.setTextColor(titleColor);
    doc.text("Account Statement", 14, 32);

    // User and account info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${userName}`, 14, 42);
    doc.text(`Type: ${account.type}`, 14, 50);
    doc.text(`RIB: ${account.rib}`, 14, 58);
    doc.text(`Balance: ${account.balance.toFixed(2)} €`, 14, 66);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 74);

    // Prepare transactions table
    const tableBody = transactions.map(tx => [
      tx.date ? new Date(tx.date).toLocaleString() : "-",
      tx.type + (tx.direction ? ` (${tx.direction})` : ""),
      (tx.amount ?? 0).toFixed(2)
    ]);

    // Create table with jspdf-autotable
    autoTable(doc, {
      head: [["Date", "Type", "Amount (€)"]],
      body: tableBody,
      startY: 84,
      styles: { fillColor: [230, 255, 230], textColor: [0, 0, 0] },
      headStyles: { fillColor: [165, 214, 167], textColor: [0, 0, 0], fontStyle: "bold" },
    });

    // Download PDF
    doc.save(`statement_${account.id}.pdf`);
  };

  return (
    <div className="account-info-column">
      <h1>Account Information</h1>

      <div className="account-info">
        <p><strong>Type:</strong> {account?.type || "-"}</p>
        <p><strong>Balance:</strong> {account?.balance != null ? account.balance.toFixed(2) : "-"} €</p>
        <p><strong>RIB:</strong> {account?.rib || "-"}</p>
        <p><strong>Creation Date:</strong> {account?.date ? new Date(account.date).toLocaleString() : "-"}</p>
        <p><strong>Status:</strong> {account?.closed ? "Closed" : "Active"}</p>
      </div>

      <div className="account-buttons">
        <button className="btn" onClick={() => navigate("/")}>Back</button>
        {!account?.closed && (
          <button className="btn danger" onClick={() => setShowCloseModal(true)}>Close Account</button>
        )}
        {!account?.closed && (
          <button className="btn" onClick={downloadPdf}>Download Statement</button>
        )}
      </div>

      <div className="deposit-withdraw-buttons">
        {!account?.closed && (
          <button className="btn" onClick={() => setShowDepositModal(true)}>Deposit</button>
        )}
        {!account?.closed && (
          <button className="btn" onClick={() => setShowWithdrawModal(true)}>Withdraw</button>
        )}
      </div>
    </div>
  );
}

// Prop validation with PropTypes
AccountInfo.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.string.isRequired,
    rib: PropTypes.string.isRequired,
    balance: PropTypes.number.isRequired,
    date: PropTypes.string,
    closed: PropTypes.bool,
  }).isRequired,
  userName: PropTypes.string.isRequired,
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string,
      type: PropTypes.string.isRequired,
      direction: PropTypes.string,
      amount: PropTypes.number,
    })
  ).isRequired,
  setShowDepositModal: PropTypes.func.isRequired,
  setShowWithdrawModal: PropTypes.func.isRequired,
  setShowCloseModal: PropTypes.func.isRequired,
};
