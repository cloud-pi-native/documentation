# Utilisateurs, groupes et droits Grafana

Ce document décrit le **modèle d'accès** mis en place dans Grafana pour chaque projet DSO. Contrairement aux autres outils, l'accès Grafana est **scopé par environnement** (prod / hors-prod) et non par rôle projet.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans Grafana (scopé par environnement). Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console          | Groupe Keycloak          | Accès obtenu dans Grafana        |
| --------------------- | ---------------------------------- | -------------------------------- |
| Administrateur projet | `/<slug>/console/admin`            | **Editor** (hors-prod + prod)    |
| DevOps                | `/<slug>/console/devops`           | **Editor** (hors-prod + prod)    |
| Développeur           | `/<slug>/console/developer`        | **Viewer** (hors-prod + prod)    |
| Lecture seule         | `/<slug>/console/reader`           | **Viewer** (projet)              |
| Lecture seule         | `/console/reader`                  | **Viewer** (globale)             |
| Security              | `/<slug>/console/security`         | **Viewer** (projet)              |
| Security              | `/console/security`                | **Viewer** (globale)             |
| Guest                 | —                                  | Aucun accès                      |

> L'accès réel dépend de la capacité Console par bucket d'environnement : `MANAGE_ENVIRONMENTS` → Editor, `LIST_ENVIRONMENTS` → Viewer, séparément pour hors-prod (`hprod`) et prod.

---

## 1. Authentification : Grafana via OIDC Keycloak

- Grafana est fédéré au fournisseur OIDC Keycloak. Le mapping **groupe Keycloak → rôle Grafana** est configuré côté Grafana (son fichier de configuration OIDC), pas par la Console.
- La Console crée et maintient, **sous le groupe racine `/<slug>`**, le sous-groupe `grafana` et ses sous-groupes `hprod-RO/RW` et `prod-RO/RW`.

---

## 2. Groupes Keycloak et rôle Grafana résultant

| Groupe Keycloak              | Rôle Grafana (mapping OIDC) | Portée                     |
| -------------------------------------- | --------------------------- | -------------------------- |
| `/console/security`, `/console/reader` | **Viewer**                  | Globale (lecture)          |
| `/<slug>/console/admin`                | **Editor**                  | Projet `<name>`            |
| `/<slug>/console/devops`               | **Editor**                  | Projet `<name>`            |
| `/<slug>/console/developer`            | **Viewer**                  | Projet `<name>`            |
| `/<slug>/console/security`             | **Viewer**                  | Projet `<name>`            |
| `/<slug>/console/reader`               | **Viewer**                  | Projet `<name>`            |
| `/<slug>/grafana/hprod-RW`             | **Editor** (hors-prod)      | Projet `<slug>`, hors-prod |
| `/<slug>/grafana/hprod-RO`             | **Viewer** (hors-prod)      | Projet `<slug>`, hors-prod |
| `/<slug>/grafana/prod-RW`              | **Editor** (prod)           | Projet `<slug>`, prod      |
| `/<slug>/grafana/prod-RO`              | **Viewer** (prod)           | Projet `<slug>`, prod      |

---

## 3. Points d'attention

- **Scoping prod / hors-prod.** Un utilisateur avec droits sur un environnement `prod` est ajouté aux sous-groupes `prod-*` ; sinon aux `hprod-*` (hors-prod). Les deux peuvent coexister.
- **RW vs RO.** `RW` ⇔ capacité `MANAGE_ENVIRONMENTS` (édition) ; `RO` ⇔ `LIST_ENVIRONMENTS` (visualisation). Le propriétaire du projet est toujours RW.
- **Le rôle Grafana réel est défini par la config OIDC de Grafana**, pas par la Console. La Console se contente de maintenir l'arborescence de groupes Keycloak.

---

## 4. Qui gère quoi ?

| Élément                              | Géré par                  |
| ------------------------------------ | ------------------------- |
| Identité OIDC / groupes Keycloak     | **Keycloak**              |
| Arborescence des groupes `grafana/*` | **Console** (automatique) |
| Mapping groupe → rôle Grafana        | **Grafana** (config OIDC) |

---
