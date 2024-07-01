# Gestion des dépôts

En phase de développement, les équipes projets sont autonomes et travaillent avec leurs outils sans contraintes apportées par la plateforme Cloud π Native. La synchronisation des dépôts est le processus qui permet de *copier* les dépôts externes stockés sur github, gitab.com, bitbucket, etc. vers le repo de code de la plateforme Cloud π Native. la seule contrainte est que le repo externe soit accessible depuis Internet. Ce repo peut être public ou privé. Pour plus d'information, voir la page dédiée au [repo de code](/services/gitlab)

Cliquez sur le menu gauche **Dépôts synchronisés**
![menu-projet-depot](/img/tuto/3tuto-depots.png)

Puis sur le bouton **+ Ajouter un nouveau dépôt**

Remplir le formulaire de synchronisation des dépôts:

- Choisir un nom
- Saisir l'URL du repo git distant. Dans le cas d'un repo privé cocher la case et préciser les credentials d'accès
- Deux types de repo peuvent être ajoutés:
  - Un repo applicatif: contenant du code applicatif et qui sera construit afin de créer des images Docker à déployer sur l'infrastructure cible.
  - Un repo d'infra: contenant les manifests de déploiement ou chart HELM contenant *l'infrastructure as code* du projet à déployer

![ajout dépôt](/img/tuto/3tuto-depots-ajouter.png)

Dans le cas d'un dépôt de code applicatif, générer les fichiers de *gitlab-ci* en cliquant sur le bouton *Fichiers de GitLab CI*. Le fichier `.gitlab-ci-dso.yml` est à placer à la racine de votre dépôt externe. Ces fichiers seront utilisés par le GitLab de Cloud π Native pour effectuer les divers tests, scans et déploiements du projet.

![gitlab-ci-dso](/img/tuto/3tuto-depots-ajouter-gitlab-ci.png)

Cliquer enfin sur le bouton `Ajouter le dépôt`.

Lorsqu'un dépôt est créé dans la console en tant que `dépôt d'infrastructure`, la plateforme créée automatiquement l'application [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) associée qui permettra le déploiement.


Une fois que le dépôt est correctement ajouté, il apparait avec une icône indiquant son statut :

<img src="/img/tuto/3tuto-depots-ajouter-ok.png" alt="depots synchronisés ok" width="25%" title="depots synchronisés ok">

> Cette opération demande d'attendre jusqu'à quelques minutes.
> 
> Des exemples de dépôts sont disponibles dans la sections [tutoriels](tutorials).
