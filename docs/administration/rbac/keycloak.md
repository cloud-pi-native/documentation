# Groupes, utilisateurs et droits Keycloak

Ce document décrit le **modèle d'accès** de l'IdP central du socle : Keycloak. Keycloak est la **source de vérité** de l'identité et de la hiérarchie de groupes qui est propagée vers tous les autres outils de la chaîne DSO.

---

## Vue par rôle

En tant qu'IdP, Keycloak ne « donne » pas d'écran de droits : il place chaque rôle dans un groupe, et c'est ce groupe qui propage les droits en aval. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>`. Conséquence par rôle :

| Rôle Console | Groupe Keycloak (ADR 014) | Propagation en aval |
| --- | --- | --- |
| Admin plateforme | `console-admin` | Admin partout |
| Administrateur projet | `project-<name>-admin` | Admin du projet partout |
| DevOps | `project-<name>-devops` | RW projet (sauf admin) |
| Développeur | `project-<name>-developer` | Lecture/projet (selon outil) |
| Lecture seule | `project-<name>-readonly` | Lecture transverse du projet |
| Lecture seule | `platform-readonly` | Lecture transverse plateforme |
| Security | `project-<name>-security` | Audit/lecture transverse du projet |
| Security | `platform-security` | Audit/lecture transverse plateforme |
| Guest | — | Aucun droit jusqu'à ajout manuel à un projet |

---

## 1. Authentification OIDC

- Keycloak est le fournisseur d'identité (IdP) ; tous les outils DSO fédèrent dessus en OIDC.
- Les utilisateurs proviennent d'un IdP externe (ex. Passage2 / ProConnect) ou sont locaux. Les **rôles admin Console** sont liés à des groupes Keycloak existants via `oidcGroup`.

---

## 2. Hiérarchie de groupes maintenue par la Console

La Console crée et réconcilie automatiquement l'arborescence suivante (noms canoniques ADR 014), propagée vers les outils consommateurs :

| Groupe Keycloak (ADR 014) | Nature | Propagé vers |
| --- | --- | --- |
| `console-admin` | Groupe plateforme **admin** | Tous les outils (Admin global) |
| `platform-admin` | Groupe plateforme **admin** | Tous les outils (Admin global) |
| `platform-security` | Groupe plateforme **sécurité** | Tous les outils (audit/security) |
| `platform-readonly` | Groupe plateforme **lecture** | Tous les outils (lecture, `*RO`) |
| `project-<name>-admin` | Groupe projet **admin** | Tous les outils (admin projet) |
| `project-<name>-devops` | Groupe projet **devops** | Tous les outils (RW projet) |
| `project-<name>-developer` | Groupe projet **developer** | Tous les outils (selon outil) |
| `project-<name>-security` | Groupe projet **security** | Tous les outils (audit/lecture) |
| `project-<name>-readonly` | Groupe projet **readonly** | Tous les outils (lecture) |
| `/<slug>/console/<env>/<RO\|RW>` | Sous-groupes **environnement** (membres en RO, propriétaires en RW) | ArgoCD (`/<slug>/console/<env>/<RO\|RW>`) |
| `/<slug>/grafana/<hprod\|prod>-<RO\|RW>` | Sous-groupes **Grafana** (environnement-scoped) | Grafana |
| Groupes `AdminRole` liés via `oidcGroup` | Rôles admin Console | — |

> ℹ️ Les **rôles projet Console** (`Administrateur`, `DevOps`, `Développeur`, `Lecture seule`, `Security`) sont systématiquement liés aux groupes `project-<name>/{admin,devops,developer,readonly,security}`. Les rôles admin (`AdminRole`) sont les **seuls** pouvant être liés à un groupe Keycloak **existant** via `oidcGroup` (le préfixe `/` est obligatoire).

---

## 3. Points d'attention

- **`console-admin` et `platform-admin` sont tous deux Admin global.** Les deux groupes mappent en Admin partout.
- **Groupes environnement vs groupes projet.** ArgoCD et Grafana s'appuient sur des sous-groupes **environment-scoped** (`<env>/RO|RW`, `grafana/<hprod|prod>-RO|RW`). Les autres outils s'appuient sur les groupes **projet-role** (`project-<name>/{admin,devops,developer,readonly,security}`).
- **Security / Readonly sont des portées de lecture/audit**, jamais d'écriture, sur la plupart des outils.
- **Utilisateurs tiers (IDP externe).** Aucun groupe par défaut n'est attribué ; ils n'ont aucun droit tant qu'un membre les ajoute à un projet avec le niveau adéquat.

---

## 4. Mise en cohérence automatique

La Console réconcilie à chaque création/mise à jour de projet ou d'admin-role l'arborescence et l'appartenance des groupes Keycloak.

L'opération est **idempotente**.

---

## 5. Qui gère quoi ?

| Élément | Géré par |
| --- | --- |
| Fournisseur d'identité / realm | **Keycloak** (socle) |
| Hiérarchie de groupes projet/admin | **Console** (automatique) |
| Appartenance des utilisateurs aux groupes | **Console** (selon rôles/membres) + **Keycloak** |

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier).
- Fiche « Activation OTP obligatoire pour admins ».
- **Matrice RBAC** (groupes Keycloak ↔ droits par outil) : ADR « Gestion des droits fins ».
