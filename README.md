front-api-projet

Description
front-api-projet est une application bancaire avec un front-end React et un back-end FastAPI.  
L’utilisateur peut gérer ses comptes, consulter ses transactions, faire des dépôts/retraits, ouvrir de nouveaux comptes et générer des relevés PDF.

Installation

1. Cloner le dépôt :
git clone <URL_DU_DEPOT>
cd front-api-projet

2. Installer les dépendances front-end :
npm install

3. Installer Vite si nécessaire :
npm create vite@latest

4. Installer les librairies :
npm install axios js-cookie react-router-dom
npm install jspdf jspdf-autotable

5. Lancer le front-end :
npm run dev

6. Lancer le back-end FastAPI :
uvicorn app.main:app --reload

------------------------------------------

Pages principales

PAGE HOME
- Affiche les infos de l’utilisateur connecté
- Affiche le solde total
- Liste les comptes : type, solde, RIB, date
- Modal pour voir le RIB
- Ouverture d’un nouveau compte
- Redirection si non connecté

Technique :
- Token récupéré via js-cookie
- Appels API avec Axios
- Modals pour ouverture compte / RIB
- Calcul automatique du solde total
- Navigation React Router

------------------------------------------

PAGE ACCOUNT
- Infos complètes du compte : solde, type, RIB, statut, date
- Dépôt
- Retrait
- Clôture du compte
- Téléchargement PDF relevé
- Historique des transactions filtrable

Technique :
- Modals : DepositModal, WithdrawModal, CloseAccountModal
- PDF généré avec jsPDF + jspdf-autotable
- Axios pour récupérer opérations


Page d’Inscription

La page Inscription permet à un nouvel utilisateur de créer un compte.
Elle contient les champs suivants :

Nom : le nom de l’utilisateur.

Adresse email : utilisée comme identifiant unique.

Mot de passe : le mot de passe à utiliser pour se connecter.

Confirmation du mot de passe : doit être identique au mot de passe.

Une fois ces informations remplies, l’utilisateur peut cliquer sur “S’inscrire” pour créer son compte.

En cas d’erreur (mot de passe différent, email déjà utilisé, format invalide…),
un message d’erreur apparaît sous le formulaire.

En bas de la page, un bouton “J’ai déjà un compte” redirige vers la page de connexion.

 Page de Connexion

La page Connexion permet à un utilisateur existant d’accéder à son espace.
Elle contient :

Adresse email

Mot de passe

Après avoir entré ses informations, l’utilisateur clique sur “Se connecter”.

Si les informations sont incorrectes (email introuvable, mauvais mot de passe…),
un message d’erreur est affiché sous les champs.

En bas de la page, un bouton “Je n’ai pas de compte” renvoie vers la page d’inscription.

Navigation entre les pages

Depuis la Connexion, le lien “Je n’ai pas de compte” ouvre la page d’inscription.

Depuis l’Inscription, le bouton “J’ai déjà un compte” renvoie vers la page de connexion.


PAGE HISTORIQUE (GLOBAL)

La page Historique permet d’afficher toutes les transactions d’un utilisateur, tous comptes confondus : dépôts, retraits et virements.

Fonctionnalités :

Affichage chronologique des opérations

Fusion automatique des données provenant de plusieurs comptes

Distinction entre :

Dépôt

Retrait

Virement envoyé

Virement reçu

Modale d’affichage des détails d’une transaction

Gestion automatique du format des dates et montants

Chargement dynamique à partir de l’ID de l’utilisateur

Technique :

Récupération user via localStorage

Token JWT récupéré via js-cookie

Fetch API pour récupérer :

/accounts/

/balances/deposits/{accountId}/{userId}

/balances/withdraws/{accountId}/{userId}

/balances/transfers/user/{userId}

Fusion et tri des transactions côté front

Ouverture d'une modale (HistoriqueModalSpec) contenant :

date

montant

label

catégorie

IBAN pseudo-généré

Gestion d’un état selectedTransaction pour afficher/cacher la modale

Composants utilisés :

Historique.jsx (page maître)

HistoriqueAccountSpec.jsx (récupération + affichage transactions)

HistoriqueModalSpec.jsx (détails transaction)

PAGE HISTORIQUE PAR COMPTE

Cette page utilise l’ID du compte récupéré via l’URL grâce à useParams().

Fonctionnalités :

Affichage de l’historique lié à un seul compte

Se base sur le composant Affiche (HistoriqueAccountSpec)

Vérification automatique de l'utilisateur connecté

Chargement conditionnel en cas d’absence de user dans le localStorage

Technique :

Extraction de l’ID du compte via react-router-dom

Vérification du user → sinon Chargement utilisateur...

Passage de accountId et userId au composant enfant


------------------------

Librairies utilisées

Front :
React
Vite
Axios
js-cookie
React Router DOM
jsPDF
jspdf-autotable

Back :
FastAPI
Uvicorn


Lancement du projet

1. Lancer le backend :
uvicorn app.main:app --reload

2. Lancer le frontend :
npm run dev

3. Aller sur :
http://localhost:5173

