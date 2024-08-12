# Gestionnaire de sources

## Présentation

Pour stocker et gérer vos sources applicatifs, l'usine logicielle de l'offre Cloud π Native vous propose le service de gestionnaire de source **GitLab** en version communautaire.

Le principe de l'offre Cloud π Native est de laisser les projets autonomes sur leur chaine de construction sur les environnements de développement et notamment les outils utilisés. Ainsi, une équipe projet peut utiliser le gestionnaire de source qu'il souhaite en amont de l'offre Cloud π Native : Github, GitLab.com, Bitbucket, GitLab on premise, etc. et sur des dépôts de code publics ou privés. La seule contrainte est que ce gestionnaire soit **accessible depuis Internet** afin qu'il puisse être *copié* sur le GitLab de l'usine logicielle de l'offre Cloud π Native.

Dans la suite de cette page :
  - *dépôt externe* correspond au dépôt GIT externe à la plateforme Cloud π Native, et utilisé généreralement pour tester vos développement;
  - *dépôt interne* correspond à la copie du dépôt externe dans le service GitLab l'offre Cloud π Native;
  - *gitlab interne* correspond à l'instance GitLab de l'offre Cloud π Native.

![gitlab-synchro-repos](/img/repo-sync-01.png)

> la copie des dépôts externes vers le GitLab interne est piloté par le GitLab interne. Le flux de synchronisation *part* de l'instance GitLab interne.

## Import d'un dépôts externe depuis la Console DSO

La déclaration de dépôts externes à synchroniser se fait depuis la **Console** Cloud π Native, une fois le projet est crée. Les opérations suivantes sont réalisées par la Console DSO:
 - Création d'un groupe GitLab : <NOM_ORGANISATION>/<NOM_PROJET> sur le GitLab interne;
 - Attribution de droits d'administration sur le groupe GitLab <NOM_ORGANISATION>/<NOM_PROJET>à l'utilisateur qui crée le projet;
 - Création d'un dépôt vide correspondant au dépôt distant dans le groupe ci-dessus;
 - Création d'un dépôt "mirror" avec les informations de synchrnonisation permettant, de réaliser un mirroir du dépôt GIT externe vers le dépôt interne créé plus haut.

Les dépôts externes, sont synchronisés par la pipeline gitlab-ci du projet *mirror* correspondant. Le déclenchement de cette synchronisation est réalisé par un appel à un API Management ( voir la page de [FAQ](/agreement/faq) )

Une fois le projet applicatif est synchronisé, une pipeline gitlab-ci est lancé afin de construire le projet applicatif sur l'offre Cloud π Native.

![Principe de synchronisation](/img/repo-sync-02.png)

## Types de dépôts externes à synchroniser

Deux types de dépôts sont pris en comptes par l'offre Cloud π Native :

 - Dépôt applicatifs
 - Dépôt d'infrastructure applicatifs.

### Dépôts applicatifs et chaine de construction gitlab-ci

Les dépôts applicatifs contiennent le code source de vos applications.

Les projets présents sur la plateforme Cloud π Native sont paramétrés pour exécuter une pipeline gitlab-ci. Les informations de votre pipeline sont présentes dans le fichier **gitlab-ci-dso.yml** qui doit être présent à la racine de votre dépôt externe du projet. Pour vous aider à construire vos premiers pipeline GitLab, nous vous proposons dans la console de la plateforme Cloud π Native des templates pour vous aider à la construction de projets de différents langages (Java, nodejs, python, etc.). Ces templates sont directement paramétrés avec des variables prédéfinies liées au projet courant. Cependant, ils sont donnés à titre d'exemple et doivent être adaptés aux besoins réels de vos projets.

Les projets applicatifs sont analysés et construits et les images de conteneurs construits sont analysées, pui déposées dans le registry d'images de conteneurs qui est Harbor.

### Variables prédéfinies gitlab-ci DSO

Un certains nombres de variables pré-définies, en plus des variables standards de GitLab :

 - http_proxy, https_proxy, HTTP_PROXY et HTTPS_PROXY, PROXY_HOST, PROXY_PORT,  : paramètres liés au proxy de l'environnement.
 - MVN_CONFIG_FILE : fichier de configuration Maven avec le paramètrage pré-défini de l'environnement et du projet en cours, notamment pour le dépot d'artefact sur le repo Nexus.
 - NEXUS_HOST_URL : URL d'accès au dépôt Nexus (stockage d'artefacts)
 - NEXUS_HOSTNAME : Hostname du service Nexus
 - NO_PROXY : variable contenant les URL qui ne nécessitent pas de passer par le proxy
 - NPM_FILE : Fichier de configuration NPM pré-configuré pour l'environnement et le projet en cours
 - REGISTRY_URL : URL d'accès à l'instance Harbor (image repository)
 - SONAR_HOST_URL : URL d'accès à l'instance SonarQube (analyse de qualité statique)
 - VAULT_AUTH_PATH : PATH dans l'URL d'accès à VAULT pour l'authentification par jwt
 - VAULT_AUTH_ROLE : PATH dans l'URL d'accès à VAULT pour la récupération des roles depuis les appels de GitLab
 - VAULT_SERVER_URL : URL d'accès à l'instance Vault (gestionnaire de secrets)

### Dépôt source d'infrastructure applicatifs

Suivant les principes *GitOps*, les déploiements sur l'orchestrateur du conteneurs (Celui de la plateforme Cloud π Native ou le votre) sont pilotés par un dépôt de code git contenant les manifests kubernetes, des charts **Helm** ou  **Kustomize** . Ces dépôts de code sont nommés dépôts d'infrastructure permettent de déployer vos images de conteneurs, ainsi que vos objects kubernets (service, ingress, configmap ...)

Ces dépôts sources sont utilisés par ArgoCD afin de déployer l'infrastructure applictive sur Kubernetes. Votre application est déployé dans un namespace dédié au projet et automatiquement provisionné par la console de la plateforme Cloud π Native.

## Schéma de fonctionnement
Le schéma ci-dessous présente le fonctionnement général :

![gitlab-général](/img/gitlab.png)
