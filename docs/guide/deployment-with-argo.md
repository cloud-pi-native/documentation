# Déploiement de votre application

Lors de la configuration du **dépôt d'infrastructure**, depuis la console, il est possible de choisir quelques spécificités et notamment :

- **Nom de la révision** : correspond à la branche (ou tag) du dépôt d'infra à déployer, par défaut la cible sera HEAD.
- **Chemin du répertoire** : correspond au chemin vers vos fichiers de déploiement de type manifests, kustomize ou helm. La valeur par défaut est `.`, soit la racine du dépôt.
- **Fichiers values** : une liste des fichiers values à utiliser (dans le cas d'un Helm Chart). Si le pattern `<env>` est spécifié dans le chemin ou le nom du fichier, celui-ci sera remplacé par le **nom de l'environnement** lors du déploiement.

![Options de déploiement](/img/tuto/options-repo-infra.png)

> Attention, sur les versions précédentes de la console CPiN, ces modifications s'effectuaient depuis ArgoCD dans le menu details de l'application. Il est maintenant *obligatoire* de faire ces modifications depuis la console. En effet, toute modification depuis l'interface ArgoCD sur ces éléments ne sera pas prise en compte.

## Visualisation dans ArgoCD

Le déploiement se fait automatiquement par ArgoCD. Une fois qu'un dépôt d'infrastructure est synchronisé, il convient de se rendre sur le service ArgoCD depuis la liste des services.
Il est possible de forcer la synchronisation avec le dépôt sur gitlab Cloud π Native en cliquant sur les boutons :

- *REFRESH* pour forcer la synchronisation depuis le dépôt gitlab de la plateforme Cloud π Native
- *SYNC* pour forcer le rafraichissement entre l'état défini par git et l'état réel des objets créés par ArgoCD.

![ArgoCD-menus](/img/tuto/4argocd-menus-bouton.png)

Note : Si vous avez désactivé la synchronisation automatique, il faudra obligatoirement passer par cette synchronisation manuelle *SYNC*. Voir [Gestion des environnements](/guide/environments-management#synchronisation-argocd).

Une fois que le déploiement est correctement effectué le status de l'application ArgoCD passe à `Healthy` par exemple :

![ArgoCD-menus](/img/tuto/4argocd-menus.png)

## Application ArgoCD depuis la version v9.11.5

Depuis la version 9.11.5 de la console CPiN, un changement majeur est apporté sur la gestion des applications ArgoCD.

Plusieurs applications ArgoCD sont créées en plus des applications ArgoCD associés aux repos d'infra:

 - [prod|hprod]-[nom-prj-console]-observability : Cette application correspond au déploiement de l'instance Grafana et des dashboard as code (voir le tuto sur l'observabilité). 2 applications de ce type peuvent exister : une pour la production (si au moins un environnement de type production existe) et une pour le hors production. 
 - [nom-prj-console]-[env]-[id]-env : Cette application ArgoCD correspond aux éléments d'infrastructure déployés au sein de son namespace : registry pull secret pour la récupération des images sur Harbor par exemple. Une application de ce type est créé par environnement de son projet CPiN. (aucune modification n'est à faire sur cette application)
 - [nom-prj-console]-[nom-cluster]-[env]-root : App of apps permettant de piloter l'ensemble des applis de son projet. Une application de ce type est créé par environnement de son projet CPiN. (aucune modification n'est à faire sur cette application)
 - [nom-prj-console]-[env]-[id]-[nom-repo-infra]-[id] : Application ArgoCD associé au repo de code d'infra déclaré dans la console, c'est l'application correspondant à un déploiement.

 où :
  - nom-prj-console : correspond au nom du projet dans la console CPiN
  - env : correspond au nom de l'environnement déclaré dans la console
  - nom-cluster : correspond au nom du cluster applicatif
  - nom-repo-infra : correspond au nom du repo d'infra déclaré dans la console CPiN
  - id : correspond à un identifiant technique sur 4 caractères.

