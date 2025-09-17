# Zones

Une zone désigne un datacenter particulier. Dans le cadre de Cloud Pi Native, il existe 2 zones:

- Zone Usuelle: zone pour les projets présentant une sensibilité moindre.
- Zone Restreinte: zone pour les projets sensibles, plus contraignant au niveau des flux réseaux

L'instructure sur Scaleway n'est pas concerné par cette notion de zone, aussi il n'existe que le choix **Zone Défaut**

## Création d'une zone

Cliquer sur le bouton **+ Ajouter une nouvelle zone**.

Un exemple de création d'une nouvelle zone, les explications se trouvant après:

![zone creation](/img/console_admin/zone_creation.png)

1. **Nom court de la zone**: Nom court à des fins techniques, aka un id (*pub dans l'exemple*)
2. **Nom complet de la zone**: Nom qui sera affichée dans la console à destination des utilisateurs (*Zone publique dans l'exemple*)
3. **Informations supplémentaires sur la zone**: Champ libre pour informer les utilisateurs du but de la zone (*Zone Publique de moindre sensibilité* dans l'exemple)
4. **Clusters associés**: Quels sont les clusters disponibles dans cette zone particulière ? (*dans l'exemple seul le cluster formation-ovh est associé à la zone*)

## Mise à jour et Suppression

Sélectionner la zone voulue via sa tuile. Le nom court d'une zone ne pourra pas être modifié étant lié à d'autres éléments techniques.

Seule une zone sans cluster associé peut être supprimée. De même il faut que le cluster soit vide de tous projets pour pouvoir être supprimé.
