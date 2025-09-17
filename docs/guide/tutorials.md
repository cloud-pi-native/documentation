# Tutoriels

Choisir entre un déploiement via le dépôt d'Infrastructure As Code `Manifestes` ou `Helm` lors de l'ajout du dépôt d'infrastructure dans la console.

## Déployer une application stateless

Tutoriel de déploiement d'un serveur web servant une page html statique.

### Nginx

Technologies:

- Server web Nginx

#### Dépôts

__Multirepo__

| Description        | Dépôt                                                           |
| ------------------ | --------------------------------------------------------------- |
| Applicatif         | <https://github.com/cloud-pi-native/tuto-static>                |
| IAC *(Manifestes)* | <https://github.com/cloud-pi-native/tuto-static-infra-manifest> |
| IAC *(Helm)*       | <https://github.com/cloud-pi-native/tuto-static-infra-helm>     |

__Monorepo__

| Description               | Dépôt                                                     |
| ------------------------- | --------------------------------------------------------- |
| Applicatif + IAC *(Helm)* | <https://github.com/cloud-pi-native/tuto-static-monorepo> |

### Nginx / Nodejs

Technologies:

- Server web Nginx
- Api Nodejs

#### Dépôts

__Monorepo__

| Description               | Dépôt                                              |
| ------------------------- | -------------------------------------------------- |
| Applicatif + IAC *(Helm)* | <https://github.com/cloud-pi-native/tuto-monorepo> |

## Déployer une application statefull

Tutoriel de déploiement d'une application dialoguant avec une base de données.

### Java / Postgresql

Technologies:

- Application Java
- Base de données Postgresql

#### Dépôts

__Multirepo__

| Description        | Dépôt                                                         |
| ------------------ | ------------------------------------------------------------- |
| Applicatif         | <https://github.com/cloud-pi-native/tuto-java>                |
| IAC *(Manifestes)* | <https://github.com/cloud-pi-native/tuto-java-infra-manifest> |
| IAC *(Helm)*       | <https://github.com/cloud-pi-native/tuto-java-infra-helm>     |

## Mocks

### Data-tooling

Un mock data-tooling permettant d'exposer un base de données PostgreSQL en tant qu'api rest est disponible [ici](https://github.com/cloud-pi-native/mock-data-tooling).

Ce mock contenant les outils suivants:

- haproxy: agit en tant qu'API Gateway
- postgrest: expose la base de données postgres au protocol REST
- cloudpgnative: opérateur k8s pour gérer un cluster de postgresql
- pgadmin: administration de la base de données
- vector: gestion des logs
- sops: gestion des secrets

> Ce chart helm est capable de gérer la réplication de base de données sur de multiples environnements cloisonnés via une synchronisation des wals depuis un S3

Pour l'utiliser, forker le dépôt et modifier le chart helm.

Il est accompagné d'un autre chart helm disponible [ici](https://github.com/cloud-pi-native/mock-data-tooling-minio) permettant d'installer un S3 (minio) avec un certain nombre de buckets créés par défaut.

### INES et Passage 2

Une fois que vous avez validé votre déploiement sur la console DSO de Scaleway, la suite logique est de répéter ce procédé au sein du réseau ministériel. Et dépendamment des besoins de votre application, vous aurez besoin ou non de communiquer avec les équipes de Passage2 et d'INES.

Pour vous aider, un mock a été mis en place [ici](https://github.com/cloud-pi-native/helm-projects-mocks/)

## Divers

### Monorepo

Il est aussi possible d'utiliser un monorepo comprenant le code applicatif ainsi que le code d'infrastructure, dans ce cas ajouter ce seul dépôt de code et cocher la case `Dépôt contenant du code d'infrastructure`.

### Accès aux images Harbor

Un secret nommé `registry-pull-secret` est automatiquement créé par la plateforme Cloud Pi Native lors de la création d'un environnement.

Vous pouvez retrouver un exemple d'utilisation de ce secret [ici](https://github.com/cloud-pi-native/exemples_ServiceTeam/blob/main/misc/pull_images_from_harbor/README.md)

### Exemples

Divers code d'exemple écrits par l'équipe Cloud Pi Native sont trouvables [ici](https://github.com/cloud-pi-native/exemples_ServiceTeam/).

Ces exemples se concentrent sur des points précis, comme le monitoring, l'utilisation de sops ou encore l'archivage des logs et sont fréquemment enrichis.
