# Gestion des déploiements

Depuis la version 9.25.0 de la console, il est possible de créer des déploiements applicatifs pour son projet. Cette fonctionnalité est disponible en version beta.

Un déploiement permet d'associer un environnement à un ou plusieurs dépôts de code d'infrastructure.

La console génère ensuite la configuration ArgoCD correspondante afin de déployer les ressources dans le namespace de l'environnement cible.

Ce nouveau système permet notamment :

- de déployer plusieurs dépôts sur un même environnement
- d'utiliser une révision différente selon l'environnement
- d'utiliser une révision différente selon le dépôt
- d'empiler plusieurs fichiers de values, dont un provenant d'un autre dépôt du projet

> Cette fonctionnalité est encore en version beta. Il est recommandé de vérifier le résultat dans ArgoCD après modification d'un déploiement.

## Activer les droits de déploiement

Pour utiliser ce nouveau système, les permissions doivent être ajoutées dans la gestion des rôles du projet.

Depuis l'onglet **Rôles**, modifier le rôle concerné puis activer les droits :

- **Voir les déploiements** : permet de visualiser les déploiements et leurs configurations.
- **Gérer les déploiements** : permet de créer, éditer et supprimer des déploiements.

![Droits des déploiements](/img/guide/deployment/roles-deploiements.png)

## Créer un déploiement

Depuis la console, aller dans l'onglet *Ressources* d'un projet.

![Liste des déploiements](/img/guide/deployment/liste-deploiements.png)

Dans la partie **Déploiements**, cliquer sur le bouton **+ Ajouter un nouveau déploiement** puis compléter :

- Un nom de déploiement, par exemple `api` ou `front`
- L'environnement cible du déploiement
- Le ou les dépôts à inclure dans ce déploiement

![Création d'un déploiement](/img/guide/deployment/creation-deploiement.png)

> Un déploiement est toujours rattaché à un seul environnement.

:::warning
Dès qu'au moins un déploiement existe, les déploiements deviennent la **seule** source de configuration applicative prise en compte par la console pour générer les fichiers de values ArgoCD.

Concrètement :

- pour l'environnement associé à un déploiement, la liste des dépôts déployés est entièrement réécrite à partir du déploiement. La configuration portée par les dépôts d'infrastructure du projet (révision, chemin, fichiers de values) est **écrasée** et n'est plus utilisée ;
- les environnements de la même zone qui n'ont aucun déploiement conservent l'ancien fonctionnement, basé sur les dépôts d'infrastructure du projet. Leur configuration ArgoCD reste celle générée précédemment, mais la console ne la régénère plus : toute modification faite ensuite sur les dépôts d'infrastructure n'est plus répercutée tant qu'un déploiement n'a pas été créé pour ces environnements.

Avant de créer un premier déploiement, il faut donc reporter dans celui-ci l'intégralité de la configuration existante des dépôts d'infrastructure, et prévoir de créer un déploiement pour chaque environnement du projet.
:::

## Configurer les dépôts du déploiement

Pour chaque dépôt inclus dans un déploiement, il est possible de configurer :

- **Dépôt** : le dépôt à déployer.
- **Nom de la révision à déployer** : branche, tag ou commit à utiliser. Si le champ est vide, la cible sera `HEAD`.
- **Chemin du répertoire à déployer** : chemin vers les manifests, kustomize ou chart Helm. Si le champ est vide, la racine du dépôt sera utilisée.
- **Sources de valeurs (Helm)** : la liste ordonnée des fichiers de values à appliquer (voir la section suivante).

> Le formulaire ne récupère pas la configuration des champs déjà renseignés sur les dépôts d'infrastructure du projet : il s'agit d'un comportement voulu. La configuration portée par les dépôts d'infrastructure est amenée à disparaître au profit de celle définie dans l'objet déploiement.

## Sources de valeurs (Helm)

L'ancien champ texte *Fichiers values (Helm)*, où les chemins étaient saisis un par ligne, est remplacé par une liste de **sources de valeurs**. Chaque dépôt du déploiement possède sa propre liste.

Chaque source est ajoutée avec le bouton **Ajouter une source de valeurs**, et peut être déplacée (flèches haut / bas) ou supprimée.

Deux types de sources sont disponibles :

- **Interne** : un fichier de values situé dans le dépôt déployé lui-même.
- **Externe** : un fichier de values situé dans un **autre dépôt** du projet.

### Ordre des sources

La liste est ordonnée : **chaque source surcharge les précédentes**. La dernière source de la liste a donc la priorité sur toutes les autres.

Si aucune source n'est déclarée, le fichier `values.yaml` du dépôt déployé est utilisé par défaut.

### Source interne

Une source interne ne demande qu'un champ :

- **Chemin du fichier de valeurs** : chemin relatif à la racine du dépôt déployé, par exemple `values/common.yaml`.

Le nombre de sources internes n'est pas limité.

### Source externe

Une source externe permet de déporter les values dans un dépôt dédié, par exemple un dépôt de configuration commun à plusieurs applications, versionné indépendamment du chart.

Elle demande les champs suivants :

- **Dépôt de valeurs** : le dépôt du projet contenant les fichiers de values. Le dépôt déployé n'apparaît pas dans la liste : pour un fichier du dépôt déployé, utiliser une source interne.
- **Nom de la source (ref)** : nom court donné à cette source pour qu'ArgoCD la référence, par exemple `infra-values`. Il doit être unique au sein du déploiement.
- **Révision (branche, tag, commit)** : révision du dépôt de valeurs. Si le champ est vide, la cible sera `HEAD`.
- **Chemin du fichier de valeurs** : chemin relatif à la racine du dépôt de valeurs, par exemple `values.yaml`.

> Une seule source externe est autorisée par dépôt du déploiement. Une fois qu'une source externe est définie, le choix **Externe** est désactivé sur les autres lignes.

La révision du dépôt de valeurs est indépendante de celle du dépôt déployé : un même chart peut ainsi être déployé avec des values issues d'une branche différente selon l'environnement.

## Multi branches et target revision

Un même dépôt peut être déployé sur plusieurs environnements avec une révision différente.

Par exemple :

- `integration` peut déployer la branche `develop`
- `staging` peut déployer la branche `release`
- `production` peut déployer un tag ou un commit précis

Cette configuration se fait depuis le déploiement, dans le champ **Nom de la révision à déployer** de chaque dépôt.

## Multi dépôts

Un déploiement peut contenir plusieurs dépôts.

Ce mode permet par exemple de déployer, sur un même environnement :

- un dépôt contenant les manifests communs
- un dépôt contenant le chart Helm applicatif
- un dépôt contenant une configuration spécifique

Chaque dépôt garde sa propre configuration de révision, de chemin et de sources de valeurs.

## Synchronisation ArgoCD

La console reste la source de vérité pour la configuration des déploiements.

Les modifications doivent être faites depuis la console et non directement depuis l'application ArgoCD.

Après création ou modification d'un déploiement, la console met à jour la configuration ArgoCD du projet. Le déploiement est ensuite synchronisé par ArgoCD.

Pour plus de détails sur la visualisation et la synchronisation dans ArgoCD, voir [Déploiement de votre application](/guide/deployment-with-argo).

> Si aucun déploiement n'est configuré, la console conserve le fonctionnement basé sur les dépôts d'infrastructure déclarés dans le projet.
