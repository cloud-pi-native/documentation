# Artefects 

## Nexus

### Présentation
Le gestionnaire d'artefacts applicatifs de l'offre Cloud π Native est un Nexus en version communautaire.

Il est mis à à disposition des projets afin de stocker les artefacts "intermédiaires" (library java, js, ...) necessaires pour la construction des artefacts finaux embarqués sur les images projets.

A noter que cette instance Nexus fait également *proxy* vers les différents repos publics (maven central, npm, composer, etc.)


### Utilisation depuis la CI

L'accès à Nexus est préconfiguré sur les projet dans la partie gitlab-ci pour les repo de type MVN et NPM via les variables d'environnements suivantes :
 - MVN_CONFIG_FILE
 - NPM_FILE

Pour l'utilisation d'autres types gestionnaire de projet ou langages qui ne seraient pas préconfigurés, les variables d'environnement suivantes définissant l'accès à nexus sont accessibles dans la CI
 - NEXUS_HOST_URL
 - NEXUS_PASSWORD
 - NEXUS_USERNAME

Les urls de repositories seront toujours constuites de la même façon **\${NEXUS_HOST_URL}/repository/${PROJECT_PATH}-XXX**

## Repos d'images : Harbor

Harbor est la registry d'images utilisé pour stocker, gérer et distribuer les images de conteneurs Docker des différents clusters, ainsi que de les scanner pour détecter les vulnérabilités de sécurité.
Celui-ci est préconfiguré dans les templates Gitlab CI et utilisable via l'exemple suivant :

```yaml
build_docker_back:
  variables:
    WORKING_DIR: 'server'
    IMAGE_NAMES: 'candilibv2-devops'
    DOCKERFILE: 'server/Dockerfile-devops'
    TAG: $CI_COMMIT_BRANCH
  stage: build-docker
  extends:
    - .kaniko:simple-build-push
```

Il sera possible de définir différentes variables pour définir le TAG de l'image son nom et le path du Dockerfile:
 - IMAGE_NAMES: Nom de l'image qui sera push dans Harbor
 - DOCKERFILE: Chemin relatif depuis la racine du projet vers le Dockerfile
 - TAG: Tag de l'image par default le nom de la branche sera utilisé, il est possible d'utiliser d'autres valeurs disponible dans [Gitlab](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) comme le $CI_COMMIT_SHORT_SHA ou des valeurs personnaliées.

Les images seronts pushées sur l'url prédéfini de harbor ayant le format suivant :

`<REGISTRY_URL>/<ORGANISATION>-<PROJECT_NAME>/<IMAGE_NAME>/<TAG>`

Exemple: `harbor.apps.c6.numerique-interieur.com/mi-monprojet/monimage-backend:v2`

> *Les images pushées par la CI seront signées afin de garantir leur origine et harbor autorisera uniquement l'utilisation d'image signée*

Harbor est également accessible aux utilisateurs afin de pouvoir vérifier les scans de sécurité au fil du temps de ses images.