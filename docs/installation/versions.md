# Gel des versions d'images

Comme indiqué précédemment, le gel des version d'images est géré par le champ `values` que vous pourrez spécifier, pour chaque outil concerné, dans la ressource `dsc` de configuration par défaut (`conf-dso`) ou votre propre `dsc`.

Ce champ correspond rigoureusement à ce qui est utilisable pour une version donnée du chart Helm de l'outil en question.

Lors d'une **première installation du socle**, nous vous recommandons de **ne pas geler immédiatement vos versions d'images dans la `dsc`**. En effet, le playbook et les roles associés installeront les dépôts Helm de chaque outil et utiliseront la version d'image qui correspond à la version du chart définie par défaut.

Ceci vous permettra ensuite d'utiliser la commande `helm` pour rechercher plus facilement les versions d'images disponibles et à quelles versions de charts elles sont associées.

Lorsque vous gelez vos images dans la `dsc`, il est **fortement recommandé** d'utiliser un tag d'image en adéquation avec la version de chart utilisée, tel que fourni par la commande `helm search repo -l nom-de-mon-outil-ici --version version-de-chart-ici`.

Lorsque vos values sont à jour **pour tous les outils concernés**, avec les versions d'images désirées, appliquez le changement en utilisant votre fichier de définition. Exemple :

```bash
kubectl apply -f ma-conf-dso.yaml
```

Puis relancez l'[Installation](#installation).

