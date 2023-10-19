Retour à [l'accueil](README.md)

# Prérequis

## Critères d'éligibilité Cloud π Native

Voici des critères permettant de déterminer si votre application est éligible à l'offre Cloud π Native. L'équipe projet Cloud π Native vous accompagne sur cette étape afin de trouver les solutions d'adaptation de vos application:
  - Les applications doivent être délivrées sous forme de containers et donc sur une suche d'OS Linux. Les applications nécessitant un OS Windows ne sont pas éligibles à l'offre.
  - Les applications doivent être **sans état** (`stateless`) et partir  du principe qu'un composant applicatif (`pod`) peut être détruit à tout moment. Le stockage persistant de données est porté **principalement** par les bases de données. En cas de maintien de session applicative, un déport vers un composant de type Redis est nécessaire.
  - La configuration de l'application se fait par son environnement (principalement par des variables d'environnements). Seuls ces éléments changent entre deux environnements : il s'agit de la même image déployée avec un configuration différente (par de reconstruction pour passer d'un environnement à un autre) 
  - Les images déployées doivent être **rootless**
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

    Le code de l'application et de déploiement doit etre versionné dans un repo de source de type Git (Public/Privé) accessible depuis internet.
   
2. Dépendances
    
    __TOUTES__ les dépendances necessaires à la constuction de l'application (Libraries,Images, ...) doivent faire partie des repos standard (Maven,Composer,Node, ...) ou reconstruite par l'offre et déposée dans le gestionnaire d'artefact de celle-ci.

3. Configuration / Service Externe

    __TOUTE__ la configuration applicative pouvant être amenée a être modifiée (Service Externe,Port, ...) doit pouvoir être injectée par des variables d'environnement au runtime ou via un fichier de configuration dynamique via une ConfigMap

4. Port

    Afin de respecter les préconisations de sécurité d'[Openshift](https://docs.openshift.com/container-platform/4.12/openshift_images/create-images.html), les applications déployées doivent écouter sur des ports > 1024

5. Logs
    
    L'application __NE DOIT PAS__ écrire dans un fichier de logs spécifique mais écrire l'ensemble de ces logs dans la sortie standards (stdout) au format.
    
    Ceux-ci seront accessible via l'offre de supervision [FAQ](/faq)

6. Processus

    Les applications doivent être __STATELESS__, si des données de session/cache doivent être utilisées et partagées par l'application alors elles doivent faire l'objet d'un service externe prévus à cet effet (Redis, ...)
   
7. Processus d’administration

    Les opérations d'administrations doivent être faites via des `initContainer` (Init/Migration bdd, ...) ou des `CronJob` (Backup bdd, ...) [FAQ](/faq)

### Architecture

L'application déployée doit être conteneurisée (sous la forme de un ou plusieurs conteneurs).
  - Les __Dockerfiles__ doivent être dans le dépôt pour permettre à la chaine de reconstruire l'application.
  - Les images de bases des __Dockerfiles__ doivent être accessibles publiquement ou reconstuites par l'offre
  - Les images doivent être __rootless__, l'utilisateur qui lance le processus au sein du conteneur ne doit pas être `root` (cf. [liens utiles](/doc/utils) pour en apprendre plus sur le concept de __rootless__ et les spécificités d'Openshift).
  - L'utilisateur lançant le processus dans le conteneur doit avoir les droits adéquats en lecture / écriture sur le système de fichiers si l'application doit manipuler ce dernier.
  - Des sondes de ["Readiness"/"Liveness"](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) doivent être implémentées
  - Des ["Limits/Requests"](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) doivent etre mise en place

### Déploiement

