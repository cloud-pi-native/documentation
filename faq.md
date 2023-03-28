# Foire aux questions

Cette section regroupe les questions fréquentes de nos clients

## Construction

### Comment puis-je déployer une image personnalisée

Toutes les images déployées sur l'offre Cloud π Native doit :
  - Etre construite par l'offre
  - Faire partie des repo publics autorisés (FIXME : préciser les repos)

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

### Puis-je pousser un binaire non construit par l'offre DSO ?

### Quelles sont les contraintes génériques d'Openshift par rapport à Kubernetes
  - Images rootless
  - Filesystem en lecture seule
  - Port d'écoute > 1024

## Déploiement

### Comment déployer une base postgreSQL via manifests 

Le fichier manifest suivant présente le déploiement d'un service [PostgreSQL](examples/postgres.yaml) à partir d'une image bitnami. Il peut servir de base pour un déploiement manuel d'une instance PostgreSQL. Pour un déploiement plus complexe, par exemple avec une gestion du clustering, il est préférable d'utiliser un déploiement par chart Helm pour par opérateur.

### Comment déployer une base postgreSQL via un chart Helm

### Comment déployer une base postgreSQL via un opérateur

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
  namespace: keycloak-system
spec:
  schedule: "0 6 * * *"
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

### Comment puis-je accéder aux logs de mon application

### Comment puis-je accéder aux métriques de mon application
