# Processus accompagnement Service Team

## Introduction

La service team accompagne les projets à embarquer sur l'offre Cloud π native. Cet accompagnement a pour philosophie d'aider les projets mais de ne pas faire à leur place. En effet, une fois que les projets sont déployés sur l'offre Cloud π native, l'exploitation, le MCO/MCS reste de la responsabilité du projet qui doit comprendre l'esprit de la plateforme, les technologies sous jacentes et les paradigmes de déploiement.

L'accompagnement se fait sur 2 environnements :
 * Clusters hors ministère de l'intérieur, hébergés sur OVH permettant de tester la solution
 * Cluster Cloud π native sur les infrastructures du ministère de l'intérieur

## Prérequis techniques

Avant d'utiliser l'offre Cloud π native, il est nécessaire : 
 * De suivre le processus d'accompagnement [haut niveau](https://github.com/dnum-mi/dso-formation)
 * De vérifier les [prerequis techniques](./prerequisites-tech.md)

En plus de ces prérequis, les éléments suivants sont à fournir par le projet :
 * Dossier d'architecture ou à minima schéma d'architecture technique : nombre de composants, technologies, maturité sur les technologies DSO, notamment docker / kubernetes / openshift / déploiement ArgoCD (gitops), backend de stockage (postgres, S3, etc.)
 * Elements de volumétrie en termes de données et d'utilisateurs
 * Si une reprise de données est à prévoir et la volumétrie associée
 * Processus de sauvegarde et restauration demandé et/ou prévus par l'application
 * Procédure de création de la base de données (portée par l'application / manuel)
 * Liste des composants externe au projet et appelés par l'application pour évaluer les ouvertures de flux: 
   * Internes MI 
   * Sur Internet
 * Exposition de l'application (Internet/Intranet/RIE/DR/NP)
 * Nom de domaine et certificats à fournir
 * Calendrier du projet et échéances importantes et état d'avancement du projet (déjà en production, nouvelle application, etc.)


## Accompagnement sur OVH

 * Accostage entre la chaine primaire et la chaine secondaire (github action)
 * Contruction des images Docker
 * Prise en main de la console :
   * Intégration des projets applicatifs et construction de la chaine de construction sur DSO (gitlab-ci-dso)
   * Intégration des repos d'infra et intégation sur ArgoCD
   * Accès aux éléments de monitoring 



## Accompagnement sur Cloud π native

Identique à l'accompagnement sur OVH plus :
 * Ouverture de flux
 * Adaptation des triggers de déploiement sur l'environnement Cloud π native
 * 

