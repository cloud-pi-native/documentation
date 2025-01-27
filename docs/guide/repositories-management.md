# Gestion des dépôts

En phase de développement, les équipes projets sont autonomes et travaillent avec leurs outils. La synchronisation des dépôts est le processus qui permet de *copier* les dépôts externes stockés sur github, gitab.com, bitbucket, etc. vers le dépôt de code de la plateforme Cloud π Native. la seule contrainte est que le dépôt externe soit accessible depuis Internet. Ce dépôt peut être public ou privé. Pour plus d'information, voir la page dédiée au [dépôt de code](/services/gitlab)

Cliquez sur le menu gauche **Dépôts**
![menu-projet-depot](/img/tuto/3tuto-depots.png)

## Ajouter un dépôt

Puis sur le bouton **+ Ajouter un nouveau dépôt**

Remplir le formulaire des dépôts :

- Choisir un nom pour votre dépôt interne (herbéger sur la plateforme)
- Deux types de dépôt peuvent être ajoutés :
  - Un dépôt applicatif: contenant du code applicatif et qui sera construit afin de créer des images Docker à déployer sur l'infrastructure cible. Choix par défaut.
  - Un dépôt d'infra: contenant les manifests de déploiement ou chart HELM contenant *l'infrastructure as code* du projet a déployé. Il suffit de cocher la case associée.
- Si vous n'avez pas de dépôts distants vous pouvez selectionner le bouton "Dépôt sans source git externe".
- Dans le cas contraire, il vous suffit de saisir l'URL du dépôt git distant. Dans le cas d'un dépôt privé cocher la case et préciser les informations d'accès

**Il est recommandé de passer par l'ajout d'un dépôt dans la console et non de le faire directement dans Gitlab. A chaque modification dans la console, celle-ci vérifie la cohérence des dépôts configurés avec ceux qui existent vraiment et supprime ceux en trop.**

![ajout dépôt](/img/tuto/3tuto-depots-ajouter.png)

Cliquer enfin sur le bouton `Ajouter le dépôt`.

> Cette opération demande d'attendre jusqu'à quelques minutes.

Lorsqu'un dépôt est créé dans la console en tant que `dépôt d'infrastructure`, la plateforme créée automatiquement l'application [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) associée qui permettra le déploiement.

> Des exemples de dépôts sont disponibles dans la section [tutoriels](tutorials).

## Synchronisation d'un dépôt

Il est possible de synchroniser son dépôt depuis la console, pour cela il suffit de cliquer sur la tuile d'un dépôt.
Deux options sont disponibles :
 - Synchroniser toutes les branches
 - Renseigner le nom d'une branche a synchronisé
Le bouton **Lancer la synchronisation** démarre une pipeline sur la GitLab DSO afin de synchroniser le dépôt.

![repository synchro](/img/guide/repository_synchro.png)

> Il est possible de lancer via curl cette pipeline,la commande est disponible dans les secrets du projet.
> Cette commande pourra servir de base pour un GitHub action, etc...
>
> Exemple de GitHub Action :
> ```yaml
> name: Webhook to update the Cloud Pi repo
> on: push
> jobs:
>   curl:
>     runs-on: ubuntu-latest
>     steps:
>       - name: call webhook
>         env:
>           # Needs GIT_MIRROR_TOKEN to be added to github repo actions secrets
>           GIT_MIRROR_TOKEN: ${{ secrets.GIT_MIRROR_TOKEN }}
>           BRANCH_TO_SYNC: ${{ github.head_ref || github.ref_name }}
>         run: |
>           REPOSITORY_NAME=<my_repo_name>
>           GIT_MIRROR_PROJECT_ID=<my_project_id>
>
>           curl -X POST --fail \
>             -F token=$GIT_MIRROR_TOKEN \
>             -F ref=main \
>             -F variables[GIT_BRANCH_DEPLOY]=$BRANCH_TO_SYNC \
>             -F variables[PROJECT_NAME]=$REPOSITORY_NAME \
>             "https://gitlab.apps.dso.numerique-interieur.com/api/v4/projects/$GIT_MIRROR_PROJECT_ID/trigger/pipeline"
> ```
>
> A noter dans l'exemple précèdent qu'il convient d'utiliser le bon url Gitlab.
