# Services externes

Lorsqu'un projet est selectionné, il est possible d'accéder à l'ensemble des services CPiN depuis l'onglet ```Services externes``` du menu Projet :

![services externes](/img/guide/services/menu.png)

Une fois le menu ```Services externes``` selectionné, la page affiche 2 grandes parties :
 - Services externes
 - Configuration des plugins

## Services externes

Cette partie représente des liens d'accès aux différents services CPiN positionnés sur projet :

 - ArgoCD : Accès au service [ArgoCD](/services/gitops#argocd) positionné sur son projet. À noter qu'il existe plusieurs entrées ArgoCD :
   - ArgoCD DSO : à utiliser en priorité
   - ArgoCD zone xxx : correspondant à l'instance ArgoCD de la zone sur lequel le projet est déployé (feature en cours)
 - Gitlab : Accès au [Gitlab](/services/gitlab) positionné sur le groupe de son projet
 - Grafana : Accès à [Grafana](/guide/metrics) pour la consultation des métriques et logs de son projet. À noter qu'il existe 2 entrées grafana :
   - Hors production : pour les métriques des environnements **non taggués production**
   - Production : pour les métriques des environnements **taggués production**
 - Harbor : Accès au service [Harbor](/services/artefacts#depots-d-images-de-conteneurs-harbor) positionné sur son projet.
 - sonarqube : Accès au service [SonarQube](/services/sonarqube) positionné sur son projet.

![liens services externes](/img/guide/services/services-externes.png)

## Configuration des plugins

Cette partie permet d'afficher et de modifier la configuration des différents plugins pour son projet.

### ArgoCD

Il est possible d'ajouter d'autres sources que le gitlab CPiN. À noter que cette configuration n'est pas modifiable par le projet mais uniquement par les administrateurs après validation du besoin. En effet, cette pratique doit rester exceptionnelle.

![configuration-argocd](/img/guide/services/configuration-argocd.png)

### Harbor

Il est possible de configurer Harbor afin de créer un compte de type robot permettant d'accéder en lecture et/ou écriture aux images du dépôt Harbor du projet. De plus, il est possible d'ajouter un quota de taille maximale pour le projet sur Harbor.

À noter que cette configuration est en lecture seule pour les utilisateurs et seuls les administrateurs CPiN peuvent la modifier. En cas de besoin de modification de cette configuration, le projet doit faire un ticket sur l'outil de ticketing [outil de ticket](https://support.dev.numerique-interieur.com/)

![configuration-argocd](/img/guide/services/configuration-harbor.png)

### Nexus

Des repos Nexus peuvent être créés pour le projet par la console CPiN, par exemple pour stocker une librairie commune entre plusieurs composants applicatifs.
Deux types de repos peuvent ainsi être créés :
 - Repos de type NPM
 - Repos de type Maven : Pour Maven, trois repos sont créés :
   - Un repo de type SNAPSHOT
   - Un repo de type RELEASE
   - Un repo de type groupe pointant sur les deux repos SNAPSHOT et RELEASE du projet.

La configuration du plugin permet au projet d'activer ou non la création du ou des repos ainsi que la politique d'écriture associée (la possibilité de redéployer un articfact avec la même version)

![configuration-argocd](/img/guide/services/configuration-nexus.png)
