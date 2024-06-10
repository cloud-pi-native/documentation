# Démarrer

La prise en main de la plateforme Cloud π Native se fait par la console.

## Etape 1 - Accès à la console

Une fois sur la console, il faut se connecter en cliquant en haut à droite sur le bouton se connecter :
![se connecter](/img/tuto/1tuto-connexion.png)

> **La** création des comptes utilisateurs est opérée par les administrateurs de la plateforme via l'interface administrateur de Keycloak.

## Etape 2 - Mes projets

Une fois connecté sur la console, le menu gauche s'enrichi avec une entrée "Mes Projets" contenant la liste de ses projets.
<img src="/img/tuto/2tuto-mes-projets.png" alt="mes projets" width="200px" title="mes projets">

Un projet est un espace virtuelle (Namespace pour kubernetes) pour une seule application et c'est rattaché à un ou plusieurs dépôts de code.

Cliquez sur le bouton **+ Créer un projet** afin d'ajouter un nouveau projet :
<img src="/img/tuto/2tuto-commander-projet.png" alt="créer projets" width="75%" title="créer projets">

Sur cet écran il est nécessaire de renseigner :
  - Nom de l'organisation : correspondant à l'entité administratif de rattachement.
  - Nom du projet :  Ce nom servira à créer un groupe dans gitlab de la plateforme Cloud π Native et sera une composante du namesapce Kubernetes créé.

Valider la saisie en cliquant sur **Commander mon espace projet**

La création d'un projet va lancer le provisionnement des différents [services](https://cloud-pi-native.fr/platform/introduction.html#services-core-proposes-par-la-plateforme), ce qui signifie principalement la configuration de ces outils avec un éspace dédié pour le projet, son cloisonnement avec les autres projets et l'authentification des utilisateurs projet dans ces outils. Cette opération pourra prendre quelques minutes et le nouveau projet est présenté en cours de construction :

<img src="/img/tuto/2tuto-creer-projet.png" alt="projet en cours de construction" width="75%" title="projet en cours de construction">

A la fin du processus de création, l'icone du projet est modifiée comme suit et devient un lien cliquable :

<img src="/img/tuto/2tuto-creer-projet-termine.png" alt="projet terminé" width="25%" title="projet terminé">

Au clic sur le projet, on arrive sur la liste des services associés :
<img src="/img/tuto/2tuto-acces-services.png" alt="Accès au services" width="75%" title="Accès au services">

Chaque icone permet d'accéder directement aux services de la plateforme directement sur le contexte du projet.

Une entrée dans le menu gauche permet également de voir l'état des services :

<img src="/img/tuto/etat-services.png" alt="Etat des services" width="75%" title="Etat des services">

### Gérer les membres

:construction: *Disponible prochainement* :construction: 

## Etape 3 - Ajouter un dépôt synchronisé

Une fois que le projet est créé sur la console, il convient d'ajouter des dépôts synchronisés.

En effet, en phase de développement, les équipes projets sont autonomes et travaillent avec leurs outils sans contraintes apportées par la plateforme Cloud π Native. La synchronisation des dépôts est le processus qui permet de *copier* les dépôts externes stockés sur github, gitab.com, bitbucket, etc. vers le repo de code de la plateforme Cloud π Native. la seule contrainte est que le repo externe soit accessible depuis Internet. Ce repo peut être public ou privé. Pour plus d'information, voir la page dédiée au [repo de code](/services/gitlab)

Cliquez sur le menu gauche **Dépôts synchronisés**

Puis sur le bouton **+ Ajouter un nouveau dépôt**

<img src="/img/tuto/3tuto-depots.png" alt="Dépôts synchronisés" width="25%" title="Dépôts synchronisés">


Remplir le formulaire de synchronisation des dépôts:
  - Choisir un nom
  - Saisir l'URL du repo git distant. Dans le cas d'un repo privé cocher la case et préciser les credentials d'accès
  - Deux types de repo peuvent être ajouté : 
    - Un repo applicatif : contenant du code applicatif et qui sera construit afin de créer des images Docker à déployer sur l'infrastructure cible.
    - Un repo d'infra : contenant les manifests de déploiement ou chart HELM contenant *l'infrastructure as code* du projet à déployer

