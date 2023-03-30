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

## Labels

Les ressources doivent comporter des labels permettant de les identifier. les labels pourrait etre decomposés de la facon suivante : 

``` Yaml 
App : " CCAF "
Env : " dev, preprod, prod "
Tier : " frontend, backend, db " 
Criticality : " High, Medium, Low "
```

## Images TAG

Les images poussées dans le registry devront etre unique et identifiés via un Sha ou Short-Sha qui pourrait etre link au commit Git. Grace a cela une gestion des releases et le rollback sera possible

Exemple de valeur pour le Tag de l'image : 

```
CI_COMMIT_SHA
CI_COMMIT_SHORT_SHA
CI_COMMIT_TAG
CI_JOB_ID
```

## Naming Policy

Les noms de toutes les ressources Openshift ne doivent jamais etre trop longs, il est donc conseillé de choisir des noms courts. 
il se pourrait pas que des ressources ne soient pas déployées si le nom est trop long. 
Coté d'exploitation, cela facilite grandement la gestion.

Exemple :

Service : env-app-svc
Deployment : env-app-dep
STS : env-app-sts
ConfigMap : env-app-cm

## Secrets 

Les secrets comportent toutes ressources sensibles. Les différents types de secrets peuvent-etre :
- Passwords
- Certificats 
- Usernames 
- Tokens 
Toutes les secrets devront etre contenus dans un Vault qui sera mis a disposition pour l'ensemble des projets. Les objets contenus dans le Vault sont séparés par Namespace. 
 
## Liveness et Readiness

il est très important de mettre en place ces Checks, le plus efficace étant de faire des checks de l'application.
Cela peut-etre une fonctionnalité de l'application, une page d'un site web, une entrée en base de donnée.

``` YAML
        livenessProbe:
          httpGet:
            path: /
            port: 80
            httpHeaders:
          initialDelaySeconds: 3
          periodSeconds: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 3
          periodSeconds: 3
```

## SSL 

Plus longtemps la requete restera en HTTPS, plus elle sera sécurisée. 

Exemple du schéma de distribution de la requete. 

Users --HTTPS-> ReverseProxy --HTTPS-> Router Openshift --HTTPS-> Container   (Best Case)

Users --HTTPS-> ReverseProxy --HTTPS-> Router Openshift --HTTP-> Container   (Usual Case)

## HPA (Horizontal Pod Autoscaling)

Le scaling est très important afin de répondre aux besoins en termes de d'affluence. il est aujourd'hui un atout majeur pour avoir une application qui soit le plus disponible possible avec des performances élevées. Pour cela il est donc possible de définir des triggers afin d'upscale l'applicatif (CPU,Metrique Applicatif).

## QOS 

Il serait important de définir les consommations de chaque POD (prévisionnelles), Savoir si il serait intéressant que certains disposent d’une request égal a la limit afin d’assurer une réservation des ressources.

Exemple : 

```Yaml 
      limits:
        memory: "200Mi"
        cpu: "700m"
      requests:
        memory: "200Mi"
        cpu: "700m"
```

