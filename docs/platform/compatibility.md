# Compatibilité Cloud π Native

## Prérequis techniques

Voici des critères permettant de déterminer si une application est compatible avec la plateforme Cloud π Native :
- Les applications doivent être délivrées sous forme de containers et donc sur une souche d'OS Linux. Les applications nécessitant un OS Windows ne sont pas éligibles à l'offre.
- Les applications doivent être **sans état** (`stateless`) et partir  du principe qu'un composant applicatif (`pod`) peut être détruit à tout moment. Le stockage persistant de données est porté **principalement** par les bases de données. En cas de maintien de session applicative, un déport vers un composant de type Redis est nécessaire.
- La configuration de l'application se fait par son environnement (principalement par des variables d'environnements). Seuls ces éléments changent entre deux environnements : il s'agit de la même image déployée avec un configuration différente (par de reconstruction pour passer d'un environnement à un autre).
- Les images déployées doivent être **rootless**.
- Le FileSystem des images doit être en lecture seule.

## Prérequis organisationnels

- Avoir un compte dans le SSO (Keycloak) de Cloud π Native.
- Si le dépôt externe est privé, un jeton d'accès personnel (PAT dans GiHub) avec le scope `repo` permettant de pull le dépôt sera demandé lors de l'enrolement sur Cloud π Native.

## Prérequis techniques

Cf. [les bonnes pratiques](/guide/best-practices)