<img src="/img/tuto/3tuto-depots-ajouter.png" alt="Dépôts synchronisés" width="75%" title="Dépôts synchronisés">


Dans le cas d'un dépôt de code applicatif, générer les fichiers de *gitlab-ci* en cliquant sur le bouton *Fichiers de GitLab CI*. Le fichier `.gitlab-ci-dso.yml` est à placer à la racine de votre dépôt externe et les `includes` (les autres fichiers `.yml`) sont à placer dans un dossier `includes/` à la racine de votre dépôt externe. Ces fichiers seront utilisés par le GitLab de Cloud π Native pour effectuer les divers tests, scans et déploiements du projet.

<img src="/img/tuto/3tuto-depots-ajouter-gitlab-ci.png" alt="Gitlab-CI" width="75%" title="Gitlab-CI">

Cliquer enfin sur le bouton `Ajouter le dépôt`.

Lorsqu'un dépôt est créé dans la console en tant que `dépôt d'infrastructure`, la plateforme créé automatiquement l'application [ArgoCD](https://argo-cd.readthedocs.io/en/stable/) associée qui permettra le déploiement.


Une fois que le dépôt est correctement ajouté, il apparait avec une icône indiquant son statut :

<img src="/img/tuto/3tuto-depots-ajouter-ok.png" alt="depots synchronisés ok" width="25%" title="depots synchronisés ok">

> Cette opération demande d'attendre jusqu'à quelques minutes.

> Des exemples de dépôts sont disponibles dans la sections [tutoriels](tutorials).


### Gérer les environnements

Une fois les dépôts d'infrastructure sont ajoutés, il sera possible d'ajouter un environnement en cliquant sur `Environments du projet` puis `Ajouter un nouvel environnement`

<img src="/img/tuto/3tuto-environnement.png" alt="ArgoCD" width="75%" title="environnement">

Il faudra d'abord sélectionner le *stage* de déploiement de l'application permettant ensuite de choisir le cluster de déploiement (Prod/HorsProd/Dédié) ains que différents *quotas*.

Selectionner ensuite l'environnement, les quotas, et le cluster ou vous souhaitez le déployer puis sur `Ajouter l'environnement`

:warning: La création de dépôt d'infrastructure et la déclaration d'un environnement déclenche la création d'une application dans ArgoCD et d'un namespace dédié afin de déployer l'application.

Des informations seront précréer dans ce namespace notamment l'imagePullSecrets qui sera a utilisé pour votre projet.

**L'IMAGEPULLSECRETS SERA A RENSEIGNRER DANS LES TEMPLATES DE DEPLOYEMENT DE VOS IMAGES** :warning:

Exemple:

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: monimage-backend
  labels:
    app: monimage-backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: monimage-backend
  template:
    metadata:
      labels:
        app: monimage-backend
        Tier: backend
        Criticality: Low
        Component: java
    spec:
      imagePullSecrets:
        - name: registry-pull-secret
      containers:
        - name: monimage-backend
          image: harbor.apps.c6.numerique-interieur.com/mi-monprojet/monimage-backend:v2
          imagePullPolicy: Always
          resources:
            requests:
              memory: "256Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "100m"
          ports:
            - containerPort: 8080 
