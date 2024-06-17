# Artefects 

## Nexus

### Présentation

Pour stocker et gérer vos artefacts applicatifs, l'usine logcielle de l'offre Cloud π Native vous propose le service de gestionnaire d'artefacts applicatif **Nexus** en version communautaire.

Il est mis à à disposition des projets afin de stocker les artefacts "intermédiaires" (library java, js, ...) necessaires pour la construction des artefacts finaux embarqués sur les images des conteneurs projets.

A noter que cette instance Nexus fait également *proxy* vers les différents repos publics (maven central, npm, composer, etc.)


### Utilisation depuis la CI

Pour utiliser le service Nexus pour vos projets Maven ou NPM, des variables d'environnements sont préconfigurées dans le service GitLab:

 - MVN_CONFIG_FILE
 - NPM_FILE

Pour l'utilisation d'un langage de programmation différent dans le développement de vos applications, les variables d'environnement suivantes présentes dans GitLab définissant l'accès au service nexus:

 - NEXUS_HOST_URL
 - NEXUS_PASSWORD
 - NEXUS_USERNAME

Les urls de repositories seront toujours constuites de la même façon **\${NEXUS_HOST_URL}/repository/${PROJECT_PATH}-XXX**

## Dépôts d'images de conteneurs: Harbor

Harbor est la registry d'images de conteneurs utilisé pour stocker, gérer et distribuer les images de conteneurs des différents clusters, ainsi que de les scanner pour détecter les vulnérabilités de sécurité.
Celui-ci est préconfiguré dans les templates GitLab CI et utilisable via l'exemple suivant :

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

Il sera possible de définir différentes variables d'environnement dans GITLAB pour définir le TAG de l'image du conteneur, son nom et le path du Dockerfile:
 - IMAGE_NAMES: Nom de l'image de conteneur qui sera push dans le registry Harbor
 - DOCKERFILE: Chemin relatif depuis la racine du projet vers le Dockerfile
 - TAG: Tag de l'image par default le nom de la branche sera utilisé, il est possible d'utiliser d'autres valeurs disponible dans [GitLab](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html) comme le $CI_COMMIT_SHORT_SHA ou des valeurs personnaliées.

Les images seronts publiées (Push) sur l'url prédéfini de harbor ayant le format suivant :

`<REGISTRY_URL>/<ORGANISATION>-<PROJECT_NAME>/<IMAGE_NAME>/<TAG>`

Exemple: `harbor.apps.c6.numerique-interieur.com/mi-monprojet/monimage-backend:v2`

> *Les images publiées par la CI seront signées afin de garantir leur origine et harbor autorisera uniquement l'utilisation d'une image signée*

Harbor est également accessible aux utilisateurs afin de pouvoir vérifier les analyses de sécurité des images de conteneurs. 
