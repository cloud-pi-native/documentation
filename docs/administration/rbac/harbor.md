# Groupes Keycloak et Harbor

Ce document décrit comment la Console propage les **groupes Keycloak** en **rôles Harbor** (membres d'un projet Harbor), et quels droits en résultent.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans Harbor. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console | Groupe Keycloak (ADR 014) | Accès obtenu dans Harbor |
| --- | --- | --- |
| Admin plateforme | `console-admin` | **Admin (global)** : gestion de tous les projets Harbor |
| Administrateur projet | `project-<name>-admin` | **Developer** sur le projet (push/pull d'images) |
| DevOps | `project-<name>-devops` | **Guest** sur le projet (pull/lecture, pas de push) |
| Développeur | `project-<name>-developer` | **Guest** sur le projet (pull/lecture) |
| Lecture seule | `project-<name>-readonly` | **Guest** sur le projet (lecture) |
| Lecture seule | `/console/readonly` | **Guest** sur **tous** les projets (lecture transverse) |
| Security | `project-<name>-security` | **Guest** sur le projet (lecture) |
| Security | `/console/security` | **Guest** sur **tous** les projets (lecture transverse) |
| Guest | — | Aucun accès |

---

## 1. Authentification : Harbor via OIDC Keycloak

- Harbor est fédéré au fournisseur OIDC Keycloak ; les utilisateurs se connectent sans mot de passe local.
- La Console approvisionne, pour chaque projet, le **projet Harbor** et y ajoute les groupes Keycloak comme **membres** avec un rôle (Admin / Developer / Guest).

---

## 2. Groupes Keycloak et rôle Harbor résultant

La Console mappe chaque groupe OIDC vers un **rôle Harbor** et une **portée** (projet ou global).

| Groupe Keycloak (ADR 014) | Rôle Harbor | Portée |
| --- | --- | --- |
| `console-admin` (`/console/admin`) | **Admin** (global) | Global |
| `/console/security` | **Guest** | Tous projets (plateforme) |
| `/console/readonly` | **Guest** | Tous projets (plateforme) |
| `project-<name>-admin` | **Developer** | Projet `<name>` |
| `project-<name>-devops` | **Guest** | Projet `<name>` |
| `project-<name>-developer` | **Guest** | Projet `<name>` |
| `project-<name>-security` | **Guest** | Projet `<name>` |
| `project-<name>-readonly` | **Guest** | Projet `<name>` |

> Le groupe racine du projet (`/<slug>`) est ajouté en tant que membre avec un niveau **Limited Guest** (pas de tirage d'images) pour l'ensemble de ses membres.

---

## 3. Points d'attention

- **Admin plateforme = Admin global Harbor.** `console-admin` (`/console/admin`) obtient le rôle **Admin** Harbor (gestion de tous les projets), pas un simple rôle de projet.
- **Seul `project-<name>-admin` pousse des images.** Tous les autres rôles projet (`devops`, `developer`, `security`, `readonly`) sont en **Guest** (pull/lecture uniquement).
- **Groupes `security`/`readonly` = Guest transverse.** Ils sont ajoutés en Guest sur **tous** les projets Harbor (portée plateforme), ce qui donne une lecture globale des registres.

---

## 4. Mise en cohérence automatique

À chaque réconciliation de projet, la Console synchronise les membres et rôles du projet Harbor.

L'opération est **idempotente**.

---

## 5. Qui gère quoi ?

| Élément | Géré par |
| --- | --- |
| Identité OIDC / groupes Keycloak | **Keycloak** |
| Projets Harbor, membres & rôles | **Console** (automatique) |
| Application des droits | **Harbor** |

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier).
- Fiche « Secrets Vault et Harbor ».
- **Matrice RBAC** : ADR « Gestion des droits fins ».
