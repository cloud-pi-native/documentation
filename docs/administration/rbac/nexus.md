# Utilisateur et droits Nexus

Ce document décrit le **modèle d'accès** mis en place dans Nexus pour chaque projet DSO : qui peut publier ou télécharger des artefacts, et comment les rôles sont synchronisés depuis les groupes Keycloak.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans Nexus. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console | Groupe Keycloak (ADR 014) | Accès obtenu dans Nexus |
| --- | --- | --- |
| Admin plateforme | `console-admin` | **Admin** : gestion de tous les dépôts |
| Administrateur projet | `project-<name>-admin` | Gérer le dépôt CI/CD du projet (écriture) |
| DevOps | `project-<name>-devops` | Déployer des artefacts (écriture, projet) |
| Développeur | `project-<name>-developer` | Téléchargement de dépendances (lecture, projet) |
| Lecture seule | `project-<name>-readonly` | Lecture des packages/dépôts du projet |
| Lecture seule | `/console/readonly` | Lecture de tous les dépôts (plateforme) |
| Security | `project-<name>-security` | Lecture des dépôts du projet |
| Security | `/console/security` | Lecture de tous les dépôts (plateforme) |
| Guest | — | Aucun accès |

---

## 1. Authentification : Nexus via OIDC Keycloak

- Les utilisateurs se connectent à Nexus via **OIDC** (Keycloak).
- La Console approvisionne, pour chaque projet, un **rôle de sécurité** (`<name>-ID` / `<name>-role`) et y rattache les groupes OIDC comme membres avec des *privileges* de lecture ou d'écriture.

---

## 2. Groupes Keycloak et portée Nexus

La Console répartit les chemins de groupes OIDC en deux ensembles : **écriture** (publish/deploy) et **lecture** (download/browse).

| Groupe Keycloak (ADR 014) | Type d'accès Nexus | Portée |
| --- | --- | --- |
| `console-admin` (`/console/admin`) | **Admin** + lecture tous projets | Tous les dépôts |
| `/console/security` | **Lecture** | Tous les dépôts (repos) |
| `/console/readonly` | **Lecture** | Tous les dépôts |
| `project-<name>-admin` | **Écriture** | Dépôt CI/CD du projet `<name>` |
| `project-<name>-devops` | **Écriture** (déployer artefacts) | Dépôt du projet `<name>` |
| `project-<name>-developer` | **Lecture** (téléchargement dépendances) | Dépôt du projet `<name>` |
| `project-<name>-security` | **Lecture** | Dépôt du projet `<name>` |
| `project-<name>-readonly` | **Lecture** (packages) | Dépôt du projet `<name>` |

---

## 3. Points d'attention

- **DevOps = déployer, Developer = télécharger.** Les groupes `admin`/`devops` projet écrivent (publish artefacts, deploy) ; `developer`/`security`/`readonly` ne font que lire/télécharger.
- **Admin plateforme = Admin Nexus.** `console-admin` (`/console/admin`) obtient les privilèges Admin + lecture de tous les dépôts (rôles platform agrégés sur l'ensemble des projets).
- **Rôles agrégés par projet Nexus.** Le rôle `<name>-ID` agrège les privilèges de tous les projets Nexus activés ; un groupe OIDC est rattaché à ce rôle avec le bon niveau (read/write).

---

## 4. Mise en cohérence automatique

À chaque réconciliation de projet, la Console synchronise les rôles et privilèges Nexus du projet.

L'opération est **idempotente**.

---

## 5. Qui gère quoi ?

| Élément | Géré par |
| --- | --- |
| Identité OIDC / groupes Keycloak | **Keycloak** |
| Rôles & privilèges Nexus | **Console** (automatique) |

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier).
- Fiche « Secrets Vault et Nexus ».
- **Matrice RBAC** : ADR « Gestion des droits fins ».
