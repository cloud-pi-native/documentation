# Déploiement de votre application

Une fois qu'un dépôt d'infrastructure est synchronisé, il convient de se rendre sur le service ArgoCD depuis la liste des services :
![argocd](/img/tuto/4argocd.png)

Cliquez sur le projet nouvellement créé afin de finaliser son configuration: modification du dépôt d'infrastructure par défaut, ou le cluster de déploiement applicative.

Allez dans le menu en haut et cliquez sur App detail :
![ArgoCD-menus](/img/tuto/4argocd-menus-bouton.png)

Sur l'écran qui s'affiche, cliquez sur le bouton *EDIT* et adaptez les valeurs renseignées par defaut par la console et selectionner le cluster de déployement.
![ArgoCD-app-details](/img/tuto/4argocd-app-details.png)

Notamment:

- **CLUSTER**: correspond au cluster sur lequel l'application doit être déployée, cela dépends des informations saisie lors de l'étape de [gérer les environnements](/guide/environments-management).
- **TARGET REVISION**: correspond à la branche du repo d'infra à déployer, par defaut il point sur HEAD (master). A adapter si le repo utilise une branche
- **PATH** qui est positionné à base par defaut et qui correspond à un déploiement de type fichiers de manifests ou kustmize. Dans le cas d'un déploiement de type HELM, modifier le PATH point pointer vers la racine en mettant un point dans le champs : . ou préciser le répertoire correspondant à la racine du chart
- Dans l'onglet **PARAMETERS**, il est possible de surcharger certaines valeurs du fichier values (mais il est préférable de modifier le fichier values directement)

Finir la saisie en cliquant sur le bouton *SAVE*

Le déploiement se fait automatiquement par ArgoCD, mais il est possible de forcer la synchronisation avec le repo sur gitlab Cloud π Native en cliquant sur les boutons:

- *REFRESH* pour forcer la synchronisation depuis le repo gitlab de la plateforme Cloud π Native
- *SYNC* pour forcer le rafraichissement entre l'état défini par git et l'état réel des objets créés par ArgoCD.

Une fois le déploiement est correctement effectué le status de l'application ArgoCD doit correspondre à :

![ArgoCD-menus](/img/tuto/4argocd-menus.png)
