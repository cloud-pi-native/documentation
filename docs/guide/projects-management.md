# Gestion des projets

Un projet est un espace virtuel (namespace au sens kubernetes) cloisonné pour une seule application.

Chaque projet contient une liste de collaborateurs (voir [Gestion des équipes](/guide/team)) ainsi qu'un ou plusieurs dépôts de code (voir [Gestion des dépôts](/guide/repositories-management.md))

## Création d'un projet

Une fois connecté sur la console, le menu gauche présente une entrée "Mes Projets" contenant la liste de ses projets.
![mes projets](/img/tuto/2tuto-mes-projets.png)

Cliquez sur le bouton **+ Créer un projet** afin d'ajouter un nouveau projet:
![créer projet](/img/guide/project/create_project.png)

Sur cet écran il est nécessaire de renseigner :

- **Nom de l'organisation**: correspondant à l'entité administratif de rattachement.
- **Nom du projet**: ce nom servira à créer un groupe dans gitlab de la plateforme Cloud π Native et sera une composante du namespace Kubernetes créé.

Valider la saisie en cliquant sur **Commander mon espace projet**

La création d'un projet va lancer le provisionnement des différents [services](/platform/introduction.html#services-core-proposes-par-la-plateforme), ce qui signifie principalement la configuration de ces outils avec un espace dédié pour le projet, son cloisonnement avec les autres projets et l'authentification des utilisateurs projet dans ces outils. Cette opération pourra prendre quelques minutes et le nouveau projet est présenté en cours de construction:

A la fin du processus de création, liste de tous vos projets est affiché avec le nouveau projet disponible

![tuile projet](/img/guide/project/monprojettuile.png)

Au clic sur le projet, une page de tableau de bord est affichée
![projet - tableau de bord](/img/guide/project/monprojet_tableaudebord.png)

Deux informations affichées:

- si le projet est verrouillé, demander à la ServiceTeam les raisons et le déverrouillage du projet
- si les dernières opérations concernant le projet ont réussi

Un certain nombre d'actions sont disponibles:

- **Reprovisionner le projet**: la console DSO étant en cours de développement actif, des changements ont lieu et peuvent perturber le bon fonctionnement des projets. Ce bouton permet de mettre à jour son projet par rapport aux derniers développement de la console.
- **Afficher les secrets des services**: affiche des configurations utiles mais sensible des projets (seul le propriétaire du projet peut voir les secrets)
![mon projet - secrets](/img/guide/project/monprojet_secrets.png)
La partie GitLab permet d'avoir le token ainsi que l'id du dépôt mirror (permettant de cloner son dépôt primaire sur Cloud Pi Native). Cela permet d'automatiser cette action via des pipelines sur votre dépôt primaire.
Concernant Harbor, la registry stockant les images construites sur la plateforme CPiN
Pour la section Kubernetes, le nom du secret permettant de s'authentifier auprès d'Harbor.
- **Supprimer le projet monprojet**: après confirmation, supprime définitivement le projet. Aucune restauration n'est possible.

