# Rôles plateforme

Les rôles plateforme pilotent les permissions globales de la Console (scope Console). Ils sont distincts des rôles projet, qui ne s’appliquent qu’à un projet.

## Accéder à la gestion des rôles

Chemin : `Administration` → `Rôles`.

![Liste des rôles plateforme](/img/iam/admin-roles-list.png)

## Paramétrer un rôle

L’onglet `Général` permet de :

- nommer le rôle ;
- choisir ses permissions (globales) ;
- définir le type ;
- associer le groupe OIDC.

![Paramétrage d’un rôle plateforme](/img/iam/admin-role-general.png)

## Gérer les membres d’un rôle

L’onglet `Membres` permet d’ajouter ou retirer des utilisateurs.

![Membres d’un rôle plateforme](/img/iam/admin-role-members.png)

## Effet sur GitLab

Selon l’intégration et le niveau de synchronisation, l’affectation à un rôle plateforme se traduit par des droits visibles côté GitLab (ex. via l’appartenance à des groupes synchronisés).

![GitLab - projets accessibles après affectation](/img/iam/gitlab-projects.png)

## Voir aussi

- [Gestion des rôles (projet)](/guide/roles)
- [Utilisateurs](/administration/utilisateurs)
