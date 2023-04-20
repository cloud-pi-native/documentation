# Cloud π Native

:warning: __*La plateforme est en cours de construction et des évolutions fréquentes sont à prévoir.*__ :warning:

## L'offre

### Présentation (WIP)

Avec l’adoption de la doctrine « Cloud au centre », le Gouvernement Français fait du Cloud un prérequis pour tout nouveau projet numérique au sein de l’État ou refonte substantielle de l’architecture applicative existante.

>Objectif : accélérer la transformation numérique au bénéfice des usagers et dans le strict respect de la cybersécurité et de la protection des données des citoyens et des entreprises.

L'offre Cloud π Native, offre les services d'une plateforme DevSecOps complète afin de suivre le cycle de vie complet de son projet.

[vision](img/vision.png)

La philosophie de l'offre est de laisser les équipes de développement travailler sans contrainte avec leur socle logiciel d'intégration et de déploiement (carré en haut à gauche). une fois que le projet est suffisament prêt, il est possible de l'intégrer sur l'offre Cloud π Native par :
  - Recopie des repository de code et de déploiement
  - Construction des artefacts sur l'offre Cloud π Native
  - Aanalyse de qualité et de sécurité
  - Construction des images Dockers
Enfin,  déploiement sur différentes cibles possibles :
 - Offres kubernetes managés gérés par l'équipe client chez un Cloud Service Provider disposant d'un service kubernetes managé
 - Offre Openshift sur les environnements diffusion restreinte ou non 

### Services proposés

L'offre Cloud π Native, portée par le Ministère de l'Intérieur et des Outre-Mer est une offre PaaS basée sur [Cloud π](https://www.numerique.gouv.fr/services/cloud/cloud-interne/) sur les infrastructures du ministère de l'intérieur offrant des fonctionnalités DevSecOps à savoir :

  - [Gestionnaire de sources](produits/gitlab.md) applicatives
  - Outil de gestion de la [qualité](produits/sonarqube.md) statique du code (SAST) et dynamique (DAST)
  - Orchestrateur de [construction](produits/gitlab.md) d'artefacts (Intégration continue)
  - [Entrepot d'artefacts](produits/artefacts.md) et d'images Docker
  - Gestionnaire de [secrets](produits/vault.md) des chaines IC/DC
  - Gestion des [secrets applicatifs](gestion-secrets.md)
  - Outil de [déploiement automatisé](produits/gitops.md) des images Docker sur les infrastructures du ministère ou à l'extérieur du ministère en suivant les principes GitOps (Déploiement continue)
  - Hébergement des [environnements](gestion-environnements.md) applicatifs de l'intégration à la production
  - Mise à disposition d'outil d'[observabilité et exploitabilité](exploitation.md) des applications déployées sur l'offre : accès aux logs, métriques techniques et applicatives, procédures standard d'exploitation

L'architecture générale de l'offre Cloud π Native est la suivante :

[](img/architecture.png)

### SLA de l'offre (WIP)

L'offre Cloud π Native peut se séparer en plusieurs grands services ayant des contraintes de SLA différentes :

  - Outils de construction applicative (Intégration continue) permettant de construire un package applicatif à partir des sources
  - Outils de déploiement (Déploiement continue) permettant de déployer / mettre à jour une application sur les différents environnements de l'offre
  - Les applications qui sont déployées sur l'offre. Chacune de ses applications peuvent également avoir un niveau de criticité différent (par exemple l'environnement de production a un besoin de SLA plus fort que l'environnement de recette)

| Service      | DIMA*       |        PDMA**
| ------------ | ----------- | -------- |
| Construction | 8 heures | 24h (backup nocturne quotidien) |
| Déploiement  | 8 heures | 24h (backup nocturne quotidien) |
| Run des applications | 6 heures | 24h (backup nocturne quotidien). Possibilité d'ajouter un backup applicatif plus fréquent (voir notre [FAQ](faq.md)) |


*DIMA : Durée d'interruption maximale autorisée (en heures ouvrés)

**PDMA : Perte de données maximale admissible (en heures ouvrés)


## Accompagnement  (WIP)

Un volet [accompagnement](accompagnement.md) des projets directement par les équipes de l'offre Cloud π Native permet d'utiliser l'offre dans des conditions optimale. Cet accompagnement fait partie du parcours technique d'embarquement sur l'offre Cloud π Native.

> L'équipe d'accompagnement permet aux projets respectant les [prérequis](prerequisites.md) d'embarquer sur l'offre Cloud π Native de façon sereine et optimale.

## Parcours techniques

Un parcours technique d'apprentissage permettant de valider les prérequis et d'intégrer les bonnes pratiques permet à nos clients d'appréhender l'offre Cloud π Native. 

![parcours_apprentissage](img/parcours_apprentissage.png)

  - Etape 1 : [Matrice de compétences](matrice-compétences.md) des technologies à connaitre pour utiliser l'offre Cloud π Native 
  - Etape 2 : Vérification de l'éligibilité de son application avec le modèle Cloud Native Application [prérequis](prerequisites.md) technique liés à l'offre. Les équipes Cloud π Native [accompagnent](accompagnement.md) les équipes projets sur cette étape afin d'apporter conseils et qualification des architectures et maturité technique des équipes. 
  - Etape 3 : Prise de connaissance des [bonnes pratiques](bonnes-pratiques.md) et expérimentation avec une série de tutoriels [tutoriels](tutorials.md) afin de faire ses premiers pas avec l'offre
  - Etape 4 : [Embarquement](getting-started.md) de l'application sur l'offre
  - Etape 5 : Félicitation ! Vous êtes maintenant un utilisateur de la plateforme Cloud π Native et votre application peut passer en production via les principes d'[exploitation et observabilité](exploitation.md) de vos projets.


A tout moment, vous pouvez consulter la [documentation détaillée](description-plateforme.md) de la plateforme Cloud π Native, son architecture et les services proposés

Enfin notre [FAQ](faq.md) permet de lister les questions fréquentes de nos clients.
 
## Notre roadmap (WIP)

L'offre Cloud π Native est en cours de construction. Notre [feuille de route détaillée](roadmap.md) est accessible permettant de donner de la visibilité sur les prochaines fonctionnalités. 

Voici les grandes fonctionnalités prévus dans les prochaines semaines :
 - Gestion des secrets applicatifs
 - TODO

## Contact

Pour toute information ou demande pour rejoindre la betatest, veuillez nous contacter à l'adresse suivante : <cloudpinative-relations@interieur.gouv.fr>.
Si vous faites déjà parti des beta testeurs et que vous souhaitez poser des questions ou avoir de l'accompagnement, veuillez nous contacter directement via le serveur Mattermost prévu à cet effet (si vous n'avez pas été ajouté au serveur Mattermost, veuillez contacter l'adresse mail précédente).
