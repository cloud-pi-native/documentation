# Démarrer

La prise en main de la plateforme Cloud π Native se fait par la console.

## Etape 1 - Accès à la console

Une fois sur la console, il faut se connecter en cliquant en haut à droite sur le bouton se connecter :
![se connecter](/img/tuto/1tuto-connexion.png)

> La création des comptes utilisateurs est opérée par les administrateurs de la plateforme.

## Etape 2 - Créer un projet

Créer un projet sur la console (un détail des opérations à mener est trouvable [ici](/guide/projects-management))

**Attention, un projet ne peut changer de nom après sa création.**

## Etape 3 - Ajouter des collaborateurs

Ajouter vos collaborateurs sur le projet, un guide est disponible [ici](/guide/team)


## Etape 4 - Ajouter un dépôt synchronisé

Ajouter vos dépôts (qui peuvent être synchronisés - manuellement ou via un automatisation), un guide est disponible [ici](/guide/repositories-management).

Il existe deux types de dépôts:

- dépôt avec du code applicatif : génère une image docker utilisée plus tard dans vos déploiements (doit contenir un Dockerfile et un fichier gitlab-ci nommé `.gitlab-ci-dso.yaml`)
- dépôt avec du code d'infrastructure : manifest / template kuztomize / chart helm générant votre infrastructure via ArgoCD

> Note: il est possible d'avoir un seul dépôt avec les deux fonctionnalités

## Etape 5 - Ajouter un environnement

Un environnement est un namespace cloisonné au sens kubernetes permettant de déployer le code d'infrastructure.

Pour déployer un environnement un guide est disponible [ici](/guide/environments-management).


## Divers

- Afin d'accéder à vos images construites via Cloud Pi Native et stockées sur Harbor, un secret, nommé `registry-pull-secret`, est créé automatiquement par la plateforme.

- Un tutoriel est disponible [ici](/guide/tutorials) pour automatiser la synchronisation entre votre dépôt primaire et le dépôt sur la plateforme Cloud Pi Native.
