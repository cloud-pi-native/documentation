# Compatibilité Cloud π Native

## Prérequis techniques

Les critères permettant de déterminer la compatibilité de vos applications à la plateforme Cloud π Native :
- Vos applications doivent être conteneurisés sur une souche d'OS Linux. Les applications nécessitant un OS Windows ne sont pas éligibles à l'offre.
- Vos applications doivent être **sans état** (`stateless`) et partir  du principe qu'un composant applicatif (`pod`) peut être détruit à tout moment. Le stockage persistant de données est porté **principalement** par les bases de données. En cas de maintien de session applicative, un déport vers un composant de type Redis est nécessaire.
- La configuration de vos applications se font par leurs environnement (principalement par des variables d'environnements). Seuls ces éléments changent entre vos environnements applicatifs (environnement dev et production par exemple) : il s'agit de la même image de conteneur déployée avec un configuration différente.
- Vos images de conteneurs doivent être **rootless**.
- Le FileSystem de vos images de conteneurs doivent être en lecture seule.

## Prérequis organisationnels

- Avoir un compte dans le service SSO (Keycloak) de la plateforme Cloud π Native.
- Dans le cas ou votre dépôt de source externe est privé, un jeton d'accès personnel (PAT dans GiHub) avec le scope `repo` permettant de pull le dépôt sera demandé lors de l'enrolement sur la plateforme Cloud π Native.

## Prérequis techniques

Cf. [les bonnes pratiques](/guide/best-practices)