```

Une fois qu'un dépôt d'infrastructure est synchronisé, il convient de se rendre sur le service ArgoCD depuis la liste des services :

<img src="/img/tuto/4argocd.png" alt="ArgoCD" width="75%" title="ArgoCD">

Cliquez sur le projet nouvellement créé afin de finaliser son configuration: modification du dépôt d'infrastructure par défaut, ou le cluster de déploiement applicative. 

Allez dans le menu en haut et cliquez sur App detail :

<img src="/img/tuto/4argocd-menus-bouton.png" alt="ArgoCD-menus" width="75%" title="ArgoCD-menus">

Sur l'écran qui s'affiche, cliquez sur le bouton *EDIT* et adaptez les valeurs renseignées par defaut par la console et selectionner le cluster de déployement.

<img src="/img/tuto/4argocd-app-details.png" alt="ArgoCD-app-details" width="75%" title="ArgoCD application details">

Notamment :
  - CLUSTER : correspond au cluster sur lequel l'application doit être déployée, cela dépends des informations saisie lors de l'étape de [gérer les environnements](#gérer-les-environnements).
  - TARGET REVISION : correspond à la branche du repo d'infra à déployer, par defaut il point sur HEAD (master). A adapter si le repo utilise une branche
  - PATH qui est positionné à base par defaut et qui correspond à un déploiement de type fichiers de manifests ou kustmize. Dans le cas d'un déploiement de type HELM, modifier le PATH point pointer vers la racine en mettant un point dans le champs : . ou préciser le répertoire correspondant à la racine du chart
  - Dans l'onglet *PARAMETERS*, il est possible de surcharger certaines valeurs du fichier values (mais il est préférable de modifier le fichier values directement) 

Finir la saisie en cliquant sur le bouton *SAVE*

Le déploiement se fait automatiquement par ArgoCD, mais il est possible de forcer la synchronisation avec le repo sur gitlab Cloud π Native en cliquant sur les boutons :
  - *REFRESH* pour forcer la synchronisation depuis le repo gitlab de la plateforme Cloud π Native
  - *SYNC* pour forcer le rafraichissement entre l'état défini par git et l'état réel des objets créés par ArgoCD.

Une fois le déploiement est correctement effectué le status de l'application ArgoCD doit correspondre à :

<img src="/img/tuto/4argocd-menus.png" alt="ArgoCD-menus" width="75%" title="ArgoCD-menus">


## Etape 4 : Paramétrer la synchronisation

Une fois le dépôt interne à la plateforme créé et lié à un dépôt externe, il sera important de paramétrer la synchronisation entre le dépôt source et son clône. La création déclenche une première synchronisation. Il convient maintenant de configurer comment ce dépôt sera synchronisé dans le temps.

Pour paramétrer la synchronisation d'un dépôt :

<!-- - Un dépôt nommé `<nom_de_votre_project>/<nom_de_votre_project>-mirror` a été créé dans le groupe GitLab du projet. Dans ce dernier se trouve un script `script-mirror.sh` à copier dans votre dépôt externe.
  > Ce script a pour but de demander à la plateforme de synchroniser le dépôt en effectuant un appel api (avec authentification auprès de l'api gateway).
  > Il faut donc lancer ce script dans la CI/CD du dépôt source selon les évènements sur lesquels on souhaite déclencher une synchronisation (ex: lors d'un push sur la branche main).

- Dans le GitLab de la plateforme, récupérer dans le dépôt `<nom_de_votre_project>/<nom_de_votre_project>-mirror` le token `GITLAB_TRIGGER_TOKEN` (`Settings > CI/CD > Pipeline triggers`, au besoin en créer un).

- Ajouter les variables d'environnements suivantes dans les __*secrets*__ de la CI/CD externe avec les valeurs fournies par l'équipe DSO ou précédemment récupérées (ces secrets seront utilisés par le script `script-mirror.sh`)

  | Nom de variable      | Description                                                                  |
  | -------------------- | ---------------------------------------------------------------------------- |
  | API_DOMAIN           | Url de l'API Gateway                                                         |
  | CONSUMER_KEY         | Clé d'authentification de l'application au travers de l'API Gateway          |
  | CONSUMER_SECRET      | Secret d'authentification de l'application au travers de l'API Gateway       |
  | GITLAB_TRIGGER_TOKEN | Token de déclenchement du pipeline de synchronisation dans le GitLab interne |

- Ajouter dans la CI/CD l'exécution de ce script pour déclencher la synchronisation automatiquement.
  
  *Exemple avec Github (synchro lors d'un push sur la branche main du dépôt source) :*

  ```yaml
  # Dans un fichier .github/workflows/script-mirror.yaml
  name: Repo sync with Cloud π Native

  on:
    push:
      branches:
        - "main"
    workflow_dispatch:

  jobs:
    mirror:
      name: Sync repo with Cloud π Native
      runs-on: ubuntu-latest
      steps:
        - name: Checks-out repository
          uses: actions/checkout@v3
        - name: Send a sync request to DSO api
          run: |
            sh ./path/to/script-mirror.sh \
              -a ${{ secrets.API_DOMAIN }} \
              -g ${{ secrets.GITLAB_TRIGGER_TOKEN }} \
              -k ${{ secrets.CONSUMER_KEY }} \
              -s ${{ secrets.CONSUMER_SECRET }}
  ```

- Répéter cette opération pour tous les dépôts y compris pour le ou les dépôts d'infrasctructure as code.

La synchronisation est maintenant en place et chaque appel API effectué avec le script `script-mirror.sh` entrainera le déclenchement de la chaine DevSecOps. -->

- Un dépôt nommé `<nom_de_votre_project>/mirror` a été créé dans le groupe GitLab du projet. Dans ce dernier se trouve un script `mirror.sh` à copier dans votre dépôt externe.
  > Ce script a pour but de demander à la plateforme de synchroniser le dépôt en effectuant un appel api (avec authentification un trigger_token).
  > Il faut donc lancer ce script dans la CI/CD du dépôt source selon les évènements sur lesquels on souhaite déclencher une synchronisation (ex: lors d'un push sur la branche main).

- Dans le GitLab de la plateforme, récupérer dans le dépôt `<nom_de_votre_project>/mirror` le token `GITLAB_TRIGGER_TOKEN` (`Settings > CI/CD > Pipeline triggers`, au besoin en créer un).

- Ajouter les variables d'environnements suivantes dans les __*secrets*__ de la CI/CD externe avec les valeurs fournies par l'équipe DSO ou précédemment récupérées (ces secrets seront utilisés par le script `mirror.sh`)

  | Nom de variable          | Description                                                                  |
  | ------------------------ | ---------------------------------------------------------------------------- |
  | API_URL                  | Url de GitLab                                                                |
  | BRANCH_TO_SYNC           | Branche ou tag a synchroniser                                                |
  | GITLAB_MIRROR_PROJECT_ID | ID du projet mirror dans GitLab                                              |
  | REPOSITORY_NAME          | Nom du repo a synchronisé dans le GitLab DSO                                 |
  | GITLAB_TRIGGER_TOKEN     | Token de déclenchement du pipeline de synchronisation dans le GitLab interne |

- Ajouter dans la CI/CD l'exécution de ce script pour déclencher la synchronisation automatiquement.
  
  *Exemple avec Github (synchro lors d'un push sur la branche main du dépôt source) :*

  ```yaml
  # Dans un fichier .github/workflows/script-mirror.yaml
  name: Repo sync with Cloud π Native

  on:
    push:
      branches:
        - "main"
    workflow_dispatch:

  jobs:
    mirror:
      name: Sync repo with Cloud π Native
      runs-on: ubuntu-latest
      steps:
        - name: Checks-out repository
          uses: actions/checkout@v3
        - name: Send a sync request to DSO api
          run: |
            sh ./path/to/mirror.sh \
              -a ${{ secrets.API_URL }} \
              -g ${{ secrets.GITLAB_TRIGGER_TOKEN }} \
              -b ${{ secrets.BRANCH_TO_SYNC }} \
              -r ${{ secrets.REPOSITORY_NAME }} \
              -i ${{ secrets.GITLAB_MIRROR_PROJECT_ID }}
  ```

- Répéter cette opération pour tous les dépôts en changeant le **REPOSITORY_NAME** y compris pour le ou les dépôts d'infrasctructure as code.

La synchronisation est maintenant en place et chaque appel API effectué avec le script `mirror.sh` entrainera le déclenchement de la chaine DevSecOps.
