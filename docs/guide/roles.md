# Gestion des rôles

Les rôles permettent d'augmenter ou diminuer les droits de chaque membre de votre équipe.

Si un membre de l'équipe est associé à plusieurs rôles, il prendra les permissions de tous les rôles associés.

Cliquez sur l'onglet **roles**
![menu-projet-depot](/img/guide/roles/onglets-projet-v9-roles.png)

## Rôles du projet

La page Rôles présente la liste des rôles du projet :

![default](/img/guide/roles/default.png)

Par défaut le rôle `Tout le monde` regroupe tous les membres de l'équipe avec les permissions suivantes :

- Reprovisionner le projet
- Voir les environnements
- Voir les dépôts

## Créer un rôle

Cliquer sur le bouton `Ajouter un rôle`.

![add_role](/img/guide/roles/add.png)

Le champ de texte `Nom du rôle` permet de choisir le nom du rôle à créer.

Détail des permissions :

- Projet
  - Gérer le projet : Permet de gérer tout le projet et ses ressources associées
  - Gérer les rôles du projet : Permet de gérer les rôles du projet et les membres associés (attention, les membres associés peuvent donc gérer leurs propres permissions)
  - Gérer les membres du projet : Permet d'inviter des utilisateurs et de les retirer
  - Afficher les secrets : Permet d'afficher les secrets générés par les services (sur la page tableau de bord)
  - Reprovisionner le projet : Permet de reprovisionner le projet (sur la page tableau de bord)

- Environnements
  - Gérer les environnement : Permet de créer, éditer, supprimer des environnements
  - Voir les environnement : Permet de visualiser tous les environnements et leurs configurations

- Dépôts
  - Gérer les dépôts : Permet de créer, éditer, supprimer des dépôts
  - Voir les dépôts : Permet de visualiser tous les dépôts et leurs configurations

Cliquer sur le bouton `Enregistrer` pour créer le rôle.

## Assigner/Retirer un membre à un rôle

Cliquer sur le rôle voulu et aller dans l'onglet `Membres`

![Menu](/img/guide/roles/membres.png)

Dans l'exemple, Aurahan est associé au rôle Dev.

Les modifications concernant les membres d'un rôle sont sauvegardées automatiquement.

Il est possible de retrouver un récapitulatif des rôles associés aux membres du projet sur la page `Equipes` :

![Menu](/img/guide/roles/recap_membres_projet.png)

Ici :

- Baptiste est le créateur du projet
- Pierre a le rôle ops
- Aurahan a les rôles dev et PO

## Supprimer un rôle

Pour supprimer un rôle, sélectionner celui-ci dans la liste des rôles et cliquer sur le bouton `Supprimer`

## Exemple de rôle

Voici quelques exemples de rôle pour une équipe.

Admin :

> Celui-ci permet de gérer l'ensemble des ressources du projet

- Projet
  - [x] Gérer le projet
  - [ ] Gérer les rôles du projet
  - [ ] Gérer les membres du projet
  - [ ] Afficher les secrets
  - [ ] Reprovisionner le projet

- Environnements
  - [ ] Gérer les environnement
  - [ ] Voir les environnement

- Dépôts
  - [ ] Gérer les dépôts
  - [ ] Voir les dépôts

Devops :

> Celui-ci permet de gérer les dépôts ainsi que les environnements

- Projet
  - [ ] Gérer le projet
  - [ ] Gérer les rôles du projet
  - [ ] Gérer les membres du projet
  - [x] Afficher les secrets
  - [x] Reprovisionner le projet

- Environnements
  - [x] Gérer les environnement
  - [x] Voir les environnement

- Dépôts
  - [x] Gérer les dépôts
  - [x] Voir les dépôts
