# Gestion des environnements

Depuis la console il est possible de créer des environnements applicatifs pour son projet.

Un environnement correspond à un namespace sur un cluster pour son projet applicatif.

pour chaque environnement, la console crée automatiquement :
 - un namespace applicatif sur le cluster correspondant.
 - le pullsecret associé au projet correspondant au credentials d'accès au repository Harbor de son projet.
 - les quotas correspondant à l'environnement sur le namespace
 - une application ArgoCD pour chaque dépôt de code infrastructure.

## Gestion des quotas sur un projet

Depuis la console, aller dans l'onglet *Configuration* d'un projet afin de configurer les quotas du projet. Ces quotas doivent correspondre à la demande d'hébergement validée par le ministère de l'intérieur.

À l'image de la demande d'hébergement, les quotas sont répartis en **ressources hors production** et **ressources production**. Sur chacun, il est nécessaire d'ajouter les limites en terme de CPU, RAM et GPU.

![type](/img/environnement/quotas-projet.png)

Afin d'assurer la rétro compatibilité avec les anciens projets, il est également possible de supprimer les limites mais cette fonction sera, à terme, supprimée.

 ## Création d'un environnement et quotas associés

Depuis la console aller dans l'onglet ressources ![ressources](/img/environnement/menu.png)

Cliquez sur le bouton **+ Ajouter un nouvel environnement** puis compléter :
  - Un nom à l'environnement, par exemple integration
  - Un type d'environnement (dev / staging / integration / prod), celui-ci donne accès à des clusters différents et permet d'associer les ressources de type **production** ou **hors production**
  ![type](/img/environnement/type-env.png)
  - Le cluster de destination
  ![cluster](/img/environnement/cluster-env.png)
  - Les quotas de l'environnement pour la mémoire, CPU et GPU. Si un projet n'a pas besoin de GPU mettre 0 dans les GPU. 
  ![quota](/img/environnement/quotas-new.png)

> Les quotas associés à un environnement correspondent à la somme des valeurs définies dans "resources.limits" de l'ensemble des pods déployés sur le namespace de son projet.

Une fois l'environnement créé, il est possible de voir la consommation total des environnements par rapport aux quotas du projet depuis l'onglet resources du projet.
  ![quota](/img/environnement/environnement-quota.png)

## Synchronisation ArgoCD

Une Application ArgoCD est créé pour chaque Environnement déclaré dans la Console (et pour chaque Dépôt de type *infra*, voir [Déploiement](/guide/deployment-with-argo)).
Par défaut, ArgoCD synchronise automatiquement cette Application et les modifications pilotées par la Console. Toutefois si des spécificités ou des tests temporaires sont nécessaires, il est possible de désactiver cette synchronisation au niveau du paramétrage de l'Environnement.

![Désactivation de la synchronisation automatique](/img/tuto/env-autosync.png)
