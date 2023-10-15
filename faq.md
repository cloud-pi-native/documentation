# Foire aux questions

Cette section regroupe les questions fréquentes de nos clients

## Construction

### Comment simuler les services S3, SSO, SMTP, etc sur les environnements OVH ?

Des bouchons sont proposés afin de simuler un serveur SMTP, création d'un bucket S3, SSO, etc.

La description de l'utilisation de ces bouchons est détaillée [ici](bouchons.md)


### Comment puis-je lancer la pipeline de synchronisation de mes repos depuis mes repos externes ?

Pour synchroniser le code tu peux suivre la procédure suivante.
Sur Gitlab:

- Aller sur ton projet
- Aller sur le dépôt mirror
- Dans la barre latérale gauche Build > Pipelines
- Cliquer en haut à droite de l'écran sur Run pipeline
- Ajouter comme valeur pour la variable PROJECT_NAME le nom du dépôt (dans le Gitlab) que tu souhaites synchroniser
- Ajouter la variable GIT_BRANCH_DEPLOY avec comme valeur la branche que tu souhaites synchroniser
- Cliquer sur Run pipeline

Sur argocd, dans App Details:
- il faut que tu changes le cluster de destination pour app1-integ (Selectionnez name pour voir le nom du cluster plutôt que URL).
- Vérifier la valeur de la la clé Path (path des manifests k8s).

### Comment puis-je déployer une image personnalisée ?

Toutes les images déployées sur l'offre Cloud π Native doivent :
  - Etre construite par l'offre
  - Faire partie des repo publics autorisés par exemple Bitnami (règle non encore mise en place)

Afin de construire une image personnalisée, il est nécessaire de créer un Dockerfile dans son repo de sources applicative et d'intégrer la construction de cette image dans l'étape de construction de l'application.


Extrait du gitlab-ci-dso.yml
```
build_docker_custom:
  variables:
    WORKING_DIR: 'images'
    IMAGE_NAME: 'image_custom_to_build'
    DOCKERFILE: 'Dockerfile-custom'
  stage: build-docker
  extends:
    - .kaniko:build
```

Fichier images/Dockerfile-custom dans le répertoire 
```
FROM alpine:edge

WORKDIR /tmp
RUN apk upgrade --update-cache --available 
[...]
CMD [ "command_to_execute"]
```

### Puis-je pousser directement un binaire non construit par l'offre DSO ?

Toutes les images et librairies utilisées sur l'offre Cloud π Native doivent être construites par la chaine DSO ou être disponibles sur les repos publics dont l'auteur est reconnu et autorisé (par exemple bitnami).

Il n'est pas possible d'uploader un binaire directement sur le gestionnaire d'artefacts (Nexus) en dehors de la chaine de construction DSO.

Ainsi, il est possible d'utiliser une image non construite sur DSO, par exemple, bitnami/postgresql, en revanche il est interdit d'utiliser my-nickname/postgresql ni de faire un docker push d'une image construite sur son poste.

### Quelles sont les contraintes génériques d'Openshift par rapport à Kubernetes ?
  - Les images doivent être rootless
  - Le root filesystem des images doit être en lecture seule à l'exception et seul les répertoire /tmp et /var/tmp sont en écriture 
  - Les ports d'écoute des PODs doivent être supérieurs à 1024

### J'ai une erreur de récupération des dépendances Java via Maven à cause d'un problème de certificat SSL:

Cette erreur apparait lors des appels internes au cluster qui ne reconnait pas les certificats présentés: 

Message d'erreur :
```
proxy: ProxyInfo{host='192.168.16.89', userName='null', port=3128, type='http', nonProxyHosts='null'} @ line 82, column 25: PKIX path building failed: sun.security.provider.certpath.SunCertPathBuilderException: unable to find valid certification path to requested target -> [Help 2]
```
Solution :
Ajouter dans le fichier .gitlab-ci.dso.yml la variable MAVEN_CLI_OPTS pour ignorer les erreurs de certificats

```
package-app:
  variables:
    BUILD_IMAGE_NAME: maven:3.8-openjdk-17
    WORKING_DIR: "."
    ARTEFACT_DIR: "target"
    MAVEN_OPTS: "-Dmaven.repo.local=$CI_PROJECT_DIR/.m2/repository"
    MAVEN_CLI_OPTS: " -Dmaven.wagon.http.ssl.insecure=true "
    MVN_CONFIG_FILE: $MVN_CONFIG
  stage: package-app
  extends:
    - .java:build
```


