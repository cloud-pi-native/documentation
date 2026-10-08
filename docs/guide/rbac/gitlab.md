# Groupes Keycloak et GitLab

Ce document décrit comment la Console propage les **groupes Keycloak** en **niveaux d'accès GitLab** (membres du groupe du projet), et quels droits en résultent.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans GitLab, sur le **groupe du projet** :

| Rôle Console          | Groupe Keycloak             | Accès obtenu dans GitLab   |
| --------------------- | --------------------------- | -------------------------- |
| Propriétaire projet  | —                           | **Owner** sur le groupe    |
| Administrateur projet | `/<slug>/console/admin`     | **Maintainer** sur le groupe |
| DevOps                | `/<slug>/console/devops`    | **Developer** sur le groupe |
| Développeur           | `/<slug>/console/developer` | **Developer** sur le groupe |
| Lecture seule         | `/<slug>/console/readonly`  | **Reporter** sur le groupe |
| Guest                 | —                           | Aucun accès                |

> Les groupes d'administration plateforme (`/console/*`) ne sont pas propagés vers GitLab : seuls les rôles projet ouvrent un accès au groupe GitLab du projet.

---

## 1. Authentification : GitLab via OIDC Keycloak

- GitLab est fédéré au fournisseur OIDC Keycloak ; les utilisateurs se connectent sans mot de passe local.
- La Console approvisionne, pour chaque projet, le **groupe GitLab** et y ajoute les membres avec un niveau d'accès (Owner / Maintainer / Developer / Reporter).

---

## 2. Groupes Keycloak et niveau GitLab résultant

La Console mappe chaque rôle projet vers un **niveau d'accès GitLab** (membre direct du groupe du projet).

| Groupe Keycloak             | Niveau GitLab   |
| --------------------------- | --------------- |
| `/<slug>/console/admin`     | **Maintainer**  |
| `/<slug>/console/devops`    | **Developer**   |
| `/<slug>/console/developer` | **Developer**   |
| `/<slug>/console/readonly`  | **Reporter**    |

- **Propriétaire du projet** : **Owner** (toujours le niveau le plus élevé, indépendamment des rôles).
- **Cumul des rôles** : en cas de rôles multiples, le **niveau le plus élevé** l'emporte.
- Cette correspondance peut être adaptée par les administrateurs via la configuration du plugin GitLab (suffixes de groupes `projectMaintainerGroupPathSuffix`, `projectDeveloperGroupPathSuffix`, `projectReporterGroupPathSuffix`).

---

## 3. Points d'attention

- **Provisionnement autoritaire.** La Console prend le contrôle total de l'appartenance du groupe : tout membre non tracé par la Console est **supprimé**, les modifications manuelles dans GitLab sont écrasées à la synchronisation.
- **Phase de rétrocompatibilité (9.16.x)** — un rôle sans groupe OIDC reçoit `Developer` par défaut lors de l'ajout ; ce comportement évoluera vers `Guest` dans une prochaine version.

---

## 4. Qui gère quoi ?

| Élément                            | Géré par                  |
| ---------------------------------- | ------------------------- |
| Identité OIDC / groupes Keycloak   | **Keycloak**              |
| Groupes GitLab, membres & niveaux  | **Console** (automatique) |
| Application des droits             | **GitLab**                |

---
