# IAM Console

Cette page présente l’IAM de la Console (Identity & Access Management) : authentification, autorisations et principes de synchronisation des groupes.

## Architecture fonctionnelle

L’IAM repose sur Keycloak pour l’identité (OIDC), une authentification backend via session ou jeton API, et une autorisation calculée côté serveur avec des bitmasks BigInt.

L’authentification navigateur passe par `fastify-keycloak-adapter`, qui extrait l’identité (`sub`, `email`, `given_name`, `family_name`, `groups`) et la stocke en session. Le mode jeton API (`x-dso-token`) existe aussi : il est complet dans le backend legacy, tandis que la migration NestJS est en cours pour la chaîne de validation complète.

L’autorisation combine des permissions globales (`ADMIN_PERMS`) et projet (`PROJECT_PERMS`) via OR bitwise, puis applique les décisions avec `AdminAuthorized.*` et `ProjectAuthorized.*`.

## Groupes et rôles

La Console maintient une hiérarchie de groupes Keycloak par projet pour matérialiser les rôles et la séparation RO/RW des environnements :

```txt
/<projectSlug>
  /console
    /<role-group-path...>
    /<environmentName>
      /RO
      /RW
```

La réconciliation est faite par `KeycloakService` (événements projet + cron), qui crée les groupes manquants, ajuste les memberships et purge les orphelins.

## Parcours (captures)

- Rôles plateforme (scope Console) : [Rôles plateforme](/administration/roles)
- Rôles projet (scope projet) : [Gestion des rôles](/guide/roles)

### Corroboration externe (GitLab)

Selon l’intégration et le niveau de synchronisation, on peut corroborer les accès via GitLab (projets et memberships).

![GitLab projets](/img/iam/gitlab-projects.png)
![GitLab membres du groupe](/img/iam/gitlab-group-members.png)

## Pour aller plus loin

- [Rôles plateforme](/administration/roles)
- [Gestion des rôles (projet)](/guide/roles)
- [Gestion des équipes](/guide/team)
- [Gestion des projets](/guide/projects-management)
- [Administration : utilisateurs](/administration/utilisateurs)
- [Administration : projets](/administration/projets)

## Sécurité

Ne pas renuméroter les bits de `ADMIN_PERMS`/`PROJECT_PERMS` sans migration contrôlée. Les cookies de session doivent rester `httpOnly` + `secure` en production (HTTPS). Les jetons API sont stockés hashés et doivent être traités comme des secrets.
