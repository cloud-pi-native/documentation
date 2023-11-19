# Convention de services

La Direction de la Transformation Numérique du Ministère de l'Intérieur et des Outre-mer propose une offre de services autours de deux instances de la plateforme *(OVH SecNumCloud / Cloud π)* à destination des *administrations* ou des *entreprises de services numériques* travaillant pour leur compte. 

> __:warning: Attention, les seuls bénéficiaires de cette offre managée sont les administrations ou leurs ESN partenaires__.

Vous pouvez consulter [la documentation détaillée](https://github.com/cloud-pi-native/embarquement-autoformation) du processus d'embarquement sur cette offre.

## Introduction

Avec l’adoption de la doctrine « Cloud au centre », le Gouvernement Français fait du Cloud un prérequis pour tout nouveau projet numérique au sein de l’État ou refonte substantielle de l’architecture applicative existante.

**Objectif** : accélérer la transformation numérique au bénéfice des usagers et dans le strict respect de la cybersécurité et de la protection des données des citoyens et des entreprises.

L'offre *interministérielle* Cloud π Native, offre les services d'une plateforme *DevSecOps* complète afin de suivre le cycle de vie complet de son projet.

Vous trouvez le détail de cette offre [ici](https://cloud-pi-native.fr/platform/introduction.html)

Le cadre interministériel d'utilisaton de l'offre est disponible à l'emplacement suivant : <https://github.com/cloud-pi-native/cct-cloud-native>

Dés que les [prérequis](https://cloud-pi-native.fr/agreement/support.html) sont présents, la souscription à l'offre Cloud π Native est possible en suivant les étapes suivantes:

  - Effectuer une demande d'accès au service via le formulaire suivant : <https://www.demarches-simplifiees.fr/commencer/cloud-pi-native>. 
  - Après acceptation du dossier, l'enrollement du projet est effectuté dans la console Cloud pi Native, et l'équipe projet est en charge d'instancier les ressources nécessaires (gitlab, vault, registry, etc...) dans la chaine secondaire et de configurer son projet  ;
  - Recopie des repository de code et de déploiement;
  - Mise en place du pipeline "DevSecOps" au sein de la chaine secondaire. L'application reste maître de son pipeline et de sa surveillance;
  - Mise en place du/des namespaces dans le cluster cible ainsi des secrets nécessaires au fonctionnement et du provisionning gitops de l'application (argoCD);
  - Provisionning des ressources d'infrastructure additionnelles ( certificats, ouverture de fluxs, bucket S3, etc...). Cette étape nécessite l'intervention des équipes d'infrastructure Miom ( ou de l'hébergeur choisis) & du ministère cible. (automatisation progressive en cours)
  - Construction des artefacts sur l'offre Cloud π Native;
  - Analyse de qualité et de la sécurité;
  - Construction des images de conteneurs;
  - Provisionning de l'application dans le cluster (l'application est tirée via GitOps).

Enfin, le déploiement s'effectue sur différentes cibles d'hébergement possibles :

 - Un socle kubernetes/Openshift jusqu'au niveau DR sur les environnements du ministère;
 - Un cluster kubernetes directement gérés par l'équipe client par exemple chez un Cloud Service Provider.

**Vision d'ensemble de l'offre :**

![vision](/img/global-vision.png)

## Les services proposés

L'offre Cloud π Native, portée par le Ministère de l'Intérieur et des Outre-Mer est une offre PaaS basée sur [Cloud π](https://www.numerique.gouv.fr/services/cloud/cloud-interne/) sur les infrastructures du ministère de l'intérieur offrant des fonctionnalités DevSecOps à savoir :

  - [Gestionnaire de sources](/services/gitlab) applicatives
  - Outil de gestion de la [qualité](/services/sonarqube) statique du code (SAST) et dynamique (DAST)
  - Orchestrateur de [construction](/services/gitlab) d'artefacts (Intégration continue)
  - [Entrepot d'artefacts](/services/artefacts) et d'images Docker
  - Gestionnaire de [secrets](/services/vault) des chaines IC/DC
  - Gestion des [secrets applicatifs](/guide/secrets-management)
  - Outil de [déploiement automatisé](/services/gitops) des images Docker sur les infrastructures du ministère ou à l'extérieur du ministère en suivant les principes GitOps (Déploiement continue)
  - Hébergement des [environnements](/guide/environments-management) applicatifs de l'intégration à la production
  - Mise à disposition d'outil d'[observabilité et exploitabilité](/agreement/exploitation) des applications déployées sur l'offre : accès aux logs, métriques techniques et applicatives, procédures standard d'exploitation

L'architecture générale de l'offre Cloud π Native est la suivante :

![architecture](/img/architecture.png)

## Accompagnement

Un volet [accompagnement](/agreement/support) intial des projets directement par les équipes de l'offre Cloud π Native permet d'utiliser l'offre dans des conditions optimales. Cet accompagnement fait partie du parcours technique d'embarquement sur l'offre Cloud π Native.

Elle s'articule dans une offre à 3 niveaux :
 - Démarche autonome ( kit d'autoformation, tutoriels, etc... )
 - Démarche d'accompagnement à l'initialisation ( "Service Team" )
- Formation et certification d'acteurs externes ( offre en cours d'élaboration )

Les ressources d'accompagnement étant limitées, l'embarquement est conditionné à des prérequis techniques et ou organisationnels [prérequis](/platform/compatibility) pour embarquer sur l'offre Cloud π Native de façon sereine et optimale.

Typiquement l'équipe doit être dans un parcours de montée en compétence à l'agilité et à la conteneurisation/kubernetes.

## Embarquement technique

Un parcours technique d'apprentissage permettant de valider les prérequis et d'intégrer les bonnes pratiques permet à nos clients d'appréhender l'offre Cloud π Native. 

![parcours_apprentissage](/img/learning-process.png)

  - Etape 1 : [Matrice de compétences](/platform/skills-matrix) des technologies à connaitre pour utiliser l'offre Cloud π Native 
  - Etape 2 : Vérification de l'éligibilité de son application avec le modèle Cloud Native Application [prérequis](/platform/compatibility) technique liés à l'offre. Les équipes Cloud π Native [accompagnent](/agreement/support) les équipes projets sur cette étape afin d'apporter conseils et qualification des architectures et maturité technique des équipes. 
  - Etape 3 : Prise de connaissance des [bonnes pratiques](/guide/best-practices) et expérimentation avec une série de tutoriels [tutoriels](/guide/tutorials) afin de faire ses premiers pas avec l'offre
  - Etape 4 : [Embarquement](/guide/get-started) de l'application sur l'offre
  - Etape 5 : Félicitation ! Vous êtes maintenant un utilisateur de la plateforme Cloud π Native et votre application peut passer en production via les principes d'[exploitation et observabilité](/agreement/exploitation) de vos projets.


A tout moment, vous pouvez consulter la [documentation détaillée](/platform/introduction) de la plateforme Cloud π Native, son architecture et les services proposés

Enfin notre [FAQ](/agreement/faq) permet de lister les questions fréquentes de nos clients, et des exemples pour réaliser des bouchons (S3, SMTP, ...)

## Contact

Pour toute information ou demande pour rejoindre la betatest, veuillez nous contacter à l'adresse suivante : <cloudpinative-relations@interieur.gouv.fr>.
Si vous faites déjà parti des beta testeurs et que vous souhaitez poser des questions ou avoir de l'accompagnement, veuillez nous contacter directement via le serveur Mattermost prévu à cet effet (si vous n'avez pas été ajouté au serveur Mattermost, veuillez contacter l'adresse mail précédente).
