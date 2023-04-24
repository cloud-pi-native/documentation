Retour à [l'accueil](README.md)

# Prérequis

## Critère d'éligibilité Cloud π Native

Voici des critère permettant de déterminer si votre  application est éligible à l'offre Cloud π Native. L'équipe projet Cloud π Native vous accompagne sur cette étape afin de trouver les solutions d'adaptation de vos application:
  - Les applications doivent être délivrée sous forme de containers et donc sur une suche d'OS Linux. Les applications nécessitant un OS Windows ne sont pas éligibles à l'offre.
  - Les applications doivent être **sans état** et partir  du principe qu'un composant applicatif (pod) peut être détruit à tout moment. Le stockage persistent de données est portée **principalement** par les bases de données. En cas de maintient de session applicative, un déport vers un composant de type Redis est nécessaire.
  - La configuration de l'application se fait par son environnement (principalement par des variables d'environnements). Seuls ces éléments change entre deux environnements : il s'agit de la même image déployée avec un configuration différente (par de reconstruction pour passer d'un environnement à un autre) 
  - Les images déployée doivent être **rootless**
  - Le FileSystem des images doit être en lecture seule
  - Afin d'accéder aux composants externes à l'application déployée sur Cloud π Native, par exemple des API, des demandes d'ouvertures de flux doivent être explicitement réalisée (voir la procédure TODO) 
  - Vérifier les contraintes de nom DNS : les applications doivent-elles obligatoirement être en *.gouv.fr ou *.interieur.gouv.fr ?
  - Exigences au sens CCT

## Prérequis orga

- Avoir un compte dans le SSO de Cloud π Native (à demander à l'équipe DSO).
- Avoir l'url de l'API Gateway (`API_DOMAIN`) (à demander à l'équipe DSO).
- Avoir une clé d'authentification (`CONSUMER_KEY`) auprès de l'API Gateway (à demander à l'équipe DSO).
- Avoir un secret d'authentification (`CONSUMER_SECRET`) auprès de l'API Gateway (à demander à l'équipe DSO).
- Si le dépôt externe est privé, un jeton d'accès personnel (PAT dans GiHub) avec le scope `repo` permettant de pull le dépôt sera demandé lors de l'enrolement sur Cloud π Native

## Prérequis Techniques

### Applicatifs

Une application Cloud Native doit respecter au maximum les [Twelve-Factor](https://12factor.net/fr/)

#### Obligatoire

1. Base de code

    Le code de l'application et de déploiement doit etre versionné dans un repo de source de type Git (Public/Privée) accessible depuis internet.
   
2. Dépendances
    
    __TOUTES__ dépendances necessaires à la constuction de l'application (Libraries,Images, ...) doivent faire parti des repo standard (Maven,Composer,Node, ...) ou reconstruite par l'offre et déposée dans le gestionnaire d'artefact de celle-ci.

3. Configuration / Service Externe

    __TOUTES__ la configuration applicative pouvant être amenée a être modifié (Service Externe,Port, ...) doit pouvoir être injecté par des variables d'environnement au runtime ou via un fichier de configuration dynamique via une ConfigMap

4. Port

    Afin de respecter les préconisation de sécurité d'[Openshift](https://docs.openshift.com/container-platform/4.12/openshift_images/create-images.html), les applications déployées doivent écouter sur des ports > 1024

5. Logs
    
    L'application __NE DOIT PAS__ écrire dans un fichier de logs spécifique mais écrire l'ensemble de ces logs dans la sortie standards (stdout) au format.
    
    Ceux-ci seront accessible via l'offre de supervision [FAQ](/faq)

6. Processus

    Les applications doivent être __STATELESS__, si des données de session/cache doivent être utilisé et partagé par l'application alors elles doivent faire l'objet d'un service externe prévus à cet effet (Redis, ...)
   
7. Processus d’administration

    Les opérations d'administrations doivent être faites via des initContainer (Init/Migration bdd, ...) ou des CronJob (Backup bdd, ...) [FAQ](/faq)

### Architectures

L'application déployée doit être conteneurisée (sous la forme de un ou plusieurs conteneurs).
  - Les __Dockerfiles__ doivent être dans le dépôt pour permettre à la chaine de reconstruire l'application.
  - Les images de bases des __Dockerfiles__ doivent être accessibles publiquement ou reconstuire par l'offre
  - Les images doivent être __rootless__, l'utilisateur qui lance le processus au sein du conteneur ne doit pas être `root` (cf. [liens utiles](/doc/utils) pour en apprendre plus sur le concept de __rootless__ et les spécificités d'Openshift).
  - L'utilisateur lançant le processus dans le conteneur doit avoir les droits adéquats en lecture / écriture sur le système de fichiers si l'application doit manipuler ce dernier.
  - Des sondes de ["Readiness"/"Liveness"](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) doivent être implémentées
  - Des ["Limits/Requests"](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) doivent etre mise en place

### Déployement

L'application doit se déployer à l'aide de fichiers d'__Infrastructure As Code__, pour ce faire 2 solution s'offrent aux utilisateurs.
 - Utiliser des manifestes [kubernetes](https://kubernetes.io/) avec Kustomize pour variabliser vos manifestes (cf. [tutoriels](/doc/tutorials))
 - Utiliser des charts [helm](https://helm.sh/) (cf. [tutoriels](/doc/tutorials) pour avoir des exemples de fichiers).


## Liens utiles 

- [Kubernetes Basics: Pods, Nodes, Containers, Deployments and Clusters](https://www.youtube.com/watch?v=B_X4l4HSgtc) - *video en anglais*
- [Kubernetes in 5 mins](https://www.youtube.com/watch?v=PH-2FfFD2PU) - *video en anglais*
- [Adapting Docker and Kubernetes containers to run on Red Hat OpenShift Container Platform](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#) - *article en anglais*
- [Building rootless containers for JavaScript front ends](https://developers.redhat.com/blog/2021/03/04/building-rootless-containers-for-javascript-front-ends#) - *article en anglais*
