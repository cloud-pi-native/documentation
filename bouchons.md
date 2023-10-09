# Bouchons

Un chart Helm a été créé afin de permettre aux projets clients de l'offre Cloud Pi Native de simuler ou remplacer les éléments fournis par l'infrastructure du MI à savoir :
 - Un serveur SMTP pour les envois de mails
 - La création d'un bucket S3
 - Le SSO *Passage2*

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

Le chart helm sur github contient un fichier *values.yaml* contenant l'ensemble des valeurs paramétrables et un second fichier *custom-values.yaml* contenant uniquement les valeurs importantes comme l'activation du S3 et du SMTP. Une fois le projet importé via la console, il est possible, en tant que projet de modifier le fichier custom-values.yaml directement depuis le gitlab DSO et éviter de modifier les paramètres depuis ArgoCD. Dans ce cas, il faut déclarer le fichier custom-values.yaml dans les paramètres ArgoCD.

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
    tag: "v1.0.1"
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
#    hostOverride: mailhog.example.com

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

  podLabels:
    app: bouchon-smtp
    env: ovh
    tier: bouchon
    criticality: low
    component: smtp

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

Le chart permet d'activer un bouchon Passage2 permettant de simulé le mécanisme d'authentification SSO du ministère de l'intérieur.

Le mécanisme du bouchon d'authentification repose sur un **Reverse proxy** authentifiant et d'un keycloak en SAML ajoutant au requete entrante des headers contenant les roles/groups de l'utilisateur authentifié.

**Le reverse proxy authentificant devra intercepter l'ensemble des requetes necessitant une authentifiation**

Le chart permet d'ajouter les composants nécessaire à la mise en place de ce bouchon.

```
passage2:
  # Active ou non le bouchon
  enabled: true
  reverseproxy:
    # Url de l'ingress du reverse proxy authentifiant
    hostname: mellon.example.com
    proxy:
      #Valeur des headers ajouté par MELLON
      headers: |-

        #Ajout de header Mellon-NameID avec le nom de l'utilisateur connecté
        RequestHeader set Mellon-NameID %{MELLON_NAME_ID}e
        Header set Mellon-NameID %{MELLON_NAME_ID}e

        #Ajout de header Mellon-Groups avec les groupes de l'utilisateur connecté
        RequestHeader set Mellon-Groups %{MELLON_groups}e
        Header set Mellon-Groups %{MELLON_groups}e

        #Ajout de header Mellon-Role avec les roles de l'utilisateur connecté
        RequestHeader set Mellon-Role %{MELLON_Role}e
        Header set Mellon-Role %{MELLON_Role}e

      rules: |-
        # Exemple de redirection vers différents services applicatifs base sur le suffix, il est possible d'utiliser les différentes directive apache
        ProxyPassMatch    "^/(.*)" "http://whoami-svc:8080/$1"
        ProxyPassReverse  "^/(.*)" "http://whoami-svc:8080/$1"
        # il est possible d'avoir plusieur service de redirection
        ProxyPass /my-service2 "http://whoami3-svc:80"
        ProxyPassReverse /my-service2 "http://whoami3-svc:80"

  mockpassage2:
    # Url d'accès au keycloak pour la gestion des utilisateurs/droits
    hostname: passage2.example.com
    # Login du user admin
    adminLogin: admin
    # Password du user admin
    adminPassword: OZJFejfrejijIZJijfeij
```

Il faudra configuré le RPA pour renvoyer vers vos service applicatifs en modifiant le bloc **rules** afin que celui-ci rajoute les headers.
Une fois les composants déployé, l'authentification se fera par keycloak, un compte utilisateur d'exemple est crée test/test, avec aucun roles ou groupes.

Dans le cas ou l'utilisateur possède plusieurs roles/groupes ceux-ci seront sépéraré par une **,**
