# Utilisateurs

Dans le menu `Administration` → `Utilisateurs`, il est possible de retrouver tous les utilisateurs inscrits sur la plateforme, ainsi que des informations d’administration associées.

> La création et la suppression des utilisateurs se fait directement dans Keycloak.
> Après création ou modification d’un utilisateur, un délai de synchronisation peut être nécessaire avant de voir les changements dans la Console.

## Recherche

Une fonction de recherche est disponible sur les champs suivants:

- Identifiant
- Prénom
- Nom
- Courriel

![recherche utilisateur](/img/console_admin/recherche_utilisateurs.png)

## Devenir administrateur

En cochant la case **Administrateur**, la personne choisie devient administrateur de la console DSO.

Selon la configuration, les permissions globales peuvent aussi être gérées via les rôles plateforme (recommandé).

Quand les rôles plateforme sont activés, ils constituent le mode principal de gestion des droits globaux (plus fin et plus traçable). La case **Administrateur** peut rester disponible selon le paramétrage, mais il est préférable d’utiliser les rôles plateforme pour l’attribution des droits.

La montée en privilège (attribution de droits administrateur) doit suivre votre processus de validation interne.

Voir : [Rôles plateforme](/administration/roles).
