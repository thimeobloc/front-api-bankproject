import { useParams } from "react-router-dom";
import Details from '../../../src/components/account/DetailsAccountSpec';
import Transaction from '../../../src/components/account/TransactionAccountSpec';

export default function Account() {
  const { id } = useParams(); // ← ID du compte cliqué

  return (
    <section>
      <div className="body">
        <Details accountId={id} />
        <Transaction accountId={id} />
      </div>
    </section>
  );
}