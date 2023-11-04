# Tutoriels

## Prise en main de la console

L'offre Cloud π Native est constitué d'un ensemble de services : gestionnaire de sources, outil de construction, gestion de la qaulité et de la sécurité, etc. ces outils interagissent entre eux. Une console permet de piloter l'ensemble de ces outils et est le point d'accès unique pour les clients de l'offre.

L'accès à la console sur l'environnment de pré-production est <https://console.apps.ocp4-8.infocepo.com/>

Le détail de la manipulation de la console est détaillée sur la page [getting started](/guide/get-started)

## Déployer une application stateless

Tutoriel de déploiement d'un serveur web servant une page html statique.

### Architecture applicative

- Serveur web Nginx

### Dépôts

| Dépôt              | Lien                                                |
| ------------------ | --------------------------------------------------- |
| Applicatif         | <https://github.com/dnum-mi/dso-tuto-static>        |
| IAC *(Manifestes)* | <https://github.com/dnum-mi/dso-tuto-static-deploy> |
| IAC *(Helm)*       | <https://github.com/dnum-mi/dso-tuto-static-helm>   |

> Choisir entre un déploiement via le dépôt d'Infrastructure As Code Manifestes ou Helm lors de l'ajout du dépôt d'infrastructure dans la console.

## Déployer une application statefull

Tutoriel de déploiement d'une application dialoguant avec une base de données.

### Architecture applicative

- Application Java
- Base de données Postgresql

### Dépôts


| Dépôt              | Lien                                              |
| ------------------ | ------------------------------------------------- |
| Applicatif         | <https://github.com/dnum-mi/dso-tuto-java>        |
| IAC *(Manifestes)* | <https://github.com/dnum-mi/dso-tuto-java-deploy> |
| IAC *(Helm)*       | <https://github.com/dnum-mi/dso-tuto-java-helm>   |

> Choisir entre un déploiement via le dépôt d'Infrastructure As Code Manifestes ou Helm lors de l'ajout du dépôt d'infrastructure dans la console.