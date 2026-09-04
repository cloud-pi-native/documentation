# Accès et droits Vault

Ce document décrit le **modèle d'accès** mis en place dans Vault pour chaque projet DSO : qui peut lire/écrire quels secrets, et comment ces droits sont synchronisés depuis les groupes Keycloak.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans Vault. Les chemins `/console/<rôle>` sont **réservés à l'administration plateforme** et distincts des rôles projet `/<slug>/console/<rôle>` :

| Rôle Console          | Groupe Keycloak (ADR 014)   | Accès obtenu dans Vault                                                                        |
| --------------------- | --------------------------- | ---------------------------------------------------------------------------------------------- |
| Admin plateforme      | `console-admin`             | Admin global : gestion complète `sys/*` (auth, mounts, policies, entities)                     |
| Administrateur projet | `/<slug>/console/admin`     | Owner du projet : tout `devops` + gestion des rôles/policies AppRole/transit du projet         |
| DevOps                | `/<slug>/console/devops`    | Lecture + écriture des secrets du projet (`<name>/data/*`)                                     |
| Développeur           | `/<slug>/console/developer` | Liste des secrets du projet uniquement (pas de lecture/écriture du contenu)                    |
| Lecture seule         | `/<slug>/console/reader`    | Liste des secrets du projet uniquement                                                         |
| Lecture seule         | `/console/reader`           | Lecture plateforme non-sensible : `sys/health`, `sys/mounts`, `sys/auth`, `sys/policies`       |
| Security              | `/<slug>/console/security`  | Audit projet : `<name>/metadata/*`, `transit/keys/<name>/*`                                    |
| Security              | `/console/security`         | Audit & posture plateforme : `sys/audit`, `sys/policies`, `<name>/metadata`, jamais le contenu |
| Guest                 | —                           | Aucun accès Vault                                                                              |

---

## 1. Authentification : Vault via OIDC Keycloak

- Vault expose une méthode d'auth **OIDC** (`oidc/`) dont le fournisseur d'identité est Keycloak.
- La Console crée, pour chaque projet, un **mount KV v2** nommé d'après le slug du projet (`<name>`), ainsi que les _policies_ et les **groupes d'identité externes** (type `external`) dont l'alias pointe vers le groupe OIDC Keycloak correspondant.
- Les applications consomment leurs secrets via un **AppRole** projet (`role-id` / `secret-id`) rattaché aux _policies_ techniques (`tech--<name>--ro` + `app--<name>--admin`), jamais via OIDC.

---

## 2. Groupes Keycloak et _policies_ associées

La Console génère, pour chaque projet, les groupes d'identité Vault suivants (nom canonique `project-<name>-<scope>`), chacun lié à une _policy_ et à un alias OIDC.

| Groupe Keycloak (ADR 014)                                        | _Policy_ générée             | Portée & capacités                                                                                                                                                                                                                                    |
| ---------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/console/admin` (groupe d'identité Vault `console-admin`)       | `platform--admin`            | **Admin plateforme** : `path "sys/*" { create, read, update, delete, list, sudo }`.                                                                                                                                                                   |
| `/console/security` (groupe d'identité Vault `console-security`) | `platform--security`         | **Audit & posture** : lecture `sys/audit/*`, `sys/policies/*`, `sys/auth/*`. Pas de contenu de secrets.                                                                                                                                               |
| `/console/reader` (groupe d'identité Vault `console-reader`)     | `platform--reader`           | **Lecture plateforme non-sensible** : `sys/health`, `sys/mounts`, `sys/auth`, `sys/policies`. Pas `<name>/data/*`.                                                                                                                                    |
| `/<slug>/console/admin`                                          | `app--<name>--admin`         | **Owner périmètre projet** : tout ce que `devops` + **gestion des rôles d'accès du projet** (policies préfixées projet, AppRole/JWT du projet, clés transit du projet). Pas d'accès hors projet.                                                      |
| `/<slug>/console/devops`                                         | `project--<name>--devops`    | **RW secrets du projet** (mount `<name>`, chemins relatifs au mount) : `<name>/data/*` {create,read,update,delete,list} ; `<name>/metadata/*` {read,list} ; `<name>/delete\|undelete\|destroy/*` {update}. Pas d'accès aux clés transit ni à AppRole. |
| `/<slug>/console/developer`                                      | `project--<name>--developer` | **List strict projet** : `<name>/data/*` {list}. Rien d'autre.                                                                                                                                                                                        |
| `/<slug>/console/security`                                       | `project--<name>--security`  | **Audit projet** : `<name>/metadata/*` {list} ; `transit/keys/<name>/*` {list}. Pas `<name>/data/*`.                                                                                                                                                  |
| `/<slug>/console/reader`                                         | `project--<name>--reader`    | **List strict projet** : `<name>/data/*` {list}. Rien d'autre.                                                                                                                                                                                        |

> Un projet possède également un rôle AppRole technique (`<name>`) pour les robots CI, rattaché aux _policies_ `tech--<name>--ro` (lecture d'un secret de registre dédié) et `app--<name>--admin`.

---

## 3. Points d'attention

- **Développeur = liste seule.** Le rôle `developer` ne dispose que de la capacité `list` sur `<name>/data/*` : il ne peut ni lire ni écrire le contenu d'un secret.
- **Security = audit, pas données.** Les groupes `security` (plateforme et projet) n'ont accès qu'aux _métadonnées_ et à la posture (`sys/audit`, `<name>/metadata`, `transit/keys`) ; jamais au contenu (`<name>/data`).
- **Admin projet ≠ admin plateforme.** `/<slug>/console/admin` est confiné au mount `<name>/*` ; seul le groupe `/console/admin` obtient `sys/*`.
- **Groupe = matrice ADR 014.** Les noms ci-dessus sont canoniques (ADR 014) ; le chemin Keycloak réel créé par la Console dépend de la configuration déployée.

---

## 4. Mise en cohérence automatique

À chaque création/mise à jour d'un projet, la Console synchronise automatiquement
les policies et les groupes d'identité Vault du projet.

L'opération est **idempotente**. La suppression de projet retire le mount et les groupes associés.

---

## 5. Qui gère quoi ?

| Élément                                         | Géré par                              |
| ----------------------------------------------- | ------------------------------------- |
| Identité OIDC / groupes Keycloak                | **Keycloak** (fournisseur d'identité) |
| Mounts, _policies_, groupes d'identité, AppRole | **Console** (automatique)             |

> Pour donner accès à un utilisateur, on l'ajoute au rôle/groupe adéquat côté Console / OIDC ; la Console répercute la _policy_ dans Vault.

---

## 6. Références

- Fiche « Provisionnement automatique par la Console » (ce dossier) — vue d'ensemble.
- Fiche « Secrets Vault et … » (et équivalents) — tokens & miroir.
- **Matrice RBAC** (groupes Keycloak ↔ droits par outil) : ADR « Gestion des droits fins ».
