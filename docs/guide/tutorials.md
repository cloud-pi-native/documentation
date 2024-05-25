# Tutoriels

Choisir entre un déploiement via le dépôt d'Infrastructure As Code `Manifestes` ou `Helm` lors de l'ajout du dépôt d'infrastructure dans la console.

__Monorepo__
> [!TIP]
> Il est aussi possible d'utiliser un monorepo comprenant le code applicatif ainsi que le code d'infrastructure, dans ce cas ajouter ce seul dépôt de code et cocher la case `Dépôt contenant du code d'infrastructure`.

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
