# Bonnes pratiques

## Applicatifs

Une application Cloud π Native doit respecter les [Twelve-Factor](https://12factor.net/fr/)

D'autres bonnes pratiques à respecter impérativement :

1. Base de code

    Le code de l'application et de l'infrastructure doit être **versionné** dans un dépôt de source de type **Git** (Public/Privée) **accessible depuis internet**.

2. Dépendances

    __TOUTES__ dépendances nécessaires à la construction de l'application (Libraries,Images, ...) doivent provenir des dépôts de librairies connues tels que Maven, Composer et Node. Il est aussi possible de construire les dépendances par l'offre Cloud π Native et les déposer dans son gestionnaire d'artefact.

3. Configuration / Service Externe

    __TOUTES__ la configuration applicative pouvant être amenée à être modifié, par exemple la configuration entre deux environnements applicatifs la plupart du temps différente. Elle doit donc être injectée par des variables d'environnement au runtime ou via un fichier de configuration dynamique via une ConfigMap

4. Port

    Afin de respecter les préconisations de sécurité, les applications déployées doivent écouter sur des ports > 1024.

6. Logs

    L'application __NE DOIT PAS__ écrire dans un fichier de logs spécifique, mais écrire l'ensemble de ces logs dans la sortie standards (stdout) au format GELF ou à défaut JSON.

    Les logs seront accessibles plus facilement de cette manière depuis les outils de supervisions.

7. Processus

    Les applications doivent être __STATELESS__, si des données de session/cache doivent être utilisés et partagé par l'application alors elles doivent faire l'objet d'un service externe prévus à cet effet tel que Redis.

8. Processus d’administration

    Les opérations d'administrations doivent être faites via des initContainer (Init/Migration bdd, ...) ou des CronJob (Backup bdd, ...) [FAQ](/agreement/faq)

L'ensemble de ces bonnes pratiques sont détaillés dans la documentation OpenShift [ici](https://docs.openshift.com/container-platform/4.12/openshift_images/create-images.html)

## Architectures

L'application déployée doit être conteneurisée (sous la forme d'un ou plusieurs conteneurs).
  - Les __Dockerfiles__ doivent être dans le dépôt pour permettre à la chaine de reconstruire l'application.
  - Les images de bases des __Dockerfiles__ doivent être accessibles publiquement ou reconstuite par l'offre Cloud π Native .
  - Les images doivent être __rootless__, l'utilisateur qui lance le processus au sein du conteneur ne doit pas être `root`.
  - L'utilisateur lançant le processus dans le conteneur doit avoir les droits adéquats en lecture / écriture sur le système de fichiers si l'application doit manipuler ce dernier.
  - Des sondes de "Readiness"/"Liveness" doivent être implémentées.
  - Des limits/requests doivent etre mise en place.

## Déploiement

