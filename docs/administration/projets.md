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

- Si un service ne parvient pas à supprimer ses ressources, le projet passe au statut « échoué » (erreur API 422). Certaines ressources peuvent déjà avoir été supprimées. Consultez [les journaux](/administration/journaux) pour identifier le service en échec, corrigez le problème, puis relancez la suppression. Relancer sans corriger le problème peut échouer à nouveau (cf. [console#2785](https://github.com/cloud-pi-native/console/issues/2785)).
- Si le projet est modifié pendant le nettoyage, l'API renvoie une erreur 409 et l'archivage est refusé ; rejouez la demande.
- En cas de succès, les ressources du projet dans les services externes sont supprimées. La Console conserve un enregistrement du projet au statut « archivé » : son nom et son identifiant technique sont modifiés pour distinguer cette archive, qui ne permet pas de restaurer les ressources supprimées (cf. [documentation#119](https://github.com/cloud-pi-native/documentation/issues/119)).

Un projet « échoué » reste verrouillé : un administrateur peut le déverrouiller puis relancer la suppression.
