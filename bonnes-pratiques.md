# Bonnes pratiques

## Applicatifs

Une application Cloud Native doit respecter au maximum les [Twelve-Factor](https://12factor.net/fr/)

### Obligatoire

1. Base de code
   
2. Dépendances
    
    __TOUTES__ dépendances necessaires à la constuction de l'application (Libraries,Images, ...) doivent faire parti des repo standard (Maven,Composer,Node) ou reconstruite par l'offre et déposée dans le gestionnaire d'artefact de celle-ci

3. Configuration / Service Externe

    __TOUTES__ la configuration applicative pouvant être amenée a être modifié (Service Externe,Port,...) doit pouvoir être injecté par des variables d'environnement au runtime.

4. Port

    Afin de respecter les préconisation de sécurité d'[Openshift](https://docs.openshift.com/container-platform/4.12/openshift_images/create-images.html), les applications déployées doivent écouter sur des ports > 1024

5. Logs
    
    L'application __NE DOIT PAS__ écrire dans un fichier de logs spécifique mais écrire l'ensemble de ces logs dans la sortie standards (stdout) au format.
    
    Ceux-ci seront accessible via l'offre de supervision [FAQ](/faq)

6. Processus

    Les applications doivent être __STATELESS__, si des données de session/cache doivent être utilisé par l'application alors elles doivent faire l'object d'un service externe prévus à cette effet (Redis, ...)
   
7. Processus d’administration

    Les opérations d'administrations doivent être faites via des initContainer (Init/Migration bdd, ...) ou des CronJob (Backup bdd, ...) [FAQ](/faq)

## Architectures

L'application déployée doit être conteneurisée (sous la forme de un ou plusieurs conteneurs).
  - Les __Dockerfiles__ doivent être dans le dépôt pour permettre à la chaine de reconstruire l'application.
  - Les images de bases des __Dockerfiles__ doivent être accessibles publiquement ou reconstuire par l'offre
  - Les images doivent être __rootless__, l'utilisateur qui lance le processus au sein du conteneur ne doit pas être `root` (cf. [liens utiles](/doc/utils) pour en apprendre plus sur le concept de __rootless__ et les spécificités d'Openshift).
  - L'utilisateur lançant le processus dans le conteneur doit avoir les droits adéquats en lecture / écriture sur le système de fichiers si l'application doit manipuler ce dernier.
  - Des sondes de "Readiness"/"Liveness" doivent être implémenté
  - Des limits/requests doivent etre mise en place 

## Déployement

L'application doit se déployer à l'aide de fichiers d'__Infrastructure As Code__, pour ce faire 2 solution s'offrent aux utilisateurs.
 - Utiliser des manifestes [kubernetes](https://kubernetes.io/) avec Kustomize pour variabliser vos manifestes (cf. [tutoriels](/doc/tutorials))
 - Utiliser des charts [helm](https://helm.sh/) (cf. [tutoriels](/doc/tutorials) pour avoir des exemples de fichiers).
