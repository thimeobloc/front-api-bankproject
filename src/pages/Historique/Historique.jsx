import { useParams } from "react-router-dom";
import Affiche from '../../../src/components/historique/HistoriqueAccountSpec';
import { useState, useEffect } from "react";

/**
 * Historique page component.
 *
 * Affiche l'historique des transactions d'un compte spécifique.
 * Récupère l'utilisateur depuis le localStorage et l'identifiant du compte depuis l'URL.
 *
 * @component
 */
export default function Historique() {
  // Récupération de l'ID du compte depuis les paramètres d'URL
  const { id } = useParams();

  // État pour stocker les informations de l'utilisateur
  const [user, setUser] = useState(null);

  /**
   * useEffect pour charger l'utilisateur depuis le localStorage
   * au moment du montage du composant.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Si l'utilisateur n'est pas encore chargé, afficher un message de chargement
  if (!user) {
    return <p>Chargement utilisateur...</p>;
  }

  return (
    <section>
      <div className="body">
        {/* Composant qui affiche les transactions pour le compte spécifié */}
        <Affiche accountId={id} userId={user.id} />
      </div>
    </section>
  );
}
