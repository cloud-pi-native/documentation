# Nexus

## Présentation
Le gestionnaire d'artefact de l'offre Cloud π Native est un Nexus en version communautaire.

Il est mis à votre dispotion afin de stocker vos artefact "intermédiaire" (library java, js, ...) necessaire pour la construction de votre artefact final embarqué sur votre image, il fera office de proxy vers les différents repos publics (maven central, npm, composer, etc.)


## Utilisation depuis la CI

Celui-ci est mis à votre disposition et préconfiguré pour votre projet dans la Gitlab CI, les configurations pour les repo de type MVN/NPM sont prédéfini via les variables d'environnements suivantes :
 - MVN_CONFIG_FILE
 - NPM_FILE

Pour l'utilisation d'autre type de repo qui ne serait pas préconfiguré, les variables d'environnement d'accès à nexus sont accessible dans la CI
 - NEXUS_HOST_URL
 - NEXUS_PASSWORD
 - NEXUS_USERNAME

Vos urls de repository seront toujours constuite de la même façon **\${NEXUS_HOST_URL}/${PROJECT_PATH}-XXX**

