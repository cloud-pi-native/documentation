# Utilisateurs, groupes et droits Console CPiN

Ce document décrit le **modèle d'accès** de la Console CPiN elle-même : comment ses rôles admin et projet se traduisent en permissions, et comment ils sont propagés vers Keycloak.

---

## Vue par rôle

Ce que chaque rôle peut réellement faire dans la Console CPiN. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console                            | Groupe Keycloak             | Ce que je peux faire                                                                                                            |
| --------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Admin plateforme (administration)       | `/console/admin`            | Administration globale : tous les projets, utilisateurs, plugins                                                                |
| Administrateur projet                   | `/<slug>/console/admin`     | Gérer le projet : membres, environnements, dépôts, suppression                                                                  |
| DevOps                                  | `/<slug>/console/devops`    | Gérer environnements + dépôts, rejouer les hooks, voir les secrets. **Pas** de déploiement applicatif ni de gestion des membres |
| Développeur                             | `/<slug>/console/developer` | Gérer et lister les dépôts, lister les environnements. **Pas** d'accès aux secrets ni de rejeu du projet                        |
| Lecture seule (projet)                  | `/<slug>/console/reader`    | Lister environnements et dépôts uniquement                                                                                      |
| Lecture seule (administration)          | `/console/reader`           | Lecture transverse (tous projets)                                                                                               |
| Security (projet)                       | `/<slug>/console/security`  | Lecture transverse du projet (audit). _Groupe non créé par défaut : alimenté par les outils qui le référencent_                 |
| Security (administration)               | `/console/security`         | Lecture transverse (tous projets, audit)                                                                                        |
| Guest (utilisateur externe sans groupe) | —                           | Aucun accès jusqu'à ajout à un projet                                                                                           |

---

## 1. Authentification : OIDC via Keycloak

- La Console authentifie ses utilisateurs via **OIDC Keycloak**.
- Les permissions effectives d'un utilisateur = agrégation (OU binaire) des `permissions` de tous ses rôles (admin + projet).

---

## 2. Rôles projet et permissions

Chaque projet reçoit 4 rôles système par défaut, liés aux groupes `/<slug>/console/*`.

| Rôle Console       | Groupe Keycloak   | Permissions (bits `PROJECT_PERMS`)                                                                                    |
| ------------------ | --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Administrateur** | `/<slug>/console/admin`     | `MANAGE` (gérer le projet)                                                                                            |
| **DevOps**         | `/<slug>/console/devops`    | `SEE_SECRETS`, `REPLAY_HOOKS`, `MANAGE_ENVIRONMENTS`, `MANAGE_REPOSITORIES`, `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES` |
| **Développeur**    | `/<slug>/console/developer` | `MANAGE_REPOSITORIES`, `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES`                                                       |
| **Lecture seule**  | `/<slug>/console/reader`    | `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES`                                                                              |

### Bits `PROJECT_PERMS` disponibles

`GUEST(0)`, `MANAGE(1)`, `MANAGE_MEMBERS(2)`, `MANAGE_ENVIRONMENTS(3)`, `MANAGE_REPOSITORIES(4)`, `MANAGE_ROLES(5)`, `SEE_SECRETS(6)`, `REPLAY_HOOKS(7)`, `LIST_ENVIRONMENTS(8)`, `LIST_REPOSITORIES(9)`, `LIST_MEMBERS(10)`, `LIST_ROLES(11)`, `MANAGE_DEPLOYMENTS(12)`, `LIST_DEPLOYMENTS(13)`.

---

## 3. Rôles admin et permissions

| Rôle Console                                     | Groupe Keycloak (chemin) | Permissions (`ADMIN_PERMS`)                                                         |
| ------------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| Admin plateforme (`/console/admin`) | `/console/admin` | `MANAGE` + toutes les `MANAGE_*`, `LIST_*` (admin global) |
| Security (`/console/security`) | `/console/security` | lecture transverse (portée audit, `*RO`) |
| Lecture seule (`/console/reader`)                | `/console/reader`        | lecture transverse (`*RO`)                                                          |

> **Groupes Keycloak d'administration plateforme** : le chemin plateforme d'administration est `/admin`, groupe d'amorçage géré en dehors de la Console ; `/console/admin` (admin), `/console/security` (audit) et `/console/reader` (lecture) sont les groupes plateforme réconciliés, propagés vers les outils.

> **Axe ABAC `userType`** : indépendamment des groupes, certains endpoints restreignent l'accès selon le type d'utilisateur (`human` / `bot` / `ghost`, colonne `User.type`). Cet axe s'ajoute au masque de bits admin/projet.

> **Chemin Keycloak réel des rôles projet** : la Console crée `/<slug>/console/<rôle>` (ex. `/monprojet/console/admin`), sous le groupe racine `/<slug>`. Ce chemin est l'identité OIDC effective — il ne porte pas le nom `project-<name>-<rôle>` (qui n'existe pas côté Keycloak).
>
> **Seul un rôle admin peut être lié à un groupe Keycloak existant** via un groupe d'application externe (chemin commençant par `/`). Les rôles projet ont leur groupe d'application préfixé automatiquement par `/<slug>`.

---

## 4. Points d'attention

- **Permissions = masque de bits.** Un rôle est la somme de permissions ; l'agrégation inter-rôles se fait en OU binaire.
- **`/admin` donne l'administration globale.** Groupe d'amorçage géré en dehors de la Console.
- **Le développeur n'accède pas aux secrets.** Le rôle `developer` couvre la gestion des dépôts et la lecture des environnements ; ni `SEE_SECRETS` ni `REPLAY_HOOKS` ne lui sont accordés (contrairement à DevOps).
- **DevOps sans déploiement applicatif.** Le déploiement applicatif n'est pas couvert par le rôle DevOps par défaut ; ses droits portent sur les environnements, dépôts, hooks et secrets.
- **Groupe `everyonePerms`.** Un projet peut définir des permissions pour _Tout le monde_, appliquées au-delà des rôles nominatifs.

---

## 5. Qui gère quoi ?

| Élément                           | Géré par                           |
| --------------------------------- | ---------------------------------- |
| Identité OIDC                     | **Keycloak**                       |
| Rôles admin / projet, permissions | **Console** (base de données)      |
| Groupes Keycloak dérivés          | **Console** (automatique)          |
| Application des droits            | **Console** + outils consommateurs |

---