## Déploiement

### Comment déployer une base postgreSQL via manifests ?

Le fichier manifest suivant présente le déploiement d'un service [PostgreSQL](examples/postgres.yaml) à partir d'une image bitnami. Il peut servir de base pour un déploiement manuel d'une instance PostgreSQL. Pour un déploiement plus complexe, par exemple avec une gestion du clustering, il est préférable d'utiliser un déploiement par chart Helm pour par opérateur.

### Comment déployer une base postgreSQL via un chart Helm ?

L'utilisation de chart Helm est une autre solution pour déployer une base de données PostgreSQL pour son application. Helm permet de déclarer des dépendances vers d'autres charts Helm existants. Ainsi, il est possible de packager son application sous la forme d'un chart Helm et de déclarer une dépendances vers un chart de base de données postgreSQL.

Voici un exemple de déclaration de dépendances vers le chart Helm de PostgreSQL de Bitnami :
```
dependencies:
- name: postgresql
  version: "12.2.2"
  repository: "https://charts.bitnami.com/bitnami"
``` 

la configuration de chart Helm se fait 

Un exemple complet est présent sur le tutoriel de déploiement [dso-tuto-java-helm](https://github.com/dnum-mi/dso-tuto-java-helm.git)

### Comment déployer une base postgreSQL via un opérateur ?

## Exploitation

Questions concernant l'exploitabilité et l'observabilité des applications

### Comment puis-je déployer un backup postgreSQL à façon ?

Pour créer un backup "fonctionnel" sur une base postgres en plus des backup proposés par l'offre DSO, il est possible de procéder comme suit :
Création d'un CronJob avec 2 pods partageant le même volume :
  - Un container (initContainer) à partir d'une image postgres se connectant au service de base de données et réalisant le dump
  - Un container récupérant le dump et l'envoyant sur un stockage S3.  

Création d'un script d'upload de backup vers un stockage S3 (monté comme configMap)
```
#!/bin/sh

now=`date +"%Y_%m_%d_%H%M%S"`
year=`date +"%Y"`
day=`date +"%d"`
month=`date +"%m"`

for f in /backup/*.pgdump; do
  if test -f "$f"; then
    echo "upload file $f to s3://$BUCKET_NAME/${f}-${now}"

    aws --no-verify-ssl s3 cp $f s3://$BUCKET_NAME/${f}-${now} --endpoint-url https://${BUCKET_HOST}:${BUCKET_PORT}

    fi
done
```

Exemple de CronJob
```
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: my-namespace
spec:
  schedule: "0 6 * * *" #Tous les jours à 6h00 du matin
  [..]
  jobTemplate:
    spec:
      [..]
      template:
        spec:
          initContainers:
            - name: dump
              image: postgres:12.1-alpine
              volumeMounts:
                - name: data
                  mountPath: /backup
              args: ["pg_dump", "-Fc", "-f", "/backup/backup.pgdump", "-h", "postgresql-svc"]
              env:
                - name: PGPASSWORD
                  valueFrom:
                    secretKeyRef:
                      name: db-secret
                      key: POSTGRES_PASSWORD
          containers:
            - name: s3
              image: mesosphere/aws-cli
              volumeMounts:
                - name: data
                  mountPath: /backup
                - name: config-volume
                  mountPath: /backup-script
              envFrom:
              - configMapRef:
                  name: env-backup-S3
              command: ["/backup-script/backup-s3.sh"]
          restartPolicy: Never
          volumes:
            - name: config-volume
              configMap:
                name: backup-s3.sh
            - name: data
              emptyDir: {}
```

### Comment tester mon container en lecture seul ?

Afin de simuler la contraite de lecture seul d'openshift sur le container, il est possible de lancer le container en mode **read_only** via la commande docker suivantes:
```
docker run — read-only [image-name]
```

ou via docker compose avec le yaml suivant :
```
version: "3.9"
services:
  example:
    image: [image-name]
    read_only: true
```
### Comment puis-je accéder aux logs de mon application ?

### Comment puis-je accéder aux métriques de mon application ?
