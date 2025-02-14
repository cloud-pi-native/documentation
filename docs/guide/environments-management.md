# Gestion des environnements

Depuis la console il est possible de créer des environnements applicatifs pour son projet.

Un environnement correspond à un namespace sur un cluster pour son projet applicatif.

La console crée automatiquement :
 - un namespace applicatif par environnement sur le cluster correspondant.
 - le pullsecret associé au projet.
 - les quotas correspondant à l'environnement sur le namespace
 - une application ArgoCD par environnement et par dépôt de code infrastructure.

 ## Création d'un environnement

 Depuis la console aller dans l'onglet ressources ![ressources](/img/environnement/menu.png)

Cliquez sur le bouton **+ Ajouter un nouvel environnement** puis compléter :
  - Un nom à l'environnement, par exemple integration
  - Un type environnement (dev / staging / integration / prod), celui-ci donne accès à des quotas différents
  ![type](/img/environnement/type-env.png)
  - Un dimensionnement (quota)
  ![quota](/img/environnement/quota-env.png)
  - Le cluster de destination
  ![quota](/img/environnement/cluster-env.png)

