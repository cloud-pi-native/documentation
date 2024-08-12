# Gestion des équipes

Cette page présente la gestion des équipes sur un projets.

Cette fonctionnalité se trouve dans le menu "Equipe" sur un projet.

![Menu](/img/team/menu.png)

## Membres du projet

La page Equipe présente la liste des membres du projet :

![Menu](/img/team/members.png)

Depuis cette liste, il est possible de retirer une personne de la liste sur l'icone 'X'

## Ajouter une personne au projet

L'ajout d'une personne au projet s'effectue sur la partie basse de la page en saisissant l'adresse e-mail d'une personne existante dans le référentiel utilisateur CPiN.

Lors de la saisie une auto-complétion permet de rechercher les personnes existantes dans le référentiel utilisateurs

![Menu](/img/team/members.png)

> Pour Ajouter une personne au référentiel CPiN, il convient de créer un ticket sur l'outil de [tickets](https://support.dev.numerique-interieur.com)

## Attribution de droits à un membre

> Attention, seul le créateur du projet peut ajouter des repos de code à un projet.

Une fois qu'une personne a été ajoutée à un projet, il convient de lui donner des droits sur les environnements du projet. Pour cela, aller dans le menu environnement, choisir l'environnement sur lequel ajouter la personne et aller en bas de page. Saisir le nom de la personne dans le champ de saisie Accréditer un membre du projet.

![Attribution de droits](/img/team/permission-environnement.png)

Une fois selectionner, lui attribuer les droits (sur ArgoCD):
 - r : droits de lecture seule sur l'environnement (visibilité du projet sur ArgoCD)
 - rw : droits de lecture et écriture sur l'environnement (visibilité du projet sur ArgoCD et modification des values)
 - rwd : droits de lecture, écriture et suppression sur l'environnement  (visibilité du projet sur ArgoCD et modification des values et suppression des objets : pods etc.)

> L'attribution de droits à un membre pour un environnement est une opération *nécessaire* pour donner accès à ArgoCD sur l'environnement concerné.
