# L'offre Cloud Pi Native

La Direction de la Transformation Numérique du Ministère de l'Intérieur et des Outre-mer propose une offre de services autours de deux instances de la plateforme *(OVH SecNumCloud / Cloud π)* à destination des *administrations* ou des *entreprises de services numériques* travaillant pour leur compte.
Cette offre de services est une implémentation du produit *Hexaforge* pour le Ministère de l'intérieur ainsi qu'un accompagment dédié aux spécificités des infrastructures ministérielles.

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
  - Après acceptation du dossier, l'équipe [Accompagnement](https://cloud-pi-native.fr/agreement/introduction.html#accompagnement) prendera contact avec vous pour la phase d'accpagnement.

Enfin, le déploiement s'effectue sur différentes cibles d'hébergement possibles :

**Vision d'ensemble de l'offre de services:**

![vision](/img/global-vision.png)

Comme mentionné dans le schèma, l'offre de services comprend si vous le souhaitez l'infrastructure hébergeant vos applicatifs. 
Cette infrastructure peut être:
 - Un socle Kubernetes/Openshift mutualisé dans la zone "Non Protégé" (NP) du Ministère de l'Intérieur. 
 - Un socle Kubernetes/Openshift dédié dans la zone "Non Protégé" (NP) ou la zone "Diffusion Restreinte (DR) du ministère de l'intérieur. 
 - Un socle Kubernetes directement gérés par l'équipe projet.

Le choix de la cible est au cas par cas et fait lors des premières phases d'échange. 

## Accompagnement

Comme mentionné plus haut, à la souscription de l'offre Cloud π Native, une équipe accompagnement sera le vis-à-vis du projet et assurera: 
- Un [accompagnement](/agreement/support) rapproché aux projets pour que l'utilisation de l'offre se réalise dans des conditions optimales.
- Le parcours technique d'embarquement sur l'offre Cloud π Native qui s'articule sur trois niveaux: 
   * Démarche autonome ( kit d'autoformation, tutoriels, etc... )
   * Démarche d'accompagnement à l'initialisation ( "Service Team" )
   * Formation et certification d'acteurs externes ( offre en cours d'élaboration )

Les ressources d'accompagnement étant limitées, l'embarquement est conditionné à des prérequis techniques et ou organisationnels [prérequis](/platform/compatibility) pour embarquer sur l'offre Cloud π Native de façon sereine et optimale.

Typiquement l'équipe doit être dans un parcours de montée en compétence à l'agilité et à la conteneurisation/Kubernetes.

## Embarquement technique

Un parcours technique d'apprentissage permettant de valider les prérequis et d'intégrer les bonnes pratiques permet à nos clients d'appréhender l'offre Cloud π Native. 

![parcours_apprentissage](/img/learning-process.png)

  - Etape 1 : [Matrice de compétences](/platform/skills-matrix) des technologies à connaitre pour utiliser l'offre Cloud π Native 
  - Etape 2 : Vérification de l'éligibilité de son application avec le modèle Cloud Native Application [prérequis](/platform/compatibility) technique liés à l'offre. Les équipes Cloud π Native [accompagnent](/agreement/support) les équipes projets sur cette étape afin d'apporter conseils et qualification des architectures et maturité technique des équipes. 
  - Etape 3 : Prise de connaissance des [bonnes pratiques](/guide/best-practices) et expérimentation avec une série de tutoriels [tutoriels](/guide/tutorials) afin de faire ses premiers pas avec l'offre
  - Etape 4 : [Embarquement](/guide/get-started) de l'application sur l'offre
  - Etape 5 : Félicitation ! Vous êtes maintenant un utilisateur de la plateforme Cloud π Native et votre application peut passer en production via les principes d'[exploitation et observabilité](/agreement/exploitation) de vos projets.


À tout moment, vous pouvez consulter la [documentation détaillée](/platform/introduction) de la plateforme Cloud π Native, son architecture et les services proposés.

Enfin notre [FAQ](/agreement/faq) permet de lister les questions fréquentes de nos clients, et des exemples pour réaliser des bouchons (S3, SMTP, ...).

## Contact

Pour toute information ou demande, veuillez nous contacter à l'adresse suivante : <cloudpinative-relations@interieur.gouv.fr>. Nous vous recontacterons au plus vite dès la réception du mail.  
Si vous faites déjà parti des beta testeurs et que vous souhaitez poser des questions ou avoir de l'accompagnement, veuillez nous contacter directement via le serveur Mattermost prévu à cet effet (si vous n'avez pas été ajouté au serveur Mattermost, veuillez contacter l'adresse mail précédente).
