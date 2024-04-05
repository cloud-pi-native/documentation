# Gestion des environnements

Depuis la console il est possible de créer des environnements applicatifs pour son projet.

Un environnement correspond à un namespace sur un cluster pour son projet applicatif.

La console crée automatiquement :
 - un namespace applicatif par environnement sur le cluster correspondant.
 - les quotas correspondant à l'environnement sur le namespace
 - une application ArgoCD par environnement et par repo de code infrastructure. 

 ## Création d'un environnement

 Depuis la console aller dans le menu ![environnement](/img/environnement/menu.png)

 Donner :
  - Un nom à l'environnement, par exemple integration
  - Un type (dev / staging / integration / prod) le type d'environnement donne accès à des quotas différents
  ![type](/img/environnement/type-env.png)
  - Un dimensionnement (quota)
  ![quota](/img/environnement/quota-env.png)
  - Le cluster de destination
  ![quota](/img/environnement/cluster-env.png)

Cliquez sur le bouton **Ajouter l'environnement** pour créer l'environnement