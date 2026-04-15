# IAM Console

Cette page présente l’IAM de la Console (Identity & Access Management) sous un angle pratique : authentification, autorisations, puis un scénario visuel de validation basé sur les captures réelles.

## Architecture fonctionnelle

L’IAM repose sur Keycloak pour l’identité (OIDC), une authentification backend via session ou jeton API, et une autorisation calculée côté serveur avec des bitmasks BigInt.

L’authentification navigateur passe par `fastify-keycloak-adapter`, qui extrait l’identité (`sub`, `email`, `given_name`, `family_name`, `groups`) et la stocke en session. Le mode jeton API (`x-dso-token`) existe aussi : il est complet dans le backend legacy, tandis que la migration NestJS est en cours pour la chaîne de validation complète.

L’autorisation combine des permissions globales (`ADMIN_PERMS`) et projet (`PROJECT_PERMS`) via OR bitwise, puis applique les décisions avec `AdminAuthorized.*` et `ProjectAuthorized.*`.

## Groupes et roles

La Console maintient une hiérarchie de groupes Keycloak par projet pour matérialiser les roles et la séparation RO/RW des environnements :

```txt
/<projectSlug>
  /console
    /<role-group-path...>
    /<environmentName>
      /RO
      /RW
```

La réconciliation est faite par `KeycloakService` (événements projet + cron), qui crée les groupes manquants, ajuste les memberships et purge les orphelins.

## Scenario de validation (captures)

Ce scénario montre un enchaînement simple pour valider le comportement IAM en interface.

### 1) Accès à la Console

![Accueil Console](/img/iam/capture-01.png)

### 2) Visualisation des roles plateforme

![Liste des roles](/img/iam/capture-02.png)

### 3) Contrôle du role Root Administrateur Plateforme

On vérifie les permissions et le type du role.

![Role root admin - onglet General](/img/iam/capture-03.png)

### 4) Contrôle des membres du role

On valide les affectations d’utilisateurs au role.

![Role root admin - onglet Membres](/img/iam/capture-04.png)

### 5) Vérification côté GitLab

On contrôle la vue projets dans GitLab comme point de corroboration externe.

![GitLab projets](/img/iam/capture-05.png)

## Références techniques

- `apps/server-nestjs/src/cpin-module/core/app/app.service.ts`
- `apps/server/src/utils/controller.ts`
- `apps/server/src/resources/user/business.ts`
- `packages/shared/src/utils/permissions.ts`
- `apps/server-nestjs/src/modules/keycloak/keycloak.service.ts`
- `apps/server-nestjs/src/modules/keycloak/keycloak-client.service.ts`

## Sécurité

Ne pas renuméroter les bits de `ADMIN_PERMS`/`PROJECT_PERMS` sans migration contrôlée. Les cookies de session doivent rester `httpOnly` + `secure` en production (HTTPS). Les jetons API sont stockés hashés et doivent être traités comme des secrets.
