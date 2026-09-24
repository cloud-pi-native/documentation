# Gestionnaire de sources

## Présentation

Pour stocker et gérer vos sources applicatives, l'usine logicielle de l'offre Cloud π Native vous propose le service de gestion de sources **GitLab** en version communautaire.

Le principe de l'offre Cloud π Native est de laisser les projets autonomes quant à leur chaîne de construction, leurs environnements de développement et, notamment, les outils utilisés. Ainsi, une équipe projet peut utiliser le gestionnaire de sources qu'elle souhaite en amont de l'offre Cloud π Native : GitHub, GitLab.com, Bitbucket, GitLab on-premise, etc., sur des dépôts de code publics ou privés. La seule contrainte est que ce gestionnaire soit **accessible depuis Internet** afin que son contenu puisse être *copié* sur le GitLab de l'usine logicielle de l'offre Cloud π Native.

Dans la suite de cette page :
  - *dépôt externe* désigne le dépôt Git externe à la plateforme Cloud π Native, généralement utilisé pour tester vos développements ;
  - *dépôt interne* désigne la copie du dépôt externe dans le service GitLab de l'offre Cloud π Native ;
  - *GitLab interne* désigne l'instance GitLab de l'offre Cloud π Native.

![gitlab-synchro-repos](/img/repo-sync-01.png)

> La copie des dépôts externes vers le GitLab interne est pilotée par celui-ci. Le flux de synchronisation *part* de l'instance GitLab interne.

## Import d'un dépôt externe depuis la Console DSO

La déclaration des dépôts externes à synchroniser se fait depuis la **Console** Cloud π Native, une fois que le projet est créé. Les opérations suivantes sont réalisées par la Console DSO :
 - Création d'un groupe GitLab : <NOM_ORGANISATION>/<NOM_PROJET> sur le GitLab interne ;
 - Attribution de droits d'administration sur le groupe GitLab <NOM_ORGANISATION>/<NOM_PROJET> à l'utilisateur qui crée le projet ;
 - Création d'un dépôt vide correspondant au dépôt distant dans le groupe ci-dessus ;
 - Création d'un dépôt « miroir » avec les informations de synchronisation permettant de copier le dépôt Git externe vers le dépôt interne créé précédemment.

Les dépôts externes sont synchronisés par le pipeline GitLab CI du projet *mirror* correspondant. Le déclenchement de cette synchronisation est réalisé par un appel à l'API Management (voir la page de [FAQ](/agreement/faq)).

Une fois le projet applicatif synchronisé, un pipeline GitLab CI est lancé afin de construire le projet applicatif sur l'offre Cloud π Native.

### Synchronisation ciblée

Lors d'une synchronisation ciblée (« Synchroniser une branche cible »), la branche sélectionnée est mémorisée pour chaque dépôt externe. Elle est proposée par défaut lors de la prochaine synchronisation ciblée de ce dépôt. La synchronisation complète d'un dépôt (bouton « Synchroniser toutes les branches » activé) ne modifie pas cette branche mémorisée.

![Principe de synchronisation](/img/repo-sync-02.png)

## Types de dépôts externes à synchroniser

Deux types de dépôts sont pris en compte par l'offre Cloud π Native :

 - Dépôts applicatifs ;
 - Dépôts d'infrastructure applicative.

### Dépôts applicatifs et chaîne de construction GitLab CI

Les dépôts applicatifs contiennent le code source de vos applications.

Les projets présents sur la plateforme Cloud π Native sont paramétrés pour exécuter un pipeline GitLab CI. Les informations de votre pipeline sont présentes dans le fichier **gitlab-ci-dso.yml**, qui doit être présent à la racine du dépôt externe de votre projet. Pour vous aider à construire vos premiers pipelines GitLab, nous vous proposons, dans la Console de la plateforme Cloud π Native, des modèles pour vous accompagner dans la construction de projets dans différents langages de programmation (Java, Node.js, Python, etc.). Ces modèles sont directement paramétrés avec des variables prédéfinies liées au projet courant. Cependant, ils sont donnés à titre d'exemple et doivent être adaptés aux besoins réels de vos projets.

Les projets applicatifs sont analysés et construits, et les images de conteneurs construites sont analysées, puis déposées dans le registre d'images de conteneurs Harbor.

### Variables prédéfinies GitLab CI DSO

