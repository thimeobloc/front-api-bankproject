import React from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

export default function CloseAccountModal({ account, setAccount, setShowCloseModal, refreshAccount }) {

  // Fonction pour clôturer le compte via l'API
  const handleCloseAccount = async () => {
    try {
      const token = Cookies.get("access_token");
      const response = await fetch(`http://localhost:8000/accounts/close/${account.id}`, {
        method:"POST",
        headers:{ Authorization:`Bearer ${token}` }
      });

      if (!response.ok) return;

      await response.json();
      // Mise à jour locale de l'état du compte
      setAccount({...account, closed:true, balance:0});
      setShowCloseModal(false);
      refreshAccount(); // Mise à jour complète depuis le serveur
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Clôturer le compte</h2>
        <p>Le solde sera transféré au compte principal.</p>
        <div className="modal-actions">
          <button className="btn" onClick={() => setShowCloseModal(false)}>Annuler</button>
          <button className="btn danger" onClick={handleCloseAccount}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

CloseAccountModal.propTypes = {
  account: PropTypes.shape({
    id: PropTypes.number.isRequired,
    balance: PropTypes.number,
    closed: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,

  setAccount: PropTypes.func.isRequired,
  setShowCloseModal: PropTypes.func.isRequired,
  refreshAccount: PropTypes.func.isRequired,
};

