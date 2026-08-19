# Utilisateurs, groupes et droits Grafana

Ce document décrit le **modèle d'accès** mis en place dans Grafana pour chaque projet DSO. Contrairement aux autres outils, l'accès Grafana est **scopé par environnement** (prod / hors-prod) et non par rôle projet.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans Grafana (scopé par environnement). Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console | Groupe Keycloak (ADR 014) | Accès obtenu dans Grafana |
| --- | --- | --- |
| Admin plateforme | `console-admin` | **Organization Admin** (globale) |
| Admin plateforme | `platform-admin` | **Editor** (globale) |
| Administrateur projet | `project-<name>-admin` | **Editor** (hors-prod + prod) |
| DevOps | `project-<name>-devops` | **Editor** (hors-prod + prod) |
| Développeur | `project-<name>-developer` | **Viewer** (hors-prod + prod) |
| Lecture seule | `project-<name>-readonly` | **Viewer** (projet) |
| Lecture seule | `platform-readonly` | **Viewer** (globale) |
| Security | `project-<name>-security` | **Viewer** (projet) |
| Security | `platform-security` | **Viewer** (globale) |
| Guest | — | Aucun accès |

> L'accès réel dépend de la capacité Console par bucket d'environnement : `MANAGE_ENVIRONMENTS` → Editor, `LIST_ENVIRONMENTS` → Viewer, séparément pour hors-prod (`hprod`) et prod.

---

## 1. Authentification : Grafana via OIDC Keycloak

- Grafana est fédéré au fournisseur OIDC Keycloak. Le mapping **groupe Keycloak → rôle Grafana** est configuré côté Grafana (son fichier de configuration OIDC), pas par la Console.
- La Console crée et maintient, **sous le groupe racine `/<slug>`**, le sous-groupe `grafana` et ses sous-groupes `hprod-RO/RW` et `prod-RO/RW`.

---

## 2. Groupes Keycloak et rôle Grafana résultant

| Groupe Keycloak (ADR 014) | Rôle Grafana (mapping OIDC) | Portée |
| --- | --- | --- |
| `console-admin` | **Organization Admin** | Globale |
| `platform-admin` | **Editor** | Globale |
| `platform-security`, `platform-readonly` | **Viewer** | Globale (lecture) |
| `project-<name>-admin` | **Editor** | Projet `<name>` |
| `project-<name>-devops` | **Editor** | Projet `<name>` |
| `project-<name>-developer` | **Viewer** | Projet `<name>` |
| `project-<name>-security` | **Viewer** | Projet `<name>` |
| `project-<name>-readonly` | **Viewer** | Projet `<name>` |
| `/<slug>/grafana/hprod-RW` | **Editor** (hors-prod) | Projet `<slug>`, hors-prod |
| `/<slug>/grafana/hprod-RO` | **Viewer** (hors-prod) | Projet `<slug>`, hors-prod |
| `/<slug>/grafana/prod-RW` | **Editor** (prod) | Projet `<slug>`, prod |
| `/<slug>/grafana/prod-RO` | **Viewer** (prod) | Projet `<slug>`, prod |

---

## 3. Points d'attention

- **Scoping prod / hors-prod.** Un utilisateur avec droits sur un environnement `prod` est ajouté aux sous-groupes `prod-*` ; sinon aux `hprod-*` (hors-prod). Les deux peuvent coexister.
- **RW vs RO.** `RW` ⇔ capacité `MANAGE_ENVIRONMENTS` (édition) ; `RO` ⇔ `LIST_ENVIRONMENTS` (visualisation). Le propriétaire du projet est toujours RW.
- **`console-admin` ≠ `platform-admin` sur Grafana.** `console-admin` obtient le rôle **Organization Admin** (globale) ; `platform-admin` n'obtient que **Editor** (globale). Seul `console-admin` est administrateur de l'organisation Grafana.
- **Le rôle Grafana réel est défini par la config OIDC de Grafana**, pas par la Console. La Console se contente de maintenir l'arborescence de groupes Keycloak.

---

## 4. Mise en cohérence automatique

À chaque réconciliation de projet, la Console synchronise l'arborescence de groupes Grafana du projet.

L'opération est **idempotente**.

---

## 5. Qui gère quoi ?

| Élément | Géré par |
| --- | --- |
| Identité OIDC / groupes Keycloak | **Keycloak** |
| Arborescence des groupes `grafana/*` | **Console** (automatique) |
| Mapping groupe → rôle Grafana | **Grafana** (config OIDC) |

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier).
- Fiche « Architecture GitOps de l'observabilité ».
- **Matrice RBAC** : ADR « Gestion des droits fins ».