Les sections suivantes détaillent la façon de procéder au gel de version d'image pour chaque outil :
- [Gel des versions d'images](#gel-des-versions-dimages)
  - [Argo CD](#argo-cd)
  - [Cert-manager](#cert-manager)
  - [CloudNativePG](#cloudnativepg)
  - [Console Cloud π Native](#console-cloud-π-native)
  - [GitLab](#gitlab)
  - [GitLab Runner](#gitlab-runner)
  - [Harbor](#harbor)
  - [Keycloak](#keycloak)
  - [Kubed (config-syncer)](#kubed-config-syncer)
  - [Sonatype Nexus Repository](#sonatype-nexus-repository)
  - [SonarQube Community Edition](#sonarqube-community-edition)
  - [SOPS](#sops)
  - [Vault](#vault)

## Argo CD

Le composant Argo CD est installé à l'aide du chart Helm Bitnami.

Nous utiliserons un tag dit "[immutable](https://docs.bitnami.com/kubernetes/infrastructure/argo-cd/configuration/understand-rolling-immutable-tags)" (**recommandé en production**).

Les différents tags utilisables pour l'image d'Argo CD sont disponibles ici : <https://hub.docker.com/r/bitnami/argo-cd/tags>

Les tags dits "immutables" sont ceux qui possèdent un suffixe de type rXX, lequel correspond au numéro de révision. Ils pointent toujours vers la même image. Par exemple le tag "2.7.6-debian-11-r2" est un tag immutable.

Pour spécifier un tel tag, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple :

```yaml
  argocd:
    admin:
      enabled: true
      password: WeAreThePasswords
    values:
      image:
        registry: docker.io
        repository: bitnami/argo-cd
        tag: 2.7.6-debian-11-r2
        imagePullPolicy: IfNotPresent
```

Pour mémoire, les values utilisables sont disponibles ici : <https://github.com/bitnami/charts/blob/main/bitnami/argo-cd/values.yaml>

Les releases d'Argo CD et leurs changelogs se trouvent ici : <https://github.com/argoproj/argo-cd/releases>

## Cert-manager

La version d'image utilisée par cert-manager est directement liée à la version de chart déployée. Elle est donc déjà gelée par défaut.

Il est recommandé de ne pas modifier cette version de chart, sauf si vous savez ce que vous faites.

## CloudNativePG

Comme avec cert-manager, il existe une correspondance biunivoque entre la version de chart utilisée et la version d'application ("APP VERSION") de l'opérateur.

Ainsi, spécifier une version de chart est suffisant pour geler la version d'image au niveau de l'opérateur.

Il est recommandé de ne pas modifier cette version de chart, sauf si vous savez ce que vous faites.

Comme indiqué dans sa [documentation officielle](https://cloudnative-pg.io/documentation/1.20/quickstart/#part-3-deploy-a-postgresql-cluster), par défaut CloudNativePG installera la dernière version mineure disponible de la dernière version majeure de PostgreSQL au moment de la publication de l'opérateur.

De plus, comme l'indique la [FAQ officielle](https://cloudnative-pg.io/documentation/1.20/faq/), CloudNativePG utilise des conteneurs d'application immutables. Cela signifie que le conteneur ne sera pas modifié durant tout son cycle de vie (aucun patch, aucune mise à jour ni changement de configuration).

## Console Cloud π Native

La version d'image utilisée par la Console Cloud π Native est directement liée à la version de chart déployée. Elle est donc déjà gelée par défaut.

Il est recommandé de ne pas modifier cette version de chart, sauf si vous savez ce que vous faites.

## GitLab

La version d'image utilisée par GitLab est directement liée à la version de chart déployée. Elle est donc déjà gelée par défaut.

Par ailleurs le chart Helm de GitLab est déployé via l'opérateur GitLab, lui même déployé via Helm.

Il existe ainsi une correspondance directe entre la version de chart utilisée pour déployer l'opérateur et les versions de charts GitLab que cet opérateur sera en mesure d'installer.

Cette correspondance est fournie par la page de documentation suivante :

https://gitlab.com/gitlab-org/cloud-native/gitlab-operator/-/tags

Dans le même ordre d'idée, une version de chart GitLab correspond à une version d'instance GitLab.

La correspondance entre versions de charts GitLab et versions d'instances GitLab est fournie par la page de documentation suivante :

https://docs.gitlab.com/charts/installation/version_mappings.html

Il est donc recommandé de ne pas modifier les versions de charts déjà fixées au moment de la sortie du socle, sauf si vous savez ce que vous faites. Dans le cas où vous souhaiteriez les modifier, gardez à l'esprit les correspondances signalées précédemment, entre version du chart de l'opérateur et versions de chart GitLab qu'il peut installer.

## GitLab Runner

La version d'image utilisée par GitLab Runner est directement liée à la version de chart déployée. Elle est donc déjà gelée par défaut.

Il est recommandé de ne pas modifier cette version de chart, sauf si vous savez ce que vous faites.

Si toutefois vous souhaitez la modifier, sachez que la version majeure.mineure de l'instance GitLab Runner doit idéalement correspondre à celle de l'instance GitLab, comme expliqué ici :

https://docs.gitlab.com/runner/#gitlab-runner-versions

## Harbor

Fixer le numéro de version du chart Helm sera normalement suffisant pour fixer aussi le numéro de version des images associées. Le numéro de version de ces images sera celui visible dans la colonne "APP VERSION" de la commande `helm search repo -l harbor/harbor`.

Il est toutefois possible de fixer les versions d'images pour Harbor de façon plus fine (**recommandé en production**).

Il sera ainsi possible de fixer l'image de chacun des composants.

Les différents tags utilisables sont disponibles ici :

- nginx : <https://hub.docker.com/r/goharbor/nginx-photon/tags>
- portal : <https://hub.docker.com/r/goharbor/harbor-portal/tags>
- core : <https://hub.docker.com/r/goharbor/harbor-core/tags>
- jobservice : <https://hub.docker.com/r/goharbor/harbor-jobservice/tags>
- registry (registry) : <https://hub.docker.com/r/goharbor/registry-photon/tags>
- registry (controller) : <https://hub.docker.com/r/goharbor/harbor-registryctl/tags>
- trivy : <https://hub.docker.com/r/goharbor/trivy-adapter-photon/tags>
- notary (server) : <https://hub.docker.com/r/goharbor/notary-server-photon/tags>
- notary (signer) : <https://hub.docker.com/r/goharbor/notary-signer-photon/tags>
- database : <https://hub.docker.com/r/goharbor/harbor-db/tags>
- redis : <https://hub.docker.com/r/goharbor/redis-photon/tags>
- exporter : <https://hub.docker.com/r/goharbor/harbor-exporter/tags>

**Rappel** : Il est néanmoins recommandé de positionner des tags d'images en adéquation avec la version du chart Helm utilisée et documentée dans le fichier [versions](https://github.com/cloud-pi-native/socle/versions), situé à la racine du socle, c'est à dire d'utiliser le numéro "APP VERSION" retourné par la commande `helm search repo -l harbor/harbor --version numero-de-version-de-chart`.

Pour spécifier nos tags, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple, pour la version 1.13.1 du chart :

```yaml
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
```

Pour mémoire, les values utilisables sont disponibles et documentées ici : <https://github.com/goharbor/harbor-helm/tree/master>

## Keycloak

Le composant Keycloak est installé à l'aide du chart Helm Bitnami.

Nous utiliserons un tag dit "[immutable](https://docs.bitnami.com/kubernetes/apps/keycloak/configuration/understand-rolling-immutable-tags/)" (**recommandé en production**).

Les différents tags utilisables pour l'image de Keycloak sont disponibles ici : <https://hub.docker.com/r/bitnami/keycloak/tags>

Les tags dits "immutables" sont ceux qui possèdent un suffixe de type rXX, lequel correspond au numéro de révision. Ils pointent toujours vers la même image. Par exemple le tag "19.0.3-debian-11-r22" est un tag immutable.

Pour spécifier un tel tag, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple :

```yaml
  keycloak:
    values:
      image:
        registry: docker.io
        repository: bitnami/keycloak
        tag: 19.0.3-debian-11-r22
```

Pour mémoire, les values utilisables sont disponibles ici : <https://github.com/bitnami/charts/blob/main/bitnami/keycloak/values.yaml>

Les release notes de Keycloak se trouvent ici : <https://github.com/keycloak/keycloak/releases>

## Kubed (config-syncer)

La version d'image utilisée par Kubed est directement liée à la version de chart déployée. Elle est donc déjà gelée par défaut.

Il est recommandé de ne pas modifier cette version de chart, sauf si vous savez ce que vous faites.

## Sonatype Nexus Repository

Le composant nexus est installé directement via le manifest de deployment « nexus.yml.j2 » intégré au role associé.

L'image utilisée est déjà gelée. Son numéro de version est spécifié dans le fichier [versions](https://github.com/cloud-pi-native/socle/versions) situé à la racine du socle.

Il est recommandé de ne pas modifier cette version, sauf si vous savez ce que vous faites.

Si toutefois vous souhaitez la modifier, les tags d'images utilisables sont disponibles ici : <https://hub.docker.com/r/sonatype/nexus3/tags>

Pour déployer une autre version, il suffira d'éditer la `dsc`, de préférence avec le fichier YAML que vous avez initialement utilisé pendant l'installation, puis modifier la section suivante en y indiquant la version d'image désirée au niveau du paramètre **imageTag**. Exemple :

```yaml
  nexus:
    storageSize: 25Gi
    imageTag: 3.56.0
```

## SonarQube Community Edition

Le composant SonarQube est installé via son [chart Helm officiel](https://github.com/SonarSource/helm-chart-sonarqube/tree/master/charts/sonarqube).

Les tags d'images utilisables sont ceux retournés par la commande suivante, au niveau de la colonne "APP VERSION" :

```bash
helm search repo -l sonarqube/sonarqube
```

Il faudra juste leur ajouter le suffixe "-community" qui correspond à l'édition utilisée, ou bien le suffixe <code v-pre>-{{ .Values.edition }}</code> si nous précisons aussi l'édition dans nos values.

Pour spécifier un tel tag, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple :

```yaml
  sonarqube:
    postgresPvcSize: 25Gi
    values:
      image:
        registry: docker.io
        repository: sonarqube
        edition: community
        tag: 9.9.2-{{ .Values.edition }}
```

## SOPS

Fixer la version d'image de SOPS sera **recommandé en production**.

Pour spécifier cette version d'image, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple :

```yaml
  sops:
    namespace: mynamespace-sops
    values:
      image:
        tag: 0.11.0
```

Pour mémoire, les values utilisables sont disponibles et documentées ici : <https://github.com/isindir/sops-secrets-operator/tree/master/chart/helm3/sops-secrets-operator>

Les numéros de version de chart Helm et d'image se trouvent ici : <https://github.com/isindir/sops-secrets-operator/blob/master/README#versioning>

S'agissant de l'image, ces numéros correspondent à la colonne "Operator".

Il est également possible de les retrouver via la commande de recherche dans vos dépôts Helm vue précédemment :

```bash
helm search repo -l sops/sops-secrets-operator
```

Ceci à condition que vos dépôts soient à jour.

## Vault

Fixer les versions d'images de Vault est **recommandé en production**.

Les values utilisables sont disponibles et documentées ici : <https://developer.hashicorp.com/vault/docs/platform/k8s/helm/configuration>

Il sera possible de fixer l'image :
- du Vault Agent Sidecar Injector (via le repository hashicorp/vault-k8s),
- du Vault Agent (via le repository hashicorp/vault).

Les différents tags d'images utilisables sont disponibles ici :
- Pour le Vault Agent Sidecar Injector : <https://hub.docker.com/r/hashicorp/vault-k8s/tags>
- Pour le Vault Agent : <https://hub.docker.com/r/hashicorp/vault/tags>

Pour spécifier nos tags, il nous suffira d'éditer la ressource `dsc` de configuration (par défaut ce sera la `dsc` nommée `conf-dso`) et de surcharger les "values" correspondantes du chart Helm, en ajoutant celles dont nous avons besoin. Exemple :

```yaml
  vault:
    values:
      injector:
        image:
          repository: "docker.io/hashicorp/vault-k8s"
          tag: "1.2.1"
          pullPolicy: IfNotPresent
        agentImage:
          repository: "docker.io/hashicorp/vault"
          tag: "1.14.0"
      server:
        image:
          repository: "docker.io/hashicorp/vault"
          tag: "1.14.0"
          pullPolicy: IfNotPresent
        updateStrategyType: "RollingUpdate"
```

**Remarque importante** : En cas de tentative de mise à jour des versions d'images, dans la section `server` de vos values, le paramètre `updateStrategyType` doit impérativement être présent et positionné sur "RollingUpdate" pour que l'image du serveur Vault puisse éventuellement se mettre à jour avec le tag que vous avez indiqué.