L'application doit se déployer à l'aide de fichiers d'__Infrastructure As Code__ :
 - Utiliser des manifestes [kubernetes](https://kubernetes.io/) avec Kustomize pour variabliser vos manifestes (cf. [tutoriels](/guide/tutorials))
 - Utiliser des charts [helm](https://helm.sh/) (cf. [tutoriels](/guide/tutorials) pour avoir des exemples de fichiers).
 - Utiliser [Kustomize](https://kustomize.io/)

## Labels

Les ressources doivent comporter des labels permettant de les identifier. Ils peuvent être décomposés de la façon suivante :

``` Yaml
App : " "
Env : " "
Tier : " "
Criticality : " "
Component : " "
```

Dans le cadre de l'offre de services du MIOM, il sera demandé d'ajouter les labels suivants sur vos ressources kubernetes :

### Type d'environnement

Ajouter un label `env: <element>` où `element` est un élément de la liste suivante :

- dev
- formation
- qualif
- test
- preprod
- prod

### Tiers

Ajouter un label `tier: <element>` où `element` est un élément de la liste suivante :

- frontend
- backend
- db
- cache
- auth

### Criticité

Ajouter un label `criticality: <element>` où `element` est un élément de la liste suivante :

- high
- medium
- low

### Composant

Ajouter un label `component: <element>` où `element` est un élément de la liste suivante :

- web :
	- nginx
	- apache
	- caddy
	- tomcat

- defaults :
	- python
	- node
	- openjdk
	- golang
	- php
	- ruby
	- perl
	- drupal
	- java

- database : 
	- postgres
	- mariadb
	- mysql
	- mongo
	- cassandra
	- cockroach
	- influx
	- etcd

- caching :
	- varnish
	- redis
	- memcached

- broker :
	- rabbitmq
	- kafka
	- apachemq
	- kubemq

- others :
	- busybox

## Tag d'images

Les images poussées dans le registry devront être unique et identifiés via un Sha ou Short-Sha qui pourrait être lié au commit Git. Grace à cela une gestion des releases et un rollback seront possibles.

Exemple de valeur pour le Tag de l'image :

```
CI_COMMIT_SHA
CI_COMMIT_SHORT_SHA
CI_COMMIT_TAG
CI_JOB_ID
```

## Politiques de nommage

Les noms de toutes les ressources Openshift ne doivent jamais être trop longs, il est donc conseillé de choisir des noms courts.
Il se pourrait que des ressources ne soient pas déployées si le nom est trop long.
Côté exploitation, cela facilite grandement la gestion.

Exemple :

```
Service : env-ms-svc
Deployment : env-ms-dep
Statefulset : env-ms-sts
ConfigMap : env-ms-cm
Secret : env-secret
CronJob : env-name-cj
Route : env-route
PVC : env-name-pvc
```

## Secrets

Les secrets comportent toutes les informations sensibles. Les différents types de secrets peuvent être :

- Passwords
- Certificats
- Usernames
- Tokens

Tous les secrets devront être contenus dans un Vault qui sera mis a disposition pour l'ensemble des projets. Les objets contenus dans le Vault sont séparés par projets (NS).

## Liveness et Readiness

Il est très important de mettre en place ces checks afin de vérifier l'état de vos applications. Ceci est nécessaire pour assurer la haute disponibilité et la résilience de vos applications.
Cela peut-être une fonctionnalité de l'application, une page d'un site web, une entrée en base de données, etc.

``` Yaml
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

Afin d'optimiser un flux sécurisé, il est préférable que cela soit de bout en bout.

Exemple du schéma de distribution de la requête.

Users --HTTPS-> ReverseProxy --HTTPS-> Ingress Kubernetes --HTTPS-> Container   (Best Case)

Users --HTTPS-> ReverseProxy --HTTPS-> Ingress Kubernetes --HTTP-> Container   (Usual Case)

## HPA (Horizontal Pod Autoscaling)

Le scaling est très important afin de répondre aux besoins en termes d'affluence. Il est aujourd'hui un atout majeur pour avoir une application qui soit le plus disponible possible avec des performances élevées. Pour cela il est donc possible de définir des triggers afin d'upscale l'applicatif (CPU, RAM, Métriques Applicatives).

## QOS

Il est important de définir les consommations de chaque POD (prévisionnelles), savoir si il serait intéressant que certains disposent d’une "request" égal a la "limit" afin d’assurer une réservation des ressources. (Guaranteed Class)
L'utilisation du "Burstable" n'est pas une bonne pratique. Il est vraiment nécessaire d'avoir une "limit" même si celle-ci n'est pas équivalente a la "request".

Exemple :

```Yaml
limits:
  memory: "200Mi"
  cpu: "700m"
requests:
  memory: "200Mi"
  cpu: "700m"
```

## Taille des images

Il est très important de construire des images les plus légères possibles, c'est à dire utiliser uniquement les paquets nécessaires au bon fonctionnement de l'application ainsi que la meilleure image de base.
C'est un gros vecteur de sécurité, de charge stockage et réseau.

Exemple d'image base Lightway : Alpine

## Politiques réseau

Les "Network policies" sont par défaut en "Deny ALL". Il est donc à vous de définir les flux entrants et sortants sur les namespaces de vos projets.

ReverseProxy-->Networkpolicies-->Pods (Ingress)

Pods-->Networkpolicies-->Proxy (Egress)

```Yaml

kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: web-allow-external
spec:
  podSelector:
    matchLabels:
      Tier: frontend
  ingress:
  - ports:
    - port: 80
```
