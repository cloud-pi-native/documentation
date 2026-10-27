# IAM Console

Cette page présente l’IAM de la Console (Identity & Access Management) : authentification, autorisations et principes de synchronisation des groupes.

## Architecture fonctionnelle

L’IAM repose sur Keycloak pour l’identité (OIDC), une authentification backend via session ou jeton API, et une autorisation calculée côté serveur avec des bitmasks BigInt.

L’authentification navigateur s’appuie sur Keycloak (OIDC) : le client attache un jeton `Authorization: Bearer` émis par Keycloak et le backend résout l’identité du jeton (`sub`, `email`, `given_name`, `family_name`, groupes OIDC). Un mode jeton API (`x-dso-token`) existe aussi pour des usages non interactifs.

L’API de la Console est désormais servie intégralement par le backend NestJS : les anciens endpoints V1 `/api/v1/environments` et `/api/v1/repositories` ne sont pas repris, utilisez leurs équivalents V2 sous `/api/v2/projects/:projectId/`. Le Swagger historique `/swagger-ui` n’est plus servi (404) ; la documentation d’API maintenue est disponible à `/swagger-ui-server-nestjs`. À la création d’un jeton d’API, une date d’expiration laissée vide est acceptée et équivaut à l’absence d’expiration.

L’autorisation combine des permissions globales et projet par cumul : les droits attribués à l’utilisateur sont calculés à partir de l’ensemble de ses rôles.

La Console reste la source de vérité des droits ; les services externes consomment une projection synchronisée de ces droits selon les intégrations actives.

## Groupes et rôles

La Console maintient une hiérarchie de groupes Keycloak par projet pour matérialiser les rôles :

```txt
/<projectSlug>
  /console
    /<role-group-path...>
```

La Console maintient ces groupes automatiquement (création des groupes manquants, mise à jour des appartenances et nettoyage des groupes orphelins).

Certains rôles affichés dans la Console sont préconfigurés (rôles “système”) et sont en lecture seule. Dans ce cas, l’interface permet typiquement de gérer les membres, mais pas de modifier le contenu du rôle.

## Parcours

- Rôles plateforme (scope Console) : [Rôles plateforme](/administration/roles)
- Rôles projet (scope projet) : [Gestion des rôles](/guide/roles)

### Corroboration externe (exemple GitLab)

Selon les intégrations actives et le niveau de synchronisation, on peut corroborer les accès dans les services externes (projets et memberships). À ce jour, GitLab est le service intégré pour ce contrôle.

Voir des exemples de captures dans [Gestion des rôles](/guide/roles) et [Rôles plateforme](/administration/roles).

Pour que cette vérification soit pertinente :

- l’intégration du service concerné doit être active ;
- le mapping des groupes/rôles doit être configuré pour ce service ;
- la synchronisation doit être terminée.

## Pour aller plus loin

- [Rôles plateforme](/administration/roles)
- [Gestion des rôles (projet)](/guide/roles)
- [Gestion des équipes](/guide/team)
- [Gestion des projets](/guide/projects-management)
- [Administration : utilisateurs](/administration/utilisateurs)
- [Administration : projets](/administration/projets)

## Sécurité

Ne pas renuméroter les bits de `ADMIN_PERMS`/`PROJECT_PERMS` sans migration contrôlée. Les cookies de session doivent rester `httpOnly` + `secure` en production (HTTPS). Les jetons API sont stockés hashés et doivent être traités comme des secrets.

Contrôles opératoires recommandés :

- vérifier régulièrement les rôles à privilèges élevés ;
- valider les appartenances aux groupes synchronisés ;
- auditer périodiquement les jetons API actifs.
