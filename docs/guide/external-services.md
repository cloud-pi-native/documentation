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
 - SonarQube : Accès au service [SonarQube](/services/sonarqube) positionné sur son projet.

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

Le robot projet est un compte de service Harbor en lecture seule, créé par la console lorsque l'option « Publication du robot projet » est activée sur le projet. Ses identifiants sont écrits dans l'espace Vault du projet sous `REGISTRY/project-robot` et sont affichés aux membres du projet via le bouton « Afficher les secrets des services » du tableau de bord : clés `HOST`, `USERNAME`, `TOKEN` et `DOCKER_CONFIG`, ce dernier étant le contenu d'un fichier `config.json` Docker prêt à l'emploi. La console n'expose les identifiants que par cet affichage ; c'est au projet de les copier et de les distribuer à ses consommateurs.

Depuis la version 9.29.0, la désactivation de l'option révoque le robot à la réconciliation du projet, manuelle ou planifiée : le compte est supprimé dans Harbor et le secret `REGISTRY/project-robot` est détruit dans Vault. Le robot projet est statique, sans expiration ; seuls les robots `ro-robot` et `rw-robot` font l'objet d'une rotation à 90 jours.

Avant la version 9.29.0, la désactivation se limitait à masquer l'affichage des identifiants : le robot restait actif dans Harbor et le secret `REGISTRY/project-robot` demeurait dans l'espace Vault du projet. Un projet ayant désactivé l'option sous une version antérieure conserve donc des identifiants toujours valides ; après la mise à jour en 9.29.0, la prochaine réconciliation du projet supprime automatiquement ce robot résiduel et détruit son secret.

Les identifiants copiés avant la désactivation cessent de fonctionner dès la réconciliation, Harbor répondant 401 à tout usage du robot supprimé, et la réactivation de l'option régénère des identifiants différents. Avant toute désactivation, le projet doit donc recenser ses consommateurs du jeton et préparer leur bascule. Procédure vérifiée :

1. Relever les consommateurs du jeton : fichiers `config.json` Docker, variables `TOKEN` et `USERNAME`, scripts `docker login` dans les dépôts et pipelines du projet.
2. Choisir pour chaque consommateur l'authentification de remplacement ; si un identifiant Harbor dédié est nécessaire, le demander via l'[outil de ticket](https://support.dev.numerique-interieur.com/).
3. Désactiver « Publication du robot projet » puis déclencher la réconciliation du projet ou attendre la synchronisation planifiée.
4. Vérifier : le groupe `REGISTRY/project-robot` n'apparaît plus dans « Afficher les secrets des services » et toute requête avec l'ancien jeton reçoit une erreur 401 Harbor.
5. Redéployer les consommateurs avec leur nouvelle authentification ; en cas de réactivation ultérieure, re-copier les nouveaux identifiants, les anciens restant définitivement invalides.

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