Un certain nombre de variables prédéfinies s'ajoutent aux variables standard de GitLab :

 - http_proxy, https_proxy, HTTP_PROXY, HTTPS_PROXY, PROXY_HOST et PROXY_PORT : paramètres liés au proxy de l'environnement ;
 - MVN_CONFIG_FILE : fichier de configuration Maven avec le paramétrage prédéfini de l'environnement et du projet en cours, notamment pour le dépôt d'artefacts sur le dépôt Nexus ;
 - NEXUS_HOST_URL : URL d'accès au dépôt Nexus (stockage d'artefacts) ;
 - NEXUS_HOSTNAME : nom d'hôte du service Nexus ;
 - NO_PROXY : variable contenant les URL qui ne nécessitent pas de passer par le proxy ;
 - NPM_FILE : fichier de configuration NPM préconfiguré pour l'environnement et le projet en cours ;
 - REGISTRY_URL : URL d'accès à l'instance Harbor (registre d'images) ;
 - SONAR_HOST_URL : URL d'accès à l'instance SonarQube (analyse statique de la qualité) ;
 - VAULT_AUTH_PATH : chemin dans l'URL d'accès à Vault pour l'authentification par JWT ;
 - VAULT_AUTH_ROLE : chemin dans l'URL d'accès à Vault pour la récupération des rôles à partir des appels GitLab ;
 - VAULT_SERVER_URL : URL d'accès à l'instance Vault (gestionnaire de secrets).

### Dépôts de sources d'infrastructure applicative

Conformément aux principes *GitOps*, les déploiements sur l'orchestrateur de conteneurs (celui de la plateforme Cloud π Native ou le vôtre) sont pilotés par un dépôt Git contenant les manifestes Kubernetes, des charts **Helm** ou **Kustomize**. Ces dépôts de code, appelés dépôts d'infrastructure, permettent de déployer vos images de conteneurs, ainsi que vos objets Kubernetes (services, ingress, configmaps, etc.).

Ces dépôts de sources sont utilisés par Argo CD afin de déployer l'infrastructure applicative sur Kubernetes. Votre application est déployée dans un espace de noms dédié au projet, qui est automatiquement provisionné par la Console de la plateforme Cloud π Native.

## Gestion des ressources GitLab par la Console

La Console Cloud π Native pilote l'ensemble des ressources GitLab créées dans
le groupe du projet (`<NOM_ORGANISATION>/<NOM_PROJET>`) lors de chaque
**provisionnement** et **reprovisionnement**. Elle maintient un état de
cohérence : les dépôts présents sur le GitLab interne sont comparés à ceux
déclarés dans la Console, et les dépôts non conformes sont supprimés.

### Dépôts gérés et marqueurs

Chaque dépôt créé par la Console porte un **topic GitLab** (`plugin-managed`)
qui le distingue des dépôts créés manuellement :

- **Dépôts applicatifs et d'infrastructure** déclarés dans la Console : créés
  dans le groupe du projet, marqués `plugin-managed`, et synchronisés avec le
  dépôt externe via le dépôt `mirror`.
- **Dépôts techniques** (dits *system managed*) : créés automatiquement par la
  Console et porteurs du topic `system-managed`. Ils ne figurent jamais dans la
  liste des dépôts déclarés du projet et sont **protégés** de toute suppression
  lors de la réconciliation. On y trouve :
  - le dépôt `mirror` : pilote la synchronisation des dépôts externes ;
  - le dépôt `infra-apps` : dépôt d'infrastructure du projet ;
  - les dépôts techniques associés aux plugins activés (par exemple le dépôt
    d'observabilité).

### Réconciliation et purge

À chaque reprovisionnement, la Console :

1. recrée ou met à jour les dépôts techniques (`system-managed`) ;
2. crée ou met à jour les dépôts déclarés (`plugin-managed`) ;
3. **supprime** les dépôts portant `plugin-managed` qui ne sont plus déclarés
   dans le projet (dépôt supprimé dans la Console, par exemple).

Un dépôt créé manuellement dans le GitLab interne **sans** marqueur de gestion
n'est pas modifié par la Console, mais n'est pas non plus intégré aux chaînes
de construction et de déploiement. Il est recommandé de toujours passer par la
Console pour créer, modifier et supprimer les dépôts d'un projet.

> La suppression d'un dépôt sur le GitLab interne est asynchrone. Si un
> reprovisionnement est lancé alors qu'une suppression est déjà en cours, la
> Console ignore l'erreur transitoire `already marked for deletion` et poursuit
> la réconciliation.

## Schéma de fonctionnement
Le schéma ci-dessous présente le fonctionnement général :

![gitlab-général](/img/gitlab.png)
