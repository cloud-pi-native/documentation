# Utilisateur, groupe et droits SonarQube

Ce document décrit le **modèle d'accès** mis en place dans SonarQube pour chaque projet DSO : qui accède à l'analyse, avec quelles permissions, et comment les rôles sont synchronisés depuis les groupes Keycloak.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans SonarQube. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console          | Groupe Keycloak (ADR 014)          | Accès obtenu dans SonarQube                                                  |
| --------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| Admin plateforme      | `console-admin` (`/console/admin`) | Administer System + profils/quality gates + **création de projets** (global) |
| Administrateur projet | `/<slug>/console/admin`            | Admin du projet + scan, codeviewer, issueadmin, securityhotspotadmin         |
| DevOps                | `/<slug>/console/devops`           | scan + user + codeviewer + issueadmin + securityhotspotadmin                 |
| Développeur           | `/<slug>/console/developer`        | identique DevOps (mêmes permissions projet)                                  |
| Lecture seule         | `/<slug>/console/reader`           | user + codeviewer (projet, visualisation)                                    |
| Lecture seule         | `/console/reader`                  | user + codeviewer (tous projets, visualisation)                              |
| Security              | `/<slug>/console/security`         | identique DevOps (mêmes permissions projet)                                  |
| Security              | `/console/security`                | identique DevOps (tous projets)                                              |
| Guest                 | —                                  | Aucun accès                                                                  |

---

## 1. Authentification : SonarQube via OIDC Keycloak

- Les utilisateurs se connectent à SonarQube via **OIDC** (Keycloak). Aucun compte/mot de passe local à gérer.
- La Console approvisionne, pour chaque projet, un **groupe Sonar** et lui applique un **modèle de permissions** (permission template) déduit des groupes OIDC.

---

## 2. Groupes Keycloak et permissions SonarQube

La Console mappe chaque groupe OIDC vers un ensemble de **permissions projet SonarQube**.

| Groupe Keycloak (ADR 014)              | Permissions SonarQube (projet)                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `console-admin` (`/console/admin`)     | **Administer System**, **Administer Quality Profiles**, **Administer Quality Gates**, **Create Projects** (admin global) |
| `/console/security`, `/console/reader` | Appliquent les groupes `/<slug>/console/security` / `/<slug>/console/reader` sur chaque projet                           |
| `/<slug>/console/admin`                | `admin`, `scan`, `user`, `codeviewer`, `issueadmin`, `securityhotspotadmin`                                              |
| `/<slug>/console/devops`               | `scan`, `user`, `codeviewer`, `issueadmin`, `securityhotspotadmin`                                                       |
| `/<slug>/console/developer`            | `scan`, `user`, `codeviewer`, `issueadmin`, `securityhotspotadmin`                                                       |
| `/<slug>/console/security`             | `scan`, `user`, `codeviewer`, `issueadmin`, `securityhotspotadmin`                                                       |
| `/<slug>/console/reader`               | `user`, `codeviewer`                                                                                                     |

> **Égalité devops = developer = security.** Sur un projet, les trois rôles `devops`, `developer` et `security` reçoivent **exactement les mêmes permissions** (`scan`, `user`, `codeviewer`, `issueadmin`, `securityhotspotadmin`). Seul `admin` ajoute `admin`. `reader` se limite à `user` + `codeviewer`.

---

## 3. Points d'attention

- **Developer et Security ne sont pas en lecture seule.** Contrairement à Vault, ils disposent de `scan` (exécution d'analyse) et de `issueadmin`/`securityhotspotadmin` (traitement des tickets de sécurité).
- **Admin projet ≠ admin global.** `/<slug>/console/admin` administre **le projet Sonar**, pas l'instance. L'admin global (`Administer System`, profils, gates, création de projets) est réservé à `console-admin` (`/console/admin`).

---

## 4. Mise en cohérence automatique

À chaque réconciliation de projet, la Console synchronise les groupes et permissions SonarQube du projet.

L'opération est **idempotente**.

---

## 5. Qui gère quoi ?

| Élément                               | Géré par                  |
| ------------------------------------- | ------------------------- |
| Identité OIDC / groupes Keycloak      | **Keycloak**              |
| Groupes Sonar, permissions, templates | **Console** (automatique) |
| Application des droits                | **SonarQube**             |

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier).
- Fiche « Secrets Vault et SonarQube ».
- **Matrice RBAC** : ADR « Gestion des droits fins ».
