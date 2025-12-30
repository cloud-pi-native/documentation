# Déploiement de votre application

Lors de la configuration du dépôt d'infrastructure, depuis la console, il est possible de choisir quelques spécificités et notamment :

- **Nom de la révision** : correspond à la branche (ou tag) du dépôt d'infra à déployer, par défaut la cible sera HEAD.
- **Chemin du répertoire** : correspond au chemin vers vos fichiers de déploiement de type manifests, kustomize ou helm. La valeur par défaut est `.`, soit la racine du dépôt.
- **Fichiers values** : une liste des fichiers values à utiliser (dans le cas d'un Helm Chart). Si le pattern `<env>` est spécifié dans le chemin ou le nom du fichier, celui-ci sera remplacé par le **nom de l'environnement** lors du déploiement.

![Options de déploiement](/img/tuto/options-repo-infra.png)

> Attention, sur les versions précédentes de la console CPiN, ces modifications s'effectuaient depuis ArgoCD dans le menu details de l'application. Il est maintenant *obligatoire* de faire ces modifications depuis la console. En effet, toute modification depuis l'interface ArgoCD sur ces éléments ne sera pas pris en compte.

## Visualisation dans ArgoCD

Le déploiement se fait automatiquement par ArgoCD. Une fois qu'un dépôt d'infrastructure est synchronisé, il convient de se rendre sur le service ArgoCD depuis la liste des services.
Il est possible de forcer la synchronisation avec le dépôt sur gitlab Cloud π Native en cliquant sur les boutons :

- *REFRESH* pour forcer la synchronisation depuis le dépôt gitlab de la plateforme Cloud π Native
- *SYNC* pour forcer le rafraichissement entre l'état défini par git et l'état réel des objets créés par ArgoCD.

![ArgoCD-menus](/img/tuto/4argocd-menus-bouton.png)

Note : Si vous avez désactivé la synchronisation automatique, il faudra obligatoirement passer par cette synchronisation manuelle *SYNC*. Voir [Gestion des environnements](/guide/environments-management#synchronisation-argocd).

Une fois que le déploiement est correctement effectué le status de l'application ArgoCD doit correspondre à :

![ArgoCD-menus](/img/tuto/4argocd-menus.png)
