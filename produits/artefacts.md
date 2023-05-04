# Artefects 

## Nexus

### Présentation
Le gestionnaire d'artefacts de l'offre Cloud π Native est un Nexus en version communautaire.

Il est mis à à dispotion des projets afin de stocker les artefact "intermédiaire" (library java, js, ...) necessaires pour la construction des artefact final embarqués sur les images projets. Ce repo fait proxy vers les différents repos publics (maven central, npm, composer, etc.)


### Utilisation depuis la CI

L'accès à Nexus est préconfiguré sur les projet dans la partie gitlab-ci pour les repo de type MVN et NPM via les variables d'environnements suivantes :
 - MVN_CONFIG_FILE
 - NPM_FILE

Pour l'utilisation d'autres types de repos qui ne seraient pas préconfigurés, les variables d'environnement d'accès à nexus sont accessibles dans la CI
 - NEXUS_HOST_URL
 - NEXUS_PASSWORD
 - NEXUS_USERNAME

Les urls de repositories seront toujours constuites de la même façon **\${NEXUS_HOST_URL}/${PROJECT_PATH}-XXX**

## Repos d'images : Harbor

Harbor est la registry d'image utilisé pour stocker, gérer et distribuer les images de conteneurs Docker des différents clusters, ainsi que de les scanner pour détecter les vulnérabilités de sécurité.
Celui-ci sera préconfiguré dans les templates Gitlab CI et utilisable via l'exemple suivant :

```yaml
build_docker_back:
  variables:
    WORKING_DIR: 'server'
    IMAGE_NAME: 'candilibv2-devops'
    DOCKERFILE: 'Dockerfile-devops'
  stage: build-docker
  extends:
    - .kaniko:build
```

*Les images pusher par la CI seront signées afin de garantir leur origine et harbor n'autorisera uniquement l'utilisation d'image signée*

Il sera aussi accessible au utilisateur afin de pouvoir vérifier les scans de sécurité au fil du temsp de son image.