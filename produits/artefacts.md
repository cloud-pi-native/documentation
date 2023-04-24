# Nexus

## Présentation
Le gestionnaire d'artefacts de l'offre Cloud π Native est un Nexus en version communautaire.

Il est mis à à dispotion des projets afin de stocker les artefact "intermédiaire" (library java, js, ...) necessaires pour la construction des artefact final embarqués sur les images projets. Ce repo fait proxy vers les différents repos publics (maven central, npm, composer, etc.)


## Utilisation depuis la CI

L'accès à Nexus est préconfiguré sur les projet dans la partie gitlab-ci pour les repo de type MVN et NPM via les variables d'environnements suivantes :
 - MVN_CONFIG_FILE
 - NPM_FILE

Pour l'utilisation d'autres types de repos qui ne seraient pas préconfigurés, les variables d'environnement d'accès à nexus sont accessibles dans la CI
 - NEXUS_HOST_URL
 - NEXUS_PASSWORD
 - NEXUS_USERNAME

Les urls de repositories seront toujours constuites de la même façon **\${NEXUS_HOST_URL}/${PROJECT_PATH}-XXX**

# Repos d'images : Harbor

TODO