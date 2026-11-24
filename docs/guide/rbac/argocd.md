# Utilisateurs, groupes et droits ArgoCD

Ce document décrit le **modèle d'accès** appliqué à ArgoCD pour chaque projet DSO. ArgoCD fédère son authentification sur Keycloak et construit ses droits à partir du claim `groups`. Deux niveaux se combinent : les droits globaux définis par le socle et les droits par projet portés par l'`AppProject` produite lors de la création d'un environnement.

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans ArgoCD. La portée est le **projet**, pas l'environnement : un développeur voit les applications de ses différents environnements.

| Rôle Console          | Groupe Keycloak              | Accès dans ArgoCD                                                        |
| --------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Admin plateforme      | `/console/admin`             | Admin global (`role:admin`) et toutes opérations sur chaque AppProject    |
| Security plateforme   | `/console/security`          | Lecture des applications, du projet, des dépôts, des clusters, des comptes |
| Lecture seule         | `/console/reader`            | Lecture des applications, du projet, des dépôts, des clusters             |
| Administrateur projet | `/<slug>/console/admin`      | Lecture, sync, update, suppression et gestion du projet                  |
| Propriétaire          | `/<slug>/console/owner`      | **Non pris en charge dans `v9.29.0-rc`** — voir le point d'attention      |
| DevOps                | `/<slug>/console/devops`     | Lecture, sync, update et suppression de ressources des applications      |
| Développeur           | `/<slug>/console/developer`  | Lecture, sync, update et suppression de ressources des applications      |
| Security              | `/<slug>/console/security`   | Lecture des applications et du projet                                    |
| Lecture seule         | `/<slug>/console/reader`     | Lecture des applications et du projet                                    |
| Guest                 | —                            | Aucun accès (`role:nada`)                                                |

> Les droits `delete/*` autorisent la suppression de ressources enfants d'une application. La suppression de l'application elle-même reste réservée à l'administrateur projet et à l'administrateur plateforme.

## 1. Authentification : OIDC Keycloak

- ArgoCD est fédéré au realm `infra` de Keycloak en OIDC. `dex.enabled: false` : Keycloak est le seul fournisseur d'identité.
- Le client demande les scopes `openid` et `generic`. La configuration ArgoCD lit le claim `groups` (`scopes: "[groups]"`) : les groupes Keycloak portés par le jeton décident des droits.
- L'utilisateur admin intégré et l'accès anonyme sont désactivés (`admin.enabled: "false"`, `users.anonymous.enabled: "false"`) : tout accès passe par Keycloak.

## 2. Droits globaux

La configuration du socle définit deux rôles globaux.

| Rôle         | Règles                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `role:admin` | `p, role:admin, *, *, */*, allow`                                                                                    |
| `role:nada`  | refus des applications, clusters, projets, comptes, certificats, clés GPG, applicationsets et `exec` ; lecture des logs et des dépôts autorisée |

`policy.default: role:nada` : sans groupe reconnu, l'utilisateur hérite de ce rôle. Les groupes `cluster-admins` et `/ArgoCDAdmins` sont mappés sur `role:admin`.

## 3. Droits par projet

Lors de la création d'un environnement, la Console écrit dans le dépôt d'infrastructure un fichier de valeurs consommé par le chart `dso-env` pour produire une `AppProject` `<projet>-<environnement>-app`. Ses rôles sont associés aux groupes Keycloak du projet.

| Rôle AppProject      | Groupe Keycloak                                        | Portée                                                                    |
| -------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| `platform-admin`     | `/console/admin`                                       | Toutes opérations sur le projet                                           |
| `platform-security`  | `/console/security`                                    | Lecture applications, projet, dépôts, clusters, comptes                   |
| `platform-readonly`  | `/console/reader`                                      | Lecture applications, projet, dépôts, clusters                            |
| `project-admin`      | `/<slug>/console/admin`, `/<slug>/console/owner` si fourni | Lecture, sync, update, suppression, gestion du projet                  |
| `project-devops`     | `/<slug>/console/devops`                               | Lecture, sync, update, `delete/*`                                         |
| `project-developer`  | `/<slug>/console/developer`                            | Lecture, sync, update, `delete/*`                                         |
| `project-security`   | `/<slug>/console/security`                             | Lecture applications et projet                                           |
| `project-readonly`   | `/<slug>/console/reader`                               | Lecture applications et projet                                           |

> Ces rôles sont conditionnés à `features.fineGrainedRoles.enabled`. Deux rôles historiques `ro-group` et `rw-group`, fondés sur les groupes d'environnement `/<slug>/console/<env>/RO|RW`, restent définis dans le chart pour les projets antérieurs.

## 4. Points d'attention

- **Portée projet.** Depuis la console 9.28.0, ArgoCD s'appuie sur les groupes de rôles projet. Voir #132 pour la migration et la purge des anciens groupes d'environnement.
- **Rôle Propriétaire.** Le groupe `/<slug>/console/owner` n'est pas pris en charge dans `v9.29.0-rc` : le volet fonctionnel [console#2856](https://github.com/cloud-pi-native/console/issues/2856) n'est pas livré dans ce candidat. Ne pas en déduire de contournement non vérifié ; faire valider les conditions de déploiement et les contrôles d'accès avec l'exploitation. Voir #139.
- **Admin plateforme et admin projet.** `/admin` est le groupe d'amorçage, réservé à la Console CPiN ; `/console/admin` est le groupe réconcilié, propagé vers ArgoCD.
- **Lecture n'est pas écriture.** Security et Lecture seule n'ont pas d'opération de synchronisation ni de modification.

## 5. Qui gère quoi ?

| Élément                              | Géré par                                         |
| ------------------------------------ | ------------------------------------------------ |
| Identité et realm Keycloak           | **Keycloak** (socle)                             |
| Arborescence des groupes de rôles    | **Console** (automatique)                        |
| Rôles globaux et mapping admin       | **Socle** (`argocd-rbac-cm`)                     |
| Rôles et policies par projet         | **Chart `dso-env`**, valeurs écrites par la Console |
| Appartenance des utilisateurs        | **Console** (rôles projet)                       |

## Références

- [Groupes, utilisateurs et droits Keycloak](/guide/rbac/keycloak)
- [Service GitOps](/services/gitops)
- [Déploiement de votre application](/guide/deployment-with-argo)
