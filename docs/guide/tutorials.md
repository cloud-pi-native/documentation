# Tutoriels

## Déployer une application stateless

Tutoriel de déploiement d'un serveur web servant une page html statique.

### Nginx

Technologies:
- Server web Nginx

#### Dépôts

| Description        | Dépôt                                                           |
| ------------------ | --------------------------------------------------------------- |
| Applicatif         | <https://github.com/cloud-pi-native/tuto-static>                |
| IAC *(Manifestes)* | <https://github.com/cloud-pi-native/tuto-static-infra-manifest> |
| IAC *(Helm)*       | <https://github.com/cloud-pi-native/tuto-static-infra-helm>     |

> Choisir entre un déploiement via le dépôt d'Infrastructure As Code Manifestes ou Helm lors de l'ajout du dépôt d'infrastructure dans la console.

__Monorepo__
> [!TIP]
> Il est aussi possible d'utiliser un monorepo comprenant le code applicatif ainsi que le code d'infrastructure :

| Description               | Dépôt                                                     |
| ------------------------- | --------------------------------------------------------- |
| Applicatif + IAC *(Helm)* | <https://github.com/cloud-pi-native/tuto-static-monorepo> |

## Déployer une application statefull

Tutoriel de déploiement d'une application dialoguant avec une base de données.

### Java / Postgresql

Technologies:
- Application Java
- Base de données Postgresql

#### Dépôts


| Description        | Dépôt                                                         |
| ------------------ | ------------------------------------------------------------- |
| Applicatif         | <https://github.com/cloud-pi-native/tuto-java>                |
| IAC *(Manifestes)* | <https://github.com/cloud-pi-native/tuto-java-infra-manifest> |
| IAC *(Helm)*       | <https://github.com/cloud-pi-native/tuto-java-infra-helm>     |

> Choisir entre un déploiement via le dépôt d'Infrastructure As Code Manifestes ou Helm lors de l'ajout du dépôt d'infrastructure dans la console.
