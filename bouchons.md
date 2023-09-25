# Bouchons sur les environnements hors MI

Un chart Helm a été créé afin de permettre aux projets clients de l'offre Cloud Pi Native de simuler ou remplacer les éléments fournis par l'infrastructure du MI à savoir :
 - Un serveur SMTP pour les envois de mails
 - La création d'un bucket S3
 - Le SSO *Passage2* (à venir)

Le chart Helm est disponible sur le [repo github public](https://github.com/cloud-pi-native/helm-projects-mocks)  

## Utilisation

Ces éléments sont à utiliser uniquement sur les environnements **Hors ministère de l'intérieur**, ainsi il est préférable de ne pas les ajouter dans le repo d'infra de l'application à déployer mais *à côté*.

Ainsi, pour utiliser ce chart HELM, il faut, depuis la console DSO, ajouter un nouveau Dépôt sur un projet existant, choisir comme nom de repo "bouchon" et comme URL : https://github.com/cloud-pi-native/helm-projects-mocks.git et cocher la *case Dépôt d'infrastructure* :

![Ajout du repo bouchon](/img/bouchons/ajout-repo.png)

Une fois le projet ajouté, il est présent sur gitlab et une nouvelle application est créée sur ArgoCD :

![Ajout du repo bouchon](/img/bouchons/bouchons-argo.png)

Aller dans App Details :
![Ajout du repo bouchon](/img/bouchons/bouchons-argo-app-details.png)
Modifier le cluster de destination (comme pour l'application)

Puis aller sur l'onglet PARAMETERS:
![Ajout du repo bouchon](/img/bouchons/bouchons-argo-parameters.png)

Cliquez en haut à droite sur le bouton EDIT et adapter le paramétrage en fonction de ses besoins. Voir le détail dans la description des bouchons dans les chapitres suivants.

## Description des bouchons

### Serveur SMTP

Le chart Helm installe un serveur mailhog sur les ports 8025 (IHM Web) et 1025 (port SMTP).
La configuration s'effectue dans le fichier values.yaml dans la sous l'entrée racine "smtp"

Voici la configuration par defaut présente dans le fichier values.yaml du chart
```
smtp:
  # Active ou non l'installation du serveur SMTP
  enabled: true
  # Référence vers l'image mailhog sur docker.io
  image:
    repository: docker.io/mailhog/mailhog
    tag: "latest"
    pullPolicy: IfNotPresent

  nameOverride: ""
  fullnameOverride: ""

  containerPort:
    http:
      name: http
      port: 8025
    smtp:
      name: tcp-smtp
      port: 1025

  service:
    annotations: {}
    # Named target ports are not supported by GCE health checks, so when deploying on GKE
    # and exposing it via GCE ingress, the health checks fail and the load balancer returns a 502.
    namedTargetPort: true
    port:
      http: 8025
      smtp: 1025

  ingress:
    enabled: true
    # ingressClassName: nginx
    annotations: {}
      # kubernetes.io/ingress.class: nginx
      # kubernetes.io/tls-acme: "true"
    labels: {}
    host: mailhog.example.com

  auth:
    enabled: true
    existingSecret: ""
    fileName: auth.txt
    fileContents: "Ym9iOiQyYSQwNCRRN1VwdmQvWUlwck5DcExsUHpFQ2VlRnZrVlI1RVhKbG1uZjZ4S050ZHlXSnJoeW1hNUhlaQ==" # format user:password (où password est bcrypted) le tout en base64

  # JSON file defining outgoing SMTP servers
  outgoingSMTP:
    enabled: false
    existingSecret: ""
    fileName: outgoing-smtp.json
    fileContents: {}
      # See https://github.com/mailhog/MailHog/blob/master/docs/CONFIG.md#outgoing-smtp-configuration
      # Only name, host and port are required.
      #
      # server_name1:
      #   name: "server_name1"
      #   host: "mail.example.com"
      #   port: "25"    # NOTE: go requires this port number to be a string... otherwise the container won't start
      #   email: ""
      #   username: ""
      #  password: ""
      #  mechanism: "PLAIN|CRAM-MD5"
      # server_name2:
      #   name: "server_name2"
      #   host: "mail2.example.com"
      #   port: "587"   # NOTE: go requires this port number to be a string... otherwise the container won't start

  podReplicas: 1

  podAnnotations: {}

  podLabels: {}

  extraEnv: []

  # ref: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes
  livenessProbe:
    initialDelaySeconds: 10
    timeoutSeconds: 1

  resources: 
    # We usually recommend not to specify default resources and to leave this as a conscious
    # choice for the user. This also increases chances charts run on environments with little
    # resources, such as Minikube. If you do want to specify resources, uncomment the following
    # lines, adjust them as necessary, and remove the curly braces after 'resources:'.
    limits:
      cpu: 100m
      memory: 64Mi
    requests:
      cpu: 100m
      memory: 64Mi
```

### Bucket S3

Le chart permet également de créer un bucket de stockage objet S3.

```
s3:
  # Active ou non la création d'un bucket
  enabled: true
  # Nom du bucket
  bucketName: my-bucket
  # Bucket class et storage classe. Ne pas modifier sans demande de la Service Team
  bucketclass: noobaa-default-bucket-class
  storageClassName: openshift-storage.noobaa.io
```

Le chart dans cette configuration va créer sur le namespace :
 - Un bucket S3 nommé my-bucket (paramètre bucketName)
 - Un secret nommé my-bucket (paramètre bucketName) contenant 2 clés **AWS_ACCESS_KEY_ID** et **AWS_SECRET_ACCESS_KEY** pour se connecter au bucket
 - Une configMap nommée my-bucket (paramètre bucketName) contenant les informations de connexion : 
   - BUCKET_HOST: s3.openshift-storage.svc
   - BUCKET_NAME: my-bucket-49211a12-307c-4da9-8236-9b9eb0fc874f
   - BUCKET_PORT: "443"
   - BUCKET_REGION: ""
   - BUCKET_SUBREGION: ""
 
Pour utiliser ces variables sur un pod, il faut injecter cette configuration comme cela:

```
[...]
      containers:
          [...]
          envFrom:
          - configMapRef:
              name: my-bucket
          - secretRef:
              name: my-bucket
[...]
```

### Passage2

Passage2 est le système SSO du ministère de l'intérieur. TODO