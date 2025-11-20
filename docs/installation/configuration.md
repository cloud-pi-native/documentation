## Configuration

Une fois le dépôt socle cloné, lancez une première fois la commande suivante depuis votre environnement de déploiement :

```bash
ansible-playbook install.yaml
```

Elle vous signalera que vous n'avez encore jamais installé le socle sur votre cluster, puis vous invitera à modifier la ressource de scope cluster et de type **dsc** nommée **conf-dso** via la commande suivante :

```bash
kubectl edit dsc conf-dso
```

Vous pourrez procéder ainsi si vous le souhaitez, mais pour des raisons de traçabilité et de confort d'édition vous préférerez peut être déclarer la ressource `dsc` nommée `conf-dso` dans un fichier YAML, par exemple « ma-conf-dso.yaml », puis la créer via la commande suivante :

```bash
kubectl apply -f ma-conf-dso.yaml
```

Voici un **exemple** de fichier de configuration valide, à adapter à partir de la section **spec**, notamment au niveau du champ "global.rootDomain" (votre domaine principal précédé d'un point), des mots de passe de certains outils, du proxy ainsi que des sections CA et ingress :

```yaml
---
kind: DsoSocleConfig
apiVersion: cloud-pi-native.fr/v1alpha
metadata:
  name: conf-dso
spec:
  additionalsCA:
    - kind: ConfigMap
      name: kube-root-ca.crt
  exposedCA:
    type: configmap
    configmap:
      namespace: default
      name: ca-cert
      key: ingress.crt
  argocd:
    admin:
      enabled: true
      password: WeAreThePasswords
    values:
      image:
        registry: quay.io
        repository: argoproj/argocd
        tag: v2.7.6
  certmanager: {}
  cloudnativepg: {}
  console:
    dbPassword: AnotherPassBitesTheDust
    values: {}
  gitlab:
    values: {}
  gitlabOperator: {}
  gitlabRunner: {}
  global:
    environment: production
    projectsRootDir:
      - my-root-dir
      - projects-sub-dir
    rootDomain: .example.com
  harbor:
    adminPassword: WhoWantsToPassForever
    pvcRegistrySize: 50Gi
    values:
      nginx:
        image:
          repository: docker.io/goharbor/nginx-photon
          tag: v2.9.1
      portal:
        image:
          repository: docker.io/goharbor/harbor-portal
          tag: v2.9.1
      core:
        image:
          repository: docker.io/goharbor/harbor-core
          tag: v2.9.1
      jobservice:
        image:
          repository: docker.io/goharbor/harbor-jobservice
          tag: v2.9.1
      registry:
        registry:
          image:
            repository: docker.io/goharbor/registry-photon
            tag: v2.9.1
        controller:
          image:
            repository: docker.io/goharbor/harbor-registryctl
            tag: v2.9.1
      trivy:
        image:
          repository: docker.io/goharbor/trivy-adapter-photon
          tag: v2.9.1
      notary:
        server:
          image:
            repository: docker.io/goharbor/notary-server-photon
            tag: v2.9.1
        signer:
          image:
            repository: docker.io/goharbor/notary-signer-photon
            tag: v2.9.1
      database:
        internal:
          image:
            repository: docker.io/goharbor/harbor-db
            tag: v2.9.1
      redis:
        internal:
          image:
            repository: docker.io/goharbor/redis-photon
            tag: v2.9.1
      exporter:
        image:
          repository: docker.io/goharbor/harbor-exporter
          tag: v2.9.1
  ingress:
    annotations:
      route.openshift.io/termination: edge
    tls:
      type: tlsSecret
      tlsSecret:
        name: ingress-tls
        method: in-namespace
  keycloak:
    values:
      image:
        registry: docker.io
        repository: bitnami/keycloak
        tag: 19.0.3-debian-11-r22
  kubed: {}
  nexus:
    storageSize: 5Gi
  proxy:
    enabled: true
    host: 192.168.xx.xx
    http_proxy: http://192.168.xx.xx:3128/
    https_proxy: http://192.168.xx.xx:3128/
    no_proxy: .cluster.local,.svc,10.0.0.0/8,127.0.0.1,192.168.0.0/16,api.example.com,api-int.example.com,canary-openshift-ingress-canary.apps.example.com,console-openshift-console.apps.example.com,localhost,oauth-openshift.apps.example.com,svc.cluster.local,localdomain
    port: "3128"
  sonarqube:
    postgresPvcSize: 25Gi
    values:
      image:
        registry: docker.io
        repository: sonarqube
        edition: community
        tag: 9.9.2-{{ .Values.edition }}
  sops:
    values:
      image:
        tag: 0.11.0
  vault:
    values:
      injector:
        image:
          repository: docker.io/hashicorp/vault-k8s
          tag: 1.2.1
          pullPolicy: IfNotPresent
        agentImage:
          repository: docker.io/hashicorp/vault
          tag: 1.14.0
      server:
        image:
          repository: docker.io/hashicorp/vault
          tag: 1.14.0
          pullPolicy: IfNotPresent
        updateStrategyType: RollingUpdate
```

Les champs utilisables dans cette ressource de type **dsc** peuvent être décrits pour chaque outil à l'aide de la commande `kubectl explain`. Exemple avec argocd :

```
kubectl explain dsc.spec.argocd
```

## Utilisation de vos propres values

Comme nous pouvons le voir dans l'exemple de configuration fourni ci-dessus, plusieurs outils sont notamment configurés à l'aide d'un champ `values`.

Il s'agit de valeurs de chart [Helm](https://helm.sh/fr). Vous pouvez les utiliser ici pour surcharger les valeurs par défaut.

Voici les liens vers les documentations de chart Helm pour les outils concernés :

- [Argo CD](https://github.com/argoproj/argo-helm)
- [Console Cloud π Native](https://github.com/cloud-pi-native/console#readme)
- [GitLab](https://gitlab.com/gitlab-org/charts/gitlab)
- [Harbor](https://github.com/goharbor/harbor-helm)
- [Keycloak](https://github.com/bitnami/charts/tree/main/bitnami/keycloak)
- [SonarQube](https://github.com/SonarSource/helm-chart-sonarqube)
- [SOPS](https://github.com/isindir/sops-secrets-operator/tree/master/chart/helm3/sops-secrets-operator)
- [HashiCorp Vault](https://github.com/hashicorp/vault-helm)

S'agissant du gel des versions de charts ou d'images pour les outils en question, **nous vous invitons fortement à consulter la section détaillée [Gel des versions](#gel-des-versions)** située plus bas dans le présent document.
