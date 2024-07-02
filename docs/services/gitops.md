# Gitops

## Philosophie et principes

Pour le déploiement de votre infrastructure applicatif, l'usine logcielle de l'offre Cloud π Native vous propose le service GitOps [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) en version communautaire.

Gitops est un modèle de workflow permettant provisionner son infrastructure à l'image d'un repo git assurant 
ansi la reproductibilité et le versionning. Ceci implique :
  - Toute l'infrastructure est gérée par du code, déposé sur un dépôt source GIT
  - Le dépôt source d'infrastructure GIT "pilote" les déploiements de l'infrastructure applicatif.

![gitops](/img/gitops.png)

## ArgoCD

ArgoCD assure la mise en conformité de votre infrastructure avec le dépôt git d'infrastructure qui est la source de vérité.

Lors de l'ajout d'un dépôt de type infrastructure depuis la console de plateforme Cloud π Native, un projet ArgoCD est automatiquement créé avec les informations du projet et de l'organisation. Ces dépôts d'infrastructure peuvent être au format :
  - Manifests Kubernetes
  - Kustomize
  - Helm

Un namespace est créé par projet. Ainsi, il est possible d'avoir plusieurs repos d'infrastructure pour un même projet DSO, par exemple un au format Helm et un au format Kustomize.

ArgoCD offre une console de déploiement permettant de consulter et visualiser ses déploiement de façon graphique et également d'accéder aux *events* et *logs* de chaque ressource :

![ArgoCD-console](/img/argocd-example.png)

## Déploiement et redéploiement

Suivant le principe GitOps et afin de déployer une application ou la redéployer, il est nécessaire de suivre les étapes suivantes:
 - Correction d'anomalie et modification du numéro de version (tag) sur le déploiement depuis le repo applicatif externe
 - Synchronisation des repos externes / internes
 - Re construction de l'application via le pipeline gitlab-ci sur la plateforme Cloud π Native
 - Construction de l'image Docker et la publier dans le gestionnaire d'image de la plateforme Harbor. 
 - Modification du dépôt d'infrastructure afin de mettre en cohérence le tag de l'image à déployer
 - Synchronisation du dépôt externe d'infrastructure

Il est possible d'automatiser ces différentes tâches comme suit :
  - Utiliser l'identifiant de commit court (CI_COMMIT_SHORT_SHA) du repo applicatif comme tag d'image à construire 
  - Lors de la construction sur les repos externe, déclencher une étape permettant de modifier la référence de l'image à déployer sur le repo d'infra externe (kustomize ou helm values) avec l'identifiant du commit ci-dessus.
  - Utiliser des triggers depuis le repo de code applicatif externe (github Action, gitlab-ci, etc.) pour déclencher la synchronisation des repos vers gitlab-ci de la plateforme Cloud π Native.

> Attention ! Si le tag de l'image n'est pas modifié, aucune modification du repo d'infra n'est effectué et ArgoCD n'aura pas de modification à appliquer et les pods ne seront pas redéployés.
