# Déploiement de votre application

Une fois qu'un dépôt d'infrastructure est synchronisé, il convient de se rendre sur le service ArgoCD depuis la liste des services :
![argocd](/img/tuto/4argocd.png)

Cliquez sur l'application nouvellement créé afin de finaliser sa configuration :

Allez dans le menu en haut et cliquez sur details :
![ArgoCD-menus](/img/tuto/4argocd-menus-bouton.png)

Sur l'écran qui s'affiche, cliquez sur le bouton *EDIT* et adaptez les valeurs renseignées par défaut par la console.
![ArgoCD-app-details](/img/tuto/4argocd-app-details.png)

Notamment :

- **CLUSTER** : correspond au cluster sur lequel l'application doit être déployée, celà dépends des informations renseignées lors de l'étape de [gérer les environnements](/guide/environments-management).
- **TARGET REVISION** : correspond à la branche du dépôt d'infra à déployer, par défaut il point sur HEAD (master).
- **PATH** qui est positionné sur "helm/" par défaut. Vous devez indiquer le bon chemin vers vos fichiers de déploiement de type manifests, kustomize ou helm.
- Dans l'onglet **PARAMETERS**, il est possible de surcharger certaines valeurs du fichier values (mais il est préférable de modifier le fichier values directement)

Finir la saisie en cliquant sur le bouton *SAVE*

Le déploiement se fait automatiquement par ArgoCD, mais il est possible de forcer la synchronisation avec le dépôt sur gitlab Cloud π Native en cliquant sur les boutons:

- *REFRESH* pour forcer la synchronisation depuis le dépôt gitlab de la plateforme Cloud π Native
- *SYNC* pour forcer le rafraichissement entre l'état défini par git et l'état réel des objets créés par ArgoCD.

Une fois que le déploiement est correctement effectué le status de l'application ArgoCD doit correspondre à :

![ArgoCD-menus](/img/tuto/4argocd-menus.png)
