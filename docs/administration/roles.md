# Rôles plateforme

Les rôles plateforme pilotent les permissions globales de la Console (scope Console). Ils sont distincts des rôles projet, qui ne s’appliquent qu’à un projet.

Si un utilisateur est associé à plusieurs rôles plateforme, ses permissions sont cumulées : il obtient l’ensemble des permissions de tous ses rôles.

Certains rôles plateforme sont préconfigurés (rôles “système”) et sont en lecture seule : leurs permissions, leur type et leur groupe OIDC ne sont pas modifiables depuis l’interface. La gestion des membres reste possible.

Pour les identifier, vérifier que les champs du rôle sont non modifiables (grisés) dans l’onglet `Général`.

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

## Effet sur les services intégrés (exemple GitLab)

La Console est la source de vérité des rôles et permissions. Selon les intégrations actives et le niveau de synchronisation, ces droits peuvent être projetés vers des services externes.

À ce jour, GitLab est le service intégré pour ce contrôle.

Vérifier les points suivants :

- l’intégration du service concerné est active ;
- le mapping des groupes/rôles est configuré pour ce service ;
- la synchronisation est terminée.

## Voir aussi

- [Gestion des rôles (projet)](/guide/roles)
- [Utilisateurs](/administration/utilisateurs)
