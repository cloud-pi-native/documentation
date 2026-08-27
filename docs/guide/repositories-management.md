# Gestion des dépôts

En phase de développement, les équipes projets sont autonomes et travaillent avec leurs outils. La synchronisation des dépôts est le processus qui permet de *copier* les dépôts externes stockés sur github, gitab.com, bitbucket, etc. vers le dépôt de code de la plateforme Cloud π Native. la seule contrainte est que le dépôt externe soit accessible depuis Internet. Ce dépôt peut être public ou privé. Pour plus d'information, voir la page dédiée au [dépôt de code](/services/gitlab)

Cliquez sur l'onglet **ressources**
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

## Cohérence et nettoyage des dépôts (reprovisionnement)

À chaque opération de **reprovisionnement du projet** (bouton *Reprovisionner le projet* de la [page projet](/guide/projects-management)), la console compare les dépôts présents sur le GitLab de la plateforme avec ceux déclarés dans le projet, puis supprime les dépôts non conformes. Ce comportement s'applique aux dépôts gérés par la plateforme (portant le marqueur `plugin-managed`).

Pour l'utilisateur, cela signifie :

- **Créer un dépôt via la console** est la seule voie sûre. Un dépôt créé manuellement dans le GitLab de la plateforme peut être supprimé lors du prochain reprovisionnement s'il est considéré comme non conforme (porteur du marqueur de gestion et absent de la liste des dépôts du projet).
- **Supprimer un dépôt dans la console** supprime effectivement le dépôt correspondant dans le GitLab de la plateforme lors de la prochaine synchronisation. La suppression GitLab étant asynchrone, un reprovisionnement lancé juste après peut afficher un message transitoire de type `already marked for deletion` ; il est ignoré et n'interrompt plus l'opération.
- **Certains dépôts techniques sont protégés** et ne sont jamais supprimés, même s'ils n'apparaissent pas dans la liste des dépôts du projet : le dépôt `mirror` (synchronisation des dépôts externes), le dépôt `infra-apps` (dépôt d'infrastructure) et, selon les plugins activés, les dépôts techniques associés (par exemple le dépôt d'observabilité). Ils sont recréés automatiquement si besoin.
- Un dépôt créé manuellement dans le GitLab de la plateforme **sans** marqueur de gestion n'est pas modifié par la console, mais il n'est pas non plus intégré aux chaînes de construction et de déploiement du projet.

> En cas de doute, créez, modifiez et supprimez vos dépôts uniquement depuis la console, et relancez un reprovisionnement si un dépôt apparaît manquant après une suppression.

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