L'application doit se déployer à l'aide de fichiers d'__Infrastructure As Code__, pour ce faire 2 solutions s'offrent aux utilisateurs.
 - Utiliser des manifestes [kubernetes](https://kubernetes.io/) avec Kustomize pour variabliser vos manifestes (cf. [tutoriels](/doc/tutorials))
 - Utiliser des charts [helm](https://helm.sh/) (cf. [tutoriels](/doc/tutorials) pour avoir des exemples de fichiers).

## Règles Kyverno appliqué au Clusters
| Kyverno Rules | ValidationFailure Action (Dev, preprod) | ValidationFailure Action (Prod) | Information importantes | Type | description |
| ------------- | --------------------------------------- | ------------------------------- | --------------------- | -----|------ |
| add-velero-label |     |     |     | Backup | Ajoute une étiquette sur le namespace pour être sauvegardé par Velero |
| add-netpol-allowsame-ns |     |     |     | Sécurité| Autorise le pod à communiquer dans le même namespace |
| add-netpol-deny |     |     |     | Sécurité| Refuse toute communication entrante vers les pods dans un namespace |
| add-netpol-ingress |     |     |    | Sécurité | Autorise la communication entrante depuis le namespace openshift-ingress vers tous les pods dans un nouveau namespace créé |
| add-netpol-logging |     |     |    | Sécurité | Autorise la communication entrante depuis le namespace openshift-logging vers tous les pods dans un nouveau namespace créé |
| add-quota | AUDIT | ENFORCE | CPU: request/limit = 4 , Mem request/limit = 16Gi | Bonne pratique | Cette règle garantit que chaque namespace a un quota de ressources défini pour éviter une utilisation excessive des ressources du cluster |
| add-ttl |     |     |     | Bonne pratique | Ajoute un time to live (TTL) aux JOB dans le cluster, ce qui les conduit à être automatiquement nettoyés après une certaine période de temps |
| check-labels | AUDIT | ENFORCE | Labels requis : app, env, tier | Bonne pratique | Cette règle garantit que toutes les ressources ont les étiquettes nécessaires appliquées aux pod |
| cm-no-credentials | AUDIT | ENFORCE | data non autorisée : password, passwd, secret_key | Sécurité / Bonne pratique | Empêche le stockage des informations d'identification dans les ConfigMaps, ce qui est une mauvaise pratique d'un point de vue sécurité |
| disallow-exec | ENFORCE | ENFORCE |     | Sécurité |Empêche l'utilisation de la commande "exec" sur le namespace openshift-etcd pour des raisons de sécurité |
| disallow-latest | AUDIT | ENFORCE |      | Bonne pratique | Les Pods n'utilisent pas la balise 'latest' pour leurs images, encourageant l'utilisation de balises versionnées spécifiques |
| disallow-hostpath | AUDIT | ENFORCE |    | Sécurité | Empêche l'utilisation des volumes hostPath, qui peuvent être un risque de sécurité s'ils ne sont pas correctement contrôlés |
| disallow-selfprovisionning | AUDIT | ENFORCE |    | Sécurité | Empêche la liaison au rôle de self-provisionners pour un contrôle strict de la création de projet OpenShift |
| etcd | ENFORCE | ENFORCE |     | Sécurité | Assure que le chiffrement est activé pour etcd dans les clusters OpenShift |
| limit-size-pvc | AUDIT | ENFORCE | pvc < 1Ti | Bonne pratique | Limite la taille des revendications de volume persistant (PVC) pour éviter l'utilisation excessive des ressources de stockage |
| need-containers-ressources | AUDIT | ENFORCE | limits.memory, limits.cpu, request.memory et request.cp | Bonne pratique | Assure que les demandes de ressources et les limites sont définies pour tous les Pods, pour assurer une utilisation équitable des ressources |
| restrict-image-registry | AUDIT | ENFORCE | registres autorisés : docker.io/, harbor.io/, registry.redhat.io/, quay.io/, bitnami/, ghcr.io/ | Sécurité | Restreint les registres d'images à partir desquels les conteneurs peuvent tirer des images, comme mesure de sécurité pour assurer l'utilisation d'images de confiance uniquement |
| restrict-nodeport | AUDIT | ENFORCE |     | Securité | Restreint l'utilisation des services NodePort, qui peuvent exposer des services à l'extérieur du cluster et représenter un risque de sécurité potentiel |<<>>
| need-liveness-readiness | AUDIT | ENFORCE |     | Bonne pratique | Assure que tous les conteneurs ont l'un des trois : sondes de Liveness, Readiness ou de Startup probes, pour s'assurer qu'ils signalent correctement leur statut à Openshift |
| job-history | AUDIT | ENFORCE | | Bonne pratique | Assure que les cronjob est un  successfulJobsHistoryLimit: 5 et  failedJobsHistoryLimit: 5 |

Explication de la difference entre ENFORCE et AUDIT : 
- Enforce : Kyverno bloquera l'action (par exemple, la création, la mise à jour ou la suppression d'une ressource) si la politique n'est pas respectée. Cela garantit que toutes les ressources du cluster respectent les politiques mise en place.

- Audit: Une action d'Audit ne bloquera pas une action si la politique n'est pas respectée, mais elle enregistrera l'infraction dans les résultats d'audit de Kyverno. C'est utile pour observer les infractions aux politiques sans bloquer les actions, ce qui peut être particulièrement utile dans les environnements de développement ou de test.

## Liens utiles 

- [Kubernetes Basics: Pods, Nodes, Containers, Deployments and Clusters](https://www.youtube.com/watch?v=B_X4l4HSgtc) - *video en anglais*
- [Kubernetes in 5 mins](https://www.youtube.com/watch?v=PH-2FfFD2PU) - *video en anglais*
- [Adapting Docker and Kubernetes containers to run on Red Hat OpenShift Container Platform](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#) - *article en anglais*
- [Building rootless containers for JavaScript front ends](https://developers.redhat.com/blog/2021/03/04/building-rootless-containers-for-javascript-front-ends#) - *article en anglais*
