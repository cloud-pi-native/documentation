# Groupes Keycloak et GitLab

Ce document décrit comment la Console propage les **groupes Keycloak** en **niveaux d'accès GitLab** (membres du groupe du projet), et quels droits en résultent.

---

## Vue par rôle

Ce que chaque rôle Console obtient réellement dans GitLab :

| Rôle Console          | Groupe Keycloak             | Accès obtenu dans GitLab     |
| --------------------- | --------------------------- | ---------------------------- |
| Propriétaire projet  | —                           | **Owner** sur le groupe      |
| Administrateur projet | `/<slug>/console/admin`     | **Maintainer** sur le groupe |
| DevOps                | `/<slug>/console/devops`    | **Maintainer** sur le groupe |
| Développeur           | `/<slug>/console/developer` | **Developer** sur le groupe  |
| Lecture seule         | `/<slug>/console/readonly`  | **Reporter** sur le groupe   |
| Security              | `/<slug>/console/security`  | **Reporter** sur le groupe   |
| Admin plateforme      | `/console/admin`            | **Admin GitLab** (flag instance) |
| Audit plateforme      | `/console/readonly`, `/console/security` | **Auditeur GitLab** (flag auditor) |

---

## 1. Authentification : GitLab via OIDC Keycloak

- GitLab est fédéré au fournisseur OIDC Keycloak ; les utilisateurs se connectent sans mot de passe local.
- La Console approvisionne, pour chaque projet, le **groupe GitLab** et y ajoute les membres avec un niveau d'accès (Owner / Maintainer / Developer / Reporter / Guest).

---

## 2. Groupes Keycloak et niveau GitLab résultant

| Groupe Keycloak             | Niveau GitLab   |
| --------------------------- | --------------- |
| `/<slug>/console/admin`     | **Maintainer**  |
| `/<slug>/console/devops`    | **Maintainer**  |
| `/<slug>/console/developer` | **Developer**   |
| `/<slug>/console/readonly`  | **Reporter**    |
| `/<slug>/console/security`  | **Reporter**    |

- **Propriétaire du projet** : **Owner** (toujours le niveau le plus élevé, indépendamment des rôles).
- **Cumul des rôles** : en cas de rôles multiples, le **niveau le plus élevé** l'emporte.
- **Rôle sans groupe OIDC reconnu** : le membre reçoit **Guest** (accès minimal au groupe).
- **Rôles plateforme** : les membres d'`/console/admin` reçoivent le flag GitLab **admin** (administration de l'instance) ; les membres des groupes d'audit (`/console/readonly`, `/console/security`) reçoivent le flag **auditor** (lecture sur toute l'instance).
- Cette correspondance peut être adaptée via la configuration du plugin GitLab (`projectMaintainerGroupPathSuffix`, `projectDeveloperGroupPathSuffix`, `projectReporterGroupPathSuffix`, `adminGroupPath`, `auditorGroupPath`).

---

## 3. Points d'attention

- **Provisionnement autoritaire.** La Console prend le contrôle total de l'appartenance du groupe : tout membre non tracé par la Console est **supprimé**, les modifications manuelles dans GitLab sont écrasées à la synchronisation.
- Les dépôts `infra-apps` et `mirror` sont des dépôts techniques Console, jamais des cibles de mirroring.

---

## 4. Qui gère quoi ?

| Élément                            | Géré par                  |
| ---------------------------------- | ------------------------- |
| Identité OIDC / groupes Keycloak   | **Keycloak**              |
| Groupes GitLab, membres & niveaux  | **Console** (automatique) |
| Application des droits             | **GitLab**                |

---
