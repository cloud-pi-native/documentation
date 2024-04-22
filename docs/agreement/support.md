# Processus accompagnement Service Team

## Introduction

La service team est l'équipe qui vous accompagne à embarquer sur l'offre Cloud π native. Cet accompagnement a pour objectif d'__aider les projets, les faire monter en compétences mais de ne pas faire à leur place__. En effet, une fois que les projets sont déployés sur l'offre Cloud π native, l'exploitation, le MCO/MCS reste de la responsabilité du projet qui doit comprendre l'esprit de la plateforme, les technologies sous jacentes et les paradigmes de déploiement. L'offre Cloud π native favorise le modéle DevSecOps ** ou Build it, You Run it**

L'accompagnement technique se fera sur 2 plateformes :

- Plateforme OVH; plateforme non lié aux réseaux interministères et a pour objectif de fournir aux projets un accès plus rapide à la console et aux services Cloud π native. Ainsi les projets peuvent anticiper en effectuat leurs premiers tests.
  
- Cluster Cloud π native sur les infrastructures du ministère de l'intérieur

## Prérequis organisationnels

Avant d'utiliser l'offre Cloud π native, il est nécessaire : 
- De suivre le processus d'accompagnement [haut niveau](https://github.com/cloud-pi-native/embarquement-autoformation)

## Prérequis techniques

En plus de ces prérequis, les éléments suivants sont à fournir par le projet :
- Vérifier que les [prérequis techniques](/platform/compatibility) ainsi que [les bonnes pratiques](/guide/best-practices) sont bien en place
- Vérifier que la [matrice de compétences](/platform/skills-matrix) est connue
- Exigences du [Cadre de Cohérence Technique](https://github.com/cloud-pi-native/cct-cloud-native)
- Vérifier les contraintes de nom DNS : les applications doivent-elles obligatoirement être en *.gouv.fr ou *.interieur.gouv.fr ?
- Dossier d'architecture ou à minima schéma d'architecture technique : nombre de composants, technologies, maturité sur les technologies DSO, notamment docker / kubernetes / openshift / déploiement ArgoCD (gitops), backend de stockage (postgres, S3, etc.)
- Elements de volumétrie en termes de données et d'utilisateurs
- Si une reprise de données est à prévoir et la volumétrie associée
- Processus de sauvegarde et restauration demandé et/ou prévus par l'application
- Procédure de création de la base de données (portée par l'application / manuel)
- Liste des composants externe au projet et appelés par l'application pour évaluer les ouvertures de flux: 
  - Internes MI / RIE
  - Sur Internet
- Exposition de l'application (Internet/Intranet/RIE/DR/NP)
- Nombre d'environnements prévus
- Nom de domaine et certificats à fournir par environnement
- Estimation des ressources nécessaires CPU/RAM
- Calendrier du projet et échéances importantes et état d'avancement du projet (déjà en production, nouvelle application, etc.)

## Accompagnement sur OVH

- Création de compte pour l'accès à la console et aux services
- Accostage entre la chaine primaire et la chaine secondaire (github action)
- Contruction des images Docker
- Prise en main de la console :
  - Intégration des projets applicatifs et construction de la chaine de construction sur DSO (gitlab-ci-dso)
  - Intégration des repos d'infra et intégation sur ArgoCD
  - Accès aux éléments de monitoring 

## Accompagnement sur Cloud π

Identique à l'accompagnement sur OVH plus :
- Ouverture de flux
- Adaptation des triggers de déploiement sur l'environnement Cloud π native

## Outils de communication

Pour contacter la service Team, plusieurs moyens sont mis en place :
- Un outil de ticketing (moyen privilégié car permet de tracer les demandes)
- Un outil de discussion en ligne: Mattermost

## Ticketing

Pour une meilleure traçabilité des échanges, nous avons mis en place un outil de ticketing permettant aux projets de faire des demandes ou de remonter des incidents à la Service Team.

- Voici le lien pour s'y rendre: <https://support.dev.numerique-interieur.com>.

## Mattermost

Pour une meilleure fluidité des échanges, nous avons également mis en place un tchat dont voici l'[URL](https://mattermost.fabrique-numerique.fr/)

## Le processus d'embarquement

Le processus d'embarquement classique d'un projet est présenté ci-dessous :

![processus embarquement](/img/onboarding-process.png)

> A chaque étape, la vérification des prérequis est un point d'étape *obligatoire* permettant de valider la compatibilité du projet avec l'offre DSO.
