Retour à [l'accueil](README.md)

# Prérequis

## Critère d'éligibilité Cloud π Native

Voici des critère permettant de déterminer si votre  application est éligible à l'offre Cloud π Native. L'équipe projet Cloud π Native vous accompagne sur cette étape afin de trouver les solutions d'adaptation de vos application:
  - Les applications doivent être délivrée sous forme de containers et donc sur une suche d'OS Linux. Les applications nécessitant un OS Windows ne sont pas éligibles à l'offre.
  - Les applications doivent être **sans état** et partir  du principe qu'un composant applicatif (pod) peut être détruit à tout moment. Le stockage persistent de données est portée **principalement** par les bases de données. En cas de maintient de session applicative, un déport vers un composant de type Redis est nécessaire.
  - La configuration de l'application se fait par son environnement (principalement par des variables d'environnements). Seuls ces éléments change entre deux environnements : il s'agit de la même image déployée avec un configuration différente (par de reconstruction pour passer d'un environnement à un autre) 
  - Les images déployée doivent être **rootless**
  - Le FileSystem des images doit être en lecture seule
  - Afin d'accéder aux composants externes à l'application déployée sur Cloud π Native, par exemple des API, des demandes d'ouvertures de flux doivent être explicitement réalisée (voir la procédure TODO) 
  - Vérifier les contraintes de nom DNS : les applications doivent-elles obligatoirement être en *.gouv.fr ou *.interieur.gouv.fr ?
  - Exigences au sens CCT

## Prérequis orga

- Avoir un compte dans le SSO de Cloud π Native (à demander à l'équipe DSO).
- Avoir l'url de l'API Gateway (`API_DOMAIN`) (à demander à l'équipe DSO).
- Avoir une clé d'authentification (`CONSUMER_KEY`) auprès de l'API Gateway (à demander à l'équipe DSO).
- Avoir un secret d'authentification (`CONSUMER_SECRET`) auprès de l'API Gateway (à demander à l'équipe DSO).
- Si le dépôt externe est privé, un jeton d'accès personnel (PAT dans GiHub) avec le scope `repo` permettant de pull le dépôt sera demandé lors de l'enrolement sur Cloud π Native


## Liens utiles 

- [Kubernetes Basics: Pods, Nodes, Containers, Deployments and Clusters](https://www.youtube.com/watch?v=B_X4l4HSgtc) - *video en anglais*
- [Kubernetes in 5 mins](https://www.youtube.com/watch?v=PH-2FfFD2PU) - *video en anglais*
- [Adapting Docker and Kubernetes containers to run on Red Hat OpenShift Container Platform](https://developers.redhat.com/blog/2020/10/26/adapting-docker-and-kubernetes-containers-to-run-on-red-hat-openshift-container-platform#) - *article en anglais*
- [Building rootless containers for JavaScript front ends](https://developers.redhat.com/blog/2021/03/04/building-rootless-containers-for-javascript-front-ends#) - *article en anglais*
