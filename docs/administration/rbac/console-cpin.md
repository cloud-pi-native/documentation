# Utilisateurs, groupes et droits Console CPiN

Ce document décrit le **modèle d'accès** de la Console CPiN elle-même : comment ses rôles admin et projet se traduisent en permissions, et comment ils sont propagés vers Keycloak.

---

## Vue par rôle

Ce que chaque rôle peut réellement faire dans la Console CPiN. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console | Groupe Keycloak | Ce que je peux faire |
| --- | --- | --- |
| Admin plateforme (administration) | `/console/admin` | Administration globale : tous les projets, utilisateurs, plugins |
| Administrateur projet | `project-<name>-admin` | Gérer le projet : membres, environnements, dépôts, suppression |
| DevOps | `project-<name>-devops` | Gérer environnements + dépôts, rejouer les hooks, voir les secrets. **Pas** de déploiement applicatif ni de gestion des membres |
| Développeur | `project-<name>-developer` | Voir les secrets, rejouer le projet, gérer/lister les dépôts, lister les environnements |
| Lecture seule (projet) | `project-<name>-readonly` | Lister environnements et dépôts uniquement |
| Lecture seule (administration) | `/console/readonly` | Lecture transverse (tous projets) |
| Security (projet) | `project-<name>-security` | Lecture transverse du projet (audit) |
| Security (administration) | `/console/security` | Lecture transverse (tous projets, audit) |
| Guest (utilisateur externe sans groupe) | — | Aucun accès jusqu'à ajout à un projet |

---

## 1. Authentification : OIDC via Keycloak

- La Console authentifie ses utilisateurs via **OIDC Keycloak**.
- Les permissions effectives d'un utilisateur = agrégation (OU binaire) des `permissions` de tous ses rôles (admin + projet).

---

## 2. Rôles projet et permissions

Chaque projet reçoit 4 rôles système par défaut, liés aux groupes `project-<name>/*`.

| Rôle Console | Groupe Keycloak (ADR 014) | Permissions (bits `PROJECT_PERMS`) |
| --- | --- | --- |
| **Administrateur** | `project-<name>-admin` | `MANAGE` (gérer le projet) |
| **DevOps** | `project-<name>-devops` | `SEE_SECRETS`, `REPLAY_HOOKS`, `MANAGE_ENVIRONMENTS`, `MANAGE_REPOSITORIES`, `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES` |
| **Développeur** | `project-<name>-developer` | `SEE_SECRETS`, `REPLAY_HOOKS`, `MANAGE_REPOSITORIES`, `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES` |
| **Lecture seule** | `project-<name>-readonly` | `LIST_ENVIRONMENTS`, `LIST_REPOSITORIES` |

### Bits `PROJECT_PERMS` disponibles
`GUEST(0)`, `MANAGE(1)`, `MANAGE_MEMBERS(2)`, `MANAGE_ENVIRONMENTS(3)`, `MANAGE_REPOSITORIES(4)`, `MANAGE_ROLES(5)`, `SEE_SECRETS(6)`, `REPLAY_HOOKS(7)`, `LIST_ENVIRONMENTS(8)`, `LIST_REPOSITORIES(9)`, `LIST_MEMBERS(10)`, `LIST_ROLES(11)`, `MANAGE_DEPLOYMENTS(12)`, `LIST_DEPLOYMENTS(13)`.

---

## 3. Rôles admin et permissions

| Rôle Console | Groupe Keycloak (chemin) | Permissions (`ADMIN_PERMS`) |
| --- | --- | --- |
| Admin plateforme (`/console/admin`) | `/console/admin` | `MANAGE` + toutes les `MANAGE_*`, `LIST_*` (admin global) |
| Admin plateforme (nom de groupe `console-admin`) | `console-admin` | identique à `/console/admin` (même périmètre admin global) — nom utilisé côté Vault |
| Security (`/console/security`) | `/console/security` | lecture transverse (portée audit, `*RO`) |
| Lecture seule (`/console/readonly`) | `/console/readonly` | lecture transverse (`*RO`) |

> **Groupes Keycloak d'administration plateforme** : les seuls chemins Keycloak réels sont `/console/admin`, `/console/security` et `/console/readonly` (nommage en sous-groupes conservé et étendu par rétro-compatibilité). Les noms `console-admin`, `console-security`, `console-readonly` désignent le *nom* de groupe (sans `/`) dans certains outils (ex. Vault), mais le chemin Keycloak effectif reste `/console/<rôle>`.
>
> **`platform-admin` / `platform-security` / `platform-readonly` ne sont PAS des groupes Keycloak.** Ce sont les *policies* internes Vault (`platform--admin` / `platform--security` / `platform--readonly`) couplées aux rôles `console-*`, représentant la portée transversale (tous projets).

> **Axe ABAC `userType`** : indépendamment des groupes, certains endpoints restreignent l'accès selon le type d'utilisateur (`human` / `bot` / `ghost`, colonne `User.type`). Cet axe s'ajoute au masque de bits admin/projet.

> **Seul un rôle admin peut être lié à un groupe Keycloak existant** via un groupe d'application externe (chemin commençant par `/`). Les rôles projet ont leur groupe d'application préfixé automatiquement par `/<slug>`.

---

## 4. Points d'attention

- **Permissions = masque de bits.** Un rôle est la somme de permissions ; l'agrégation inter-rôles se fait en OU binaire.
- **`/console/admin` (nom `console-admin`) donne l'administration globale.** C'est le seul groupe Keycloak d'admin plateforme ; `platform-admin` est une policy Vault interne de même périmètre.
- **Développeur peut voir les secrets et rejouer le projet.** Contrairement à une lecture strictement passive, `developer` inclut la consultation des secrets et le rejeu de projet.
- **DevOps sans déploiement applicatif.** Le déploiement applicatif n'est pas couvert par le rôle DevOps par défaut ; ses droits portent sur les environnements, dépôts, hooks et secrets.
- **Groupe `everyonePerms`.** Un projet peut définir des permissions pour *Tout le monde*, appliquées au-delà des rôles nominatifs.

---

## 5. Mise en cohérence automatique

- À la création d'un projet, la Console initialise les rôles projet système liés aux groupes `project-<name>/*`.
- À chaque mise à jour, la Console crée les groupes Keycloak correspondants et synchronise les membres selon leurs rôles.
- Les rôles admin liés à un groupe d'application externe sont réconciliés vers des groupes Keycloak existants (créés si absents).

---

## 6. Qui gère quoi ?

| Élément | Géré par |
| --- | --- |
| Identité OIDC | **Keycloak** |
| Rôles admin / projet, permissions | **Console** (base de données) |
| Groupes Keycloak dérivés | **Console** (automatique) |
| Application des droits | **Console** + outils consommateurs |

---

## 7. Références

- Fiche « Hooks transverses - membres, roles, zones, clusters » (ce dossier).
- Fiche « Mécanisme des hooks et plugins ».
- **Matrice RBAC** : ADR « Gestion des droits fins » (table Console, section *Decision*).
