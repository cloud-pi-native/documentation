# Gestion des rôles

Les rôles permettent d'augmenter ou diminuer les droits de chaque membre de votre équipe.

Si un membre de l'équipe est associé à plusieurs rôles, il prendra les permissions de tous les rôles associés.

## Cumul des rôles

Les permissions sont cumulatives : un utilisateur obtient l’ensemble des permissions présentes dans tous les rôles qui lui sont assignés. Il n’y a pas de mécanisme de “refus” qui viendrait retirer des droits.

Exemple : si un rôle donne `Voir les dépôts` et un autre donne `Gérer les dépôts`, l’utilisateur pourra `Gérer les dépôts`.

Cette page couvre les rôles au niveau projet. Pour les rôles plateforme (scope Console), voir : [Rôles plateforme](/administration/roles).

Chemin : sélectionner un projet → onglets `Équipe` / `Rôles`.

![Onglets du projet](/img/guide/roles/onglets-projet-v9-roles.png)

## Rôles préconfigurés (lecture seule)

Certains rôles peuvent être fournis par la plateforme (rôles “système”). Ces rôles préconfigurés sont en lecture seule : vous ne pouvez pas modifier leurs permissions (ni leur nom), mais vous pouvez ajouter/retirer des membres.

Pour des permissions spécifiques à votre équipe, créez un rôle sur mesure.

## Rôles du projet

### Voir les rôles par membre (onglet Équipe)

L’onglet `Équipe` affiche les membres du projet et les rôles qui leur sont associés.

![Membres du projet et rôles](/img/iam/project-members.png)

La capture ci-dessus illustre un exemple avec un utilisateur de test.

Pour vérifier “qui a quoi”, privilégier l’onglet `Équipe`. Pour modifier des permissions, utiliser l’onglet `Rôles`.

Selon l’intégration et le niveau de synchronisation, l’affectation à un rôle peut aussi se traduire par une appartenance visible côté GitLab (groupe synchronisé).

![GitLab - membres du groupe](/img/iam/gitlab-group-members.png)

### Gérer les rôles (onglet Rôles)

L’onglet `Rôles` présente la liste des rôles du projet :

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

### Ajouter/retirer des membres à un rôle

Une fois le rôle créé, sélectionner le rôle voulu puis aller dans l’onglet `Membres` pour ajouter/retirer des utilisateurs. Les modifications sont sauvegardées automatiquement.

![Membres d’un rôle projet](/img/iam/project-role-members.png)

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