Ainsi pour le projet `stform`, avec un environnement `demo` de type hors prod (par exemple type dev), un repo d'infra nommé `infra` dans la console et déployé sur l'environnement de formation dont le cluster se nomme `formation-app` les projets suivants seront présents dans ArgoCD :
 - hprod-stform-observability : Car seul un environnement de type hors prod est déployé  
 - stform-demo-3c58-env : correspond au déploiement du ns des quotas et du registry pull secret
 - stform-formation-app-demo-root : Meta application qui controle les autres.
 - stform-demo-3c58-infra-3843 : Application correspondant au repo de code

## Migration des projets pour utiliser les nouvelles applications ArgoCD (post version 9.11.5)

A partir de la version 9.11.5 de la console, il n'est plus possible de faire de modifications directement sur les applications ArgoCD. Les modifications de type target revision, path et nom des fichiers values se font désormais depuis la console CPiN (cf. haut de cette page).

Les applications ArgoCD créées avant la version 9.11.5 de la console CPiN suivaient le pattern : [nom-projet]-[env]-[nom-repo-infra]-[id] nommé application historique.

Lors de la mise en production de la version 9.11.5 de la console, pour chaque application ArgoCD existante, un test est réalisé afin de vérifier s'il existe des modifications réalisées depuis l'IHM ArgoCD (nommé `drift` par les équipes CPiN).

Si aucun `drift` n'est identifié, alors l'application ArgoCD historique est supprimée (en `non cascading` donc sans suppression de ressources) et remplacée par la nouvelle avec le pattern `[nom-prj-console]-[env]-[id]-[nom-repo-infra]-[id]`. L'environnement depuis la console CPiN est positionnée en `Synchronisation automatique`. Les modifications de l'application ArgoCD doivent désormais se faire en mode `GirOps` ce qui apporte un versionning et un historique des modifications dans les fichiers values.

Si un `drift` est identifé :
 - L'environnement dans la console CPiN n'est pas positonné en `Synchronisation automatique` et l'application historique est maintenue. Il est toujours possible de la modifier depuis ArgoCD.

 > :warning: Il est nécessaire de corriger tous les drift avant de passer l'environnement en `Synchronisation automatique` afin de ne pas impacter vos application.
 
  Afin de corriger les `drifts` plusieurs cas sont possibles :
   - *cas 1* : Présence de paramètre dans l'argoCD (surcharges de valeur depuis l'IHM) sur les champs parameters (surcharge d'un paramètre) et values (ajout d'un fichier de values depuis l'IHM). 
   :white_check_mark: Ce cas se corrige en renseignant les valeurs des paramètres dans les fichiers de values et indiquer le nom des fichiers values à utiliser depuis les repos d'infra dans la console.
   - *cas 2* : le nom des fichiers values utilisés par l'environnement ne correspondent pas au nom de l'environnement CPiN.
   :white_check_mark:  Ce cas se corrige en renommant les fichiers values en utilisant le système de templating `values-<env>.yaml`
   - *cas 3* :  Utilisation d'une target revision différente par enironnement : pour l'instant feature non supportée, développement en cours dans la console pour le supporter dans un prochaine version. Dans ce cas, il faut continuer à utiliser l'application historique et surtout ne pas cocher la `Synchronisation automatique` de l'environnement depuis la console CPiN
   - *cas 4* : utilisation du multi-sources  pour l'instant feature non supportée, développement en cours dans la console pour le supporter dans un prochaine version. Dans ce cas, il faut continuer à utiliser l'application historique et surtout ne pas cocher la `Synchronisation automatique` de l'environnement depuis la console CPiN 

Remarques générales :

> Un script réalisé par les équipes CPiN permet d'identifier les drifts pour les projets et de savoir dans quel cas le projet se trouve. La ServiceTeam communiquera aux projets ce cas afin d'indiquer quelles sont les modifications à apporter et pourra valider ces moficiations afin de pour passer dans le nouveau mode de gestion des applications ArgoCD.

> En cas de drift, il est **toujours** possible de continuer à utiliser l'application historique, le temps de corriger les drifts.

> :warning: Tant qu'un `drift` est présent, il ne faut **surtout pas** activer la `Synchronisation automatique` depuis les environnements dans la console CPiN. :warning: 
