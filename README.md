# Cloud π Native

:warning: __*La plateforme est en cours de construction et des évolutions fréquentes sont à prévoir.*__ :warning:

## L'offre

### Présentation

Avec l’adoption de la doctrine « Cloud au centre », le Gouvernement Français fait du Cloud un prérequis pour tout nouveau projet numérique au sein de l’État ou refonte substantielle de l’architecture applicative existante.

>Objectif : accélérer la transformation numérique au bénéfice des usagers et dans le strict respect de la cybersécurité et de la protection des données des citoyens et des entreprises.

L'offre Cloud π Native, offre les services d'une plateforme DevSecOps complète afin de suivre le cycle de vie complet de son projet.

### Services proposés

L'offre Cloud π Native, portée par le Ministère de l'Intérieur et des Outre-Mer est une offre PaaS basée sur [Cloud π](https://www.numerique.gouv.fr/services/cloud/cloud-interne/) sur les infrastructures du ministère de l'intérieur offrant des fonctionnalités DevSecOps à savoir :

  - [Gestionnaire de sources](produits/gitlab.md) applicatives
  - Outil de gestion de la [qualité](produits/sonarqube.md) statique du code (SAST) et dynamique (DAST)
  - Orchestrateur de [construction](produits/gitlab.md) d'artefacts
  - [Entrepot d'artefacts](produits/artefacts.md) et d'images Docker
  - Gestionnaire de [secrets](produits/vault.md) des chaines IC/DC
  - [Déploiement automatisée](produits/gitops.md) des images Docker sur les infrastructures du ministère ou à l'extérieur du ministère en suivant les principes GitOps
  - [Observabilité et exploitation](exploitation.md) applications déployées : accès aux logs, métriques techniques et applicatives, procédures standard d'exploitation

### SLA de l'offre

TODO

## Accompagnement 

Un volet [accompagnement](accompagnement.md) des projets directement par les équipes de l'offre Cloud π Native permet d'utiliser l'offre dans des conditions optimale. Cet accompagnement fait partie du parcours technique d'embarquement sur l'offre Cloud π Native. 

## Parcours technique

Un parcours technique d'apprentissage permettant de valider les prérequis et d'intégrer les bonnes pratiques permet à nos clients d'appréhender l'offre Cloud π Native. 

![parcours_apprentissage](img/parcours_apprentissage.png)

  - Etape 1 : Vérification des [prérequis](prerequisites.md) et [bonnes pratiques](bonnes-pratiques.md) sur Docker, Kubernetes, Openshift et les bonnes pratiques de l'offre
  - Etape 2 : Vérification de la compatibilité de son application avec le modèle Cloud Native Application et adaptations éventuelles. Les équipes Cloud π Native [accompagnent](accompagnement.md) les équipes projets sur cette étape afin d'apporter conseils et qualification des architectures et maturité technique des équipes. 
  - Etape 3 : Prise de connaissance via une série de tutoriels [tutoriels](tutorials.md) afin de faire ses premiers pas avec l'offre
  - Etape 4 : [Embarquement](getting-started.md) de l'application sur l'offre
  - Etape 5 : Félicitation ! Vous êtes maintenant un utilisateur de la plateforme Cloud π Native et votre application peut passer en production via les principes d'[exploitation](exploitation.md) de l'offre.


A tout moment, vous pouvez consulter la [documentation détaillée](description-plateforme.md) de la plateforme Cloud π Native, son architecture et les services proposés

Enfin notre [FAQ](faq.md) permet de lister les questions fréquentes de nos clients.
 
## Notre roadmap

L'offre Cloud π Native est en cours de construction. Notre [feuille de route](roadmap.md) est accessible permettant de donner de la visibilité sur les prochaines fonctionnalités. 

## Contact

Pour toute information ou demande pour rejoindre la betatest, veuillez nous contacter à l'adresse suivante : <cloudpinative-relations@interieur.gouv.fr>.
Si vous faites déjà parti des beta testeurs et que vous souhaitez poser des questions ou avoir de l'accompagnement, veuillez nous contacter directement via le serveur Mattermost prévu à cet effet (si vous n'avez pas été ajouté au serveur Mattermost, veuillez contacter l'adresse mail précédente).
