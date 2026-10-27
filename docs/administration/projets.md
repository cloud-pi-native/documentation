# Projets

Le menu Administration > Projets permet de voir la liste de tous les projets, que ce soit les projets non archivés, archivés, verrouillés, échoués.

Une zone de texte permet de filtrer rapidement sur les éléments suivants:

- Nom
- Description
- Souscripteur

![recherche projet](/img/console_admin/recherche_projet.png)

En cliquant sur le projet concerné, une autre page s'ouvre sur laquelle les informations suivantes sont disponibles:

- Les environnements associés au projet ainsi que leur quota
- Les dépôts (ainsi que leur type) synchronisés
- Les membres du projet et leur statut
- La configuration des plugins pour ce projet en particulier

![projet détail](/img/console_admin/projet_detail.png)

## Archivage d'un projet

La suppression d'un projet déclenche d'abord le nettoyage de l'ensemble de ses ressources externes (dépôts, environnements...), puis son archivage en base.

Le projet est verrouillé avant le nettoyage : toute modification est refusée pendant l'opération.

- Si le nettoyage échoue sur un service, le projet passe au statut « échoué » et l'API renvoie une erreur 422. Une partie des ressources a pu être supprimée avant l'échec : examinez et corrigez l'erreur du service concerné avant de relancer, un rejeu identique n'est pas garanti suffisant (cf. cloud-pi-native/console#2785).
- Si le projet est modifié pendant le nettoyage, l'API renvoie une erreur 409 et l'archivage est refusé ; rejouez la demande.
- En cas de succès, les ressources externes sont supprimées, le slug est suffixé et le projet passe au statut « archivé ».

Un projet « échoué » reste verrouillé : un administrateur peut le déverrouiller puis relancer la suppression.
