import { useParams } from "react-router-dom";
import Affiche from '../../../src/components/historique/HistoriqueAccountSpec';
import { useState, useEffect } from "react";

export default function Historique() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  if (!user) {
    return <p>Chargement utilisateur...</p>;
  }

  return (
    <section>
      <div className="body">
        <Affiche accountId={id} userId={user.id} />
      </div>
    </section>
  );
}