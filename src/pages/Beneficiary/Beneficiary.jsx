import React from 'react';
import { useState } from "react";

import "./Beneficiary.css"

import BeneficiaryList from '../../../src/components/beneficiary/BeneficiaryList';
import SearchBar from '../../../src/components/beneficiary/SearchBar';

export default function Beneficiary() {
  const beneficiairies = [
  { id: 1, inputName: "Alice Dupont", iban: "FR76 1000 2000 3000 400167890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 2, inputName: "Jean Martin", iban: "FR76 1000 2000 3000 400267890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 3, inputName: "Sophie Bernard", iban: "FR76 1000 2000 3000 400367890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 4, inputName: "Lucas Leroy", iban: "FR76 1000 2000 3000 400467890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 5, inputName: "Chloé Moreau", iban: "FR76 1000 2000 3000 400567890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 6, inputName: "Hugo Lefevre", iban: "FR76 1000 2000 3000 400667890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 7, inputName: "Emma Dubois", iban: "FR76 1000 2000 3000 400767890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 8, inputName: "Louis Mercier", iban: "FR76 1000 2000 3000 400867890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
  { id: 9, inputName: "Clara Fontaine", iban: "FR76 1000 2000 3000 400967890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" },
  { id: 10, inputName: "Maxime Roux", iban: "FR76 1000 2000 3000 401067890", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa" }
];

const account = [
  {id: 1,inputName: "Compte 1",iban: "FR76 1000 2000 3000 400167890",img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
  {id: 2,inputName: "Compte 2",iban: "FR76 1000 2000 3000 400267890",img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
  {id: 3,inputName: "Compte 3",iban: "FR76 1000 2000 3000 400367890",img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
  {id: 4,inputName: "Compte 4",iban: "FR76 1000 2000 3000 400467890",img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2022%2F08%2F06%2F11%2F02%2Fblack-man-7368411_960_720.jpg&f=1&nofb=1&ipt=47eb413fb8d7d3f008c8e3e64ec69dff79d01ad00da9bd58a554cb28ab4a88aa"},
];
  const [query, setQuery] = useState("");
  const filteredBeneficiaries = beneficiairies.filter((b) =>
    b.inputName.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div >
      <div className="center">
        <h1>Vers quel bénéficiaire ?</h1>
        <SearchBar query={query} setQuery={setQuery} />
        <div className="list">
          { filteredBeneficiaries.length === 0 || !query ?(
            <>
            <h2>Vos comptes</h2>
            {account.map((b) => (
              <BeneficiaryList
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />
            ))}
            <h2>Vos Bénéficiaires</h2>
            {beneficiairies.map((b) => (
              <BeneficiaryList
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />
            ))}
            </>
          ) : (
            <>
            <h2>Vous recherchez : "{query}" ...</h2>
            {filteredBeneficiaries.map((b) => (
              
              <BeneficiaryList
                key={b.id}
                name={b.inputName}
                iban={b.iban}
                imgUrl={b.img}
              />
              
            ))}
            </>
          )
          }
        </div>
      </div>
      <button className ="fixed_button">Ajouter un IBAN</button>
    </div>
  );
}
