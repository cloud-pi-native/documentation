# Gestion des rôles

Cette page explique la gestion des rôles au niveau projet.

Pour les rôles plateforme (scope Console), voir : [Rôles plateforme](/administration/roles).

## Accéder aux onglets Équipe et Rôles

Chemin : sélectionner un projet → onglets `Équipe` / `Rôles`.

![Onglets du projet](/img/guide/roles/onglets-projet-v9-roles.png)

## Consulter qui a quoi (onglet Équipe)

L’onglet `Équipe` affiche les membres du projet et les rôles qui leur sont associés.

![Membres du projet et rôles](/img/iam/project-members.png)

La capture ci-dessus illustre un exemple avec un utilisateur de test.

## Gérer les rôles (onglet Rôles)

L’onglet `Rôles` présente la liste des rôles du projet.

![default](/img/guide/roles/default.png)

Par défaut, le rôle `Tout le monde` regroupe tous les membres de l'équipe avec les permissions suivantes :

- Reprovisionner le projet
- Voir les environnements
- Voir les dépôts

## Créer ou modifier un rôle

Cliquer sur le bouton `Ajouter un rôle`.

![add_role](/img/guide/roles/add.png)

Le champ `Nom du rôle` permet de choisir le nom du rôle à créer.

### Permissions disponibles

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

Cliquer sur `Enregistrer` pour créer le rôle.

### Ajouter/retirer des membres à un rôle

Après création, sélectionner le rôle puis ouvrir l’onglet `Membres` pour ajouter/retirer des utilisateurs. Les modifications sont sauvegardées automatiquement.

![Membres d’un rôle projet](/img/iam/project-role-members.png)

## Supprimer un rôle

Pour supprimer un rôle, sélectionner celui-ci dans la liste des rôles puis cliquer sur `Supprimer`.

## Règles importantes

### Cumul des rôles

Les permissions sont cumulatives : un utilisateur obtient l’ensemble des permissions de tous les rôles qui lui sont assignés. Il n’y a pas de mécanisme de “refus” qui viendrait retirer des droits.

Exemple : si un rôle donne `Voir les dépôts` et un autre donne `Gérer les dépôts`, l’utilisateur pourra `Gérer les dépôts`.

### Rôles préconfigurés (lecture seule)

Certains rôles sont fournis par la plateforme (rôles “système”). Ils sont en lecture seule : vous ne pouvez pas modifier leurs permissions ni leur nom, mais vous pouvez ajouter/retirer des membres.

Pour les identifier, vérifier que les champs de paramétrage sont non modifiables (grisés) dans l’interface.

![Paramétrage d’un rôle lecture seule](/img/iam/project-role-readonly.png)

## Vérification dans les services intégrés (exemple GitLab)

La Console est la source de vérité des rôles projet. Selon les intégrations actives et le niveau de synchronisation, l’affectation à un rôle peut se traduire par des droits visibles dans des services externes.

Si aucune intégration externe n’est active, la vérification se fait uniquement dans la Console (onglets `Équipe` et `Rôles`).

À ce jour, GitLab est le service intégré pour ce contrôle.

Correspondance des rôles projet vers GitLab (par défaut) :

| Rôle projet (Console) | Droits GitLab sur le groupe du projet |
| --- | --- |
| Administrateur (`/console/admin`) | Maintainer |
| DevOps (`/console/devops`) | Developer |
| Développeur (`/console/developer`) | Developer |
| Lecture seule (`/console/readonly`) | Reporter |
| Propriétaire du projet (Console) | Owner |

Cette correspondance peut être adaptée par les administrateurs via la configuration du plugin GitLab.

Exemple (GitLab) :

![GitLab - membres du groupe](/img/iam/gitlab-group-members.png)

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
