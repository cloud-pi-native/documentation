# Changelog

Cette page présente les principales featues mises en place en fonction des versions de la Console et des impacts utilisateurs associées.

La version de la console est affichée en bas à droite : 
![version de la console](/img/guide/changelog/version.png)

par exemple ici la version **8.24.0**

## v9.x

La version 9.x de la console doit arriver en février 2025. Quelques changements majeurs impacts l'expérience utilisateur de la console :

### Modification du parcours utilisateur

Le menu gauche de gestion des projets a été supprimé afin de passer à une navigation par onglet.

 - Dans la version < 9 la navigation se fait à partir du menu gauche :
![menu projets](/img/guide/changelog/menu-gauche-projet-v8.png)

 - A partir de la version 9 la navigation se fait par onglet

![menu projets](/img/guide/changelog/onglets-projet-v9.png)

Les onglets détaillent :
 - Ressources : accès aux environnements et dépots de codes;
 - Services externes : Accès aux outils de l'offre : Gitlab, Nexus, Harbor, etc.;
 - Equipe : gestion des membres du projet;
 - Rôles : Liste des rôles du projet;
 - Journaux : Accès aux logs de gestion du projet depuis la console (pas les logs applicatives);
 - Liste des clusters disponibles pour le projet.


### Suppression de la notion d'organisation et namespace des projets

La version 9 de la console supprime la notion d'organisation (qui pourra revenir dans une version ultérieure de la console mais sous une autre forme). Avant la version 9 de la Console, le nom du namespace était composé de l'acronyme de l'organisation et du nom du projet. Cela peut poser des problèmes en cas de modification de l'organisation fonctionnel (un projet qui change d'organisme de rattachement) ou dans le cas de doublons de nom de projet.

A partir de la version 9 de la console, la notion d'organisation disparait depuis l'interface de la console et la notion de **slug** (identifiant unique du projet) est ajoutée est présente sur la page d'un projet :

![slugs](/img/guide/changelog/slug-projet-v9.png)

Depuis le tableau de bord du projet on peut voir deux informations importantes :
 - Le SLUG qui est l'identifiant unique du projet et qui correspond au nom du projet ou nom du projet '-' un numéro si le nom du projet est déjà utilsé sur DSO. **Ce slug devient l'identifiant unique du projet** dans tous les outils et services tiers.
 - L'UUID du projet en base de données.
 - Le champ version présenté ici indique la version de la console lors de la création (ou reprovisionnement) du projet permettant de savoir si les dernières fonctionnalités de la console ont bien été provisionnées pour le projet. Si une différence de version existe entre cette version et la version de la console, il est conseillé de faire un **reprovisionnement** du projet.

> Impacts : les URL des repos sont impactés (suppression du niveau de groupe de l'organisation). Les liens vers les repos dans gitlab sont modifiés et devront être adapté par les clients sur leurs différents appels : bookmark, historique de navigateur, référence dans le lien de synchro repo externe / repo interne, référence des remote en cas d'utilisation de git en local vers un remote sur le gitlab DSO, scripts de manipulation de projets git à distance (par exemple backup), etc.

Le nom du namespace est devenu opaque par la génération d'UUID. Ce nom est consultable depuis l'onglet ressources puis en cliquant sur la ligne d'un environnement : 

![nom namespace](/img/guide/changelog/nom-ns-v9.png) Le nom du namespace est devenu un UUID et sera utile dans les outils de monitoring afin de consulter les métriques et logs associé à son namesapce.

Sur ce même écran, il est possible de voir les informations du cluster notamment : 
 - Les FIP internet et RIE
 - La clé SOPS du cluster

![info cluster](/img/guide/changelog/info-cluster-v9.png)
