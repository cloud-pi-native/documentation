# Introduction

Le PaaS (Platform-as-a-Service) est une forme de cloud computing dans laquelle la plateforme logicielle est fournie par un tiers. D'abord destiné aux développeurs et aux programmeurs, le PaaS permet à l'utilisateur de développer, d'exécuter et de gérer ses propres applications, sans avoir à créer ni entretenir l'infrastructure ou la plateforme généralement associée au processus.

Les plateformes PaaS peuvent s'exécuter dans le cloud ou sur site. En ce qui concerne les offres gérées, le fournisseur héberge le matériel et les logiciels sur sa propre infrastructure et met à disposition de l'utilisateur une plateforme, sous la forme d'une solution intégrée, d'une pile de solutions ou d'un service.

## Description de la plateforme

Cloud π Native est une plateforme de services à destination des équipes DevOps, une [console](https://github.com/cloud-pi-native/console) pilote la création des ressources dans ces différents services en utilisant les notions de projets, membres, environnements etc...

La console a été développée avec une architecture de plugins permettant l'ajout de services pilotés par cette dernière. Chaque plugin s'enregistre sur des hooks liés au cycle de vie du projet (création d'un projet, d'un environnement ou d'un dépôt, ajout d'un membre, etc...) pour que le manager de plugins puisse lui envoyer les informations de l'action utilisateur.

## Architecture fonctionnelle de la plateforme

![archi](/img/architecture.png)

## Services core proposés par la plateforme

Liste des services de la plateforme :

| Service        | Description                                | Obligatoire |
| -------------- | ------------------------------------------ | ----------- |
| Argocd         | Outil de déploiement automatique (GitOps)  | Oui         |
| Harbor / Trivy | Hébergement / analyse d'image de conteneur | Oui         |
| Gitlab         | Hébergement de code et pipeline CI/CD      | Oui         |
| Kubernetes     | Création des ressources kubernetes         | Oui         |
| Nexus          | Hébergement d'artefacts                    | Oui [1]     |
| Sonarqube      | Analyse de qualité de code                 | Oui         |
| Vault          | Hébergement de secrets                     | Oui         |

[1] : *Instanciation au niveau du projet obligatoire mais utilisation selon le besoin.*

## Philosophie

La philosophie ici est de laisser les développeurs travailler sur leurs dépôts de code source habituels *(dépôts externes)* en effectuant des synchronisations du code source vers un Gitlab hébergé par la plateforme *(dépôts internes)*.
Les synchronisations sont déclenchées par des appels API effectués dans les CI/CD côté développeurs (dépôts externes).
Ces appels API permettent de déclencher auprès de CPN une demande de `pull` du dépôt qui entrainera le déclenchement d'une autre chaine de CI/CD sur le Gitlab de la plateforme. Cette dernière sera en charge de :

- Lancer les jeux de tests applicatif (unitaires, de bout en bout, ...).
- Effectuer une analyse de la qualité du code source à l'aide du service [Sonarqube](https://www.sonarqube.org/).
- Construire les images de conteneur de l'application dans la CI/CD du service [Gitlab](https://about.gitlab.com/).
- Scanner les images et le code source à l'aide de [Trivy](https://aquasecurity.github.io/trivy).
- Stocker ces images dans un [Harbor](https://goharbor.io/) hébergé par la plateforme.

Une fois l'application construite et les images de cette dernière stockées dans la registry de la plateforme, le déploiement sur un cluster kubernetes pourra être effectué selon le modèle gitops à l'aide de [ArgoCD](https://argo-cd.readthedocs.io/en/stable/).
