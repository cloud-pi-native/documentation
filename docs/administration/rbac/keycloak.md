# Groupes, utilisateurs et droits Keycloak

Ce document décrit le **modèle d'accès** de l'IdP central du socle : Keycloak. Keycloak est la **source de vérité** de l'identité et de la hiérarchie de groupes qui est propagée vers tous les autres outils de la chaîne DSO.

---

## Vue par rôle

En tant qu'IdP, Keycloak ne « donne » pas d'écran de droits : il place chaque rôle dans un groupe, et c'est ce groupe qui propage les droits en aval. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>`. Conséquence par rôle :

| Rôle Console          | Groupe Keycloak   | Propagation en aval                          |
| --------------------- | --------------------------- | -------------------------------------------- |
| Admin plateforme      | `/admin` (amorçage)         | Toutes permissions sur la Console uniquement |
| Admin plateforme      | `/console/admin`            | Admin sur chaque outil (réconcilié, propagé) |
| Administrateur projet | `/<slug>/console/admin`     | Admin du projet partout                      |
| DevOps                | `/<slug>/console/devops`    | RW projet (sauf admin)                       |
| Développeur           | `/<slug>/console/developer` | Lecture/projet (selon outil)                 |
| Lecture seule         | `/<slug>/console/reader`    | Lecture transverse du projet                 |
| Lecture seule         | `/console/reader`           | Lecture transverse plateforme                |
| Security              | `/<slug>/console/security`  | Audit/lecture transverse du projet           |
| Security              | `/console/security`         | Audit/lecture transverse plateforme          |
| Guest                 | —                           | Aucun droit jusqu'à ajout manuel à un projet |

---

## 1. Authentification OIDC

- Keycloak est le fournisseur d'identité (IdP) ; tous les outils DSO fédèrent dessus en OIDC.
- Les utilisateurs proviennent d'un IdP externe (ex. Passage2 / ProConnect) ou sont locaux. Les **rôles admin Console** sont liés à des groupes Keycloak existants via `oidcGroup`.

---

## 2. Hiérarchie de groupes maintenue par la Console

La Console crée et réconcilie automatiquement l'arborescence suivante, propagée vers les outils consommateurs :

| Groupe Keycloak                | Nature                                                              | Propagé vers                              |
| ---------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------- |
| `/admin`                                 | Groupe plateforme **admin** (amorçage)                              | Console uniquement (hors propagation)     |
| `/console/admin`                         | Groupe plateforme **admin** (réconcilié)                            | Tous les outils (admin sur chaque service)|
| `/console/security`                      | Groupe plateforme **sécurité**                                      | Tous les outils (audit/security)          |
| `/console/reader`                        | Groupe plateforme **lecture**                                       | Tous les outils (lecture, `*RO`)          |
| `/<slug>/console/admin`                  | Groupe projet **admin**                                             | Tous les outils (admin projet)            |
| `/<slug>/console/devops`                 | Groupe projet **devops**                                            | Tous les outils (RW projet)               |
| `/<slug>/console/developer`              | Groupe projet **developer**                                         | Tous les outils (selon outil)             |
| `/<slug>/console/security`               | Groupe projet **security**                                          | Tous les outils (audit/lecture)           |
| `/<slug>/console/reader`                 | Groupe projet **reader**                                            | Tous les outils (lecture)                 |
| `/<slug>/console/<env>/<RO\|RW>`         | Sous-groupes **environnement** (membres en RO, propriétaires en RW) | ArgoCD (`/<slug>/console/<env>/<RO\|RW>`) |
| `/<slug>/grafana/<hprod\|prod>-<RO\|RW>` | Sous-groupes **Grafana** (environnement-scoped)                     | Grafana                                   |
| Groupes `AdminRole` liés via `oidcGroup` | Rôles admin Console                                                 | —                                         |

> ℹ️ Les **rôles projet Console** (`Administrateur`, `DevOps`, `Développeur`, `Lecture seule`) sont systématiquement créés avec le projet et liés aux groupes `/<slug>/console/{admin,devops,developer,reader}`. Le groupe `/<slug>/console/security` n'existe pas par défaut : il n'est alimenté que si un outil (ou un admin) le référence. Les rôles admin (`AdminRole`) sont les **seuls** pouvant être liés à un groupe Keycloak **existant** via `oidcGroup` (le préfixe `/` est obligatoire).

---

## 3. Points d'attention

- **`/admin` est le seul groupe plateforme admin.** Groupe d'amorçage géré en dehors de la Console ; il ne porte des droits que sur la Console CPiN (aucune propagation vers les outils).
- **Groupes environnement vs groupes projet.** ArgoCD et Grafana s'appuient sur des sous-groupes **environment-scoped** (`<env>/RO|RW`, `grafana/<hprod|prod>-RO|RW`). Les autres outils s'appuient sur les groupes **projet-role** (`/<slug>/console/{admin,devops,developer,reader,security}`).
- **Security / Reader sont des portées de lecture/audit**, jamais d'écriture, sur la plupart des outils.
- **Utilisateurs tiers (IDP externe).** Aucun groupe par défaut n'est attribué ; ils n'ont aucun droit tant qu'un membre les ajoute à un projet avec le niveau adéquat.

---

## 4. Qui gère quoi ?

| Élément                                   | Géré par                                         |
| ----------------------------------------- | ------------------------------------------------ |
| Fournisseur d'identité / realm            | **Keycloak** (socle)                             |
| Hiérarchie de groupes projet/admin        | **Console** (automatique)                        |
| Appartenance des utilisateurs aux groupes | **Console** (selon rôles/membres) + **Keycloak** |

---
