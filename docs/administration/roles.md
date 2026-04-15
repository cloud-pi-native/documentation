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

### Correspondance Console → GitLab (par défaut)

La correspondance ci-dessous reflète la configuration par défaut. Elle peut être adaptée via la configuration du plugin GitLab.

Rôles plateforme (scope Console) :

| Rôle Console (groupe OIDC) | Droits GitLab |
| --- | --- |
| `/console/admin` | Administrateur GitLab |
| `/console/readonly` | Auditeur GitLab |

Rôles projet (scope projet) :

| Rôle Console (groupe OIDC) | Droits GitLab sur le groupe du projet |
| --- | --- |
| `/<projectSlug>/console/admin` | Maintainer |
| `/<projectSlug>/console/devops` | Developer |
| `/<projectSlug>/console/developer` | Developer |
| `/<projectSlug>/console/readonly` | Reporter |
| Propriétaire du projet (Console) | Owner |

Paramètres de configuration utiles (plugin GitLab) :

| Clé | Rôle |
| --- | --- |
| `adminGroupPath` | Groupe OIDC donnant les droits d’administrateur GitLab |
| `auditorGroupPath` | Groupe OIDC donnant les droits d’auditeur GitLab |
| `projectMaintainerGroupPathSuffix` | Suffixe OIDC donnant l’accès Maintainer |
| `projectDeveloperGroupPathSuffix` | Suffixe OIDC donnant l’accès Developer |
| `projectReporterGroupPathSuffix` | Suffixe OIDC donnant l’accès Reporter |

## Voir aussi

- [Gestion des rôles (projet)](/guide/roles)
- [Utilisateurs](/administration/utilisateurs)
