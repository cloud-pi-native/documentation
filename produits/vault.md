# Gestion des secrets (de la chaine)

## Présentation

Les secrets de la chaine de construction sont gérés par un coffre [Hashicorp Vault](https://www.vaultproject.io/). Pour l'instant seuls les secrets de la chaine CI/CD sont gérés dans cet espace et les clients (utilisateurs de l'offre Cloud π Native) n'ont pas accès à ce coffre. La gestion des secrets applicatif est traité [ici](../gestion-secrets.md).

Ainsi, les secrets gérés dans hashicorp Vault concernent, pour l'instant, les besoins internes de la forge à savoir les token et credentials d'accès aux différents outils depuis gitlab-ci (SonaQube, Nexus, etc.)

## Organisation du Vault

Les secrets de la chaine DevOps sont stockés sur Vault sur un engine kv v2 (clé / valeur). Ces secrets sont traités de façon hiérarchique dans une arborescence : 

  - /
    - projects/
      - organisation_1/
        - projet1/
          - Outil1/
          - Outil2/
          - Outil3/
          - Outil4/
        - projet2/
        - projet3/
      - organisation_2/
        - projet1/
        - projet2/
        - projet3/
      - organisation_3/
      - [...]

Où *outilX* correspond aux différents outils de la chaine de construction. Ainsi, il est possible d'attribuer des droits d'accès à un projet pour l'ensemble de ses outils.

## Intégration dans la chaine gitlab-ci

Lors de la construction applicative par gitlab-ci, une première étape consiste à récupérer les secrets liés au projet. Pour cela gitlab-ci se connecte à vault via le protocole OpenId Connect et récupère uniquement les secrets liés à son projet applicatif. Vault génère un token d'accès unique, à durée courte, et limité au périmètre organisation / projet lié au projet dans gitlab. La première étape d'une pipeline gitlab consiste donc à récupérer les secrets de son environnement. Afin de simplifier cette étape, les templates de pipeline fournis par la console inclus directement cette étape comme suit :

```yaml
read_secret:
  stage: read-secret
  extends:
    - .vault:read_secret
```

La consultation de cette étape sur la pipeline peut être consultée depuis le menu de gitlab CI/CD -> pipeline :

![stage_read_secret](../img/gitlab-ci-read-secrets.png)

et les logs:

![log_read_secret](../img/gitlab-ci-vault.png)

> Cette étape est **obligatoire** afin de réaliser une contruction d'artefact.