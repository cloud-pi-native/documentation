# Type d'environnement

Un environnement est désigne une phase de développement du projet. Chaque environnement est lié à des quotas ainsi qu'à des clusters.

## Création d'un environnement

Cliquer sur le bouton **+ Ajouter un nouveau type d'environnement**.

Un exemple de création de type d'environnement, les explication se trouvant après:
![environnement création](/img/console_admin/environnement_creation.png)

1. **Nom du type d'environnement**: Nom de l'environnement que les utilisateurs verront dans la console (*dev dans l'exemple*)
2. **Quotas associés**: Tous les quotas possibles une fois que ce type d'environnement sera sélectionné par les utilisateurs (*small et medium dans l'exemple*)
   1. Le bouton **Ajouter tout* ajoute tous les quotas dans le type d'environnement
   2. Le bouton **Ajouter visible** ajoute tous les quotas visible par les utilisateurs (quota privé décoché)
3. **Clusters associés**: Tous les clusters disponible une fois que ce type d'environnement sera sélectionné par les utilisateurs (*formation-ovh dans l'exemple*)

## Mise à jour et Suppression

Pour mettre à jour un type d'evironnement, il faut sélectionner sa tuile dans la liste.

Il est possible de modifier les quotas associés ainsi que les clusters mais pas le nom.

Tout en bas il est possible de retrouver la liste des projets associés à ce type d'environnement. Un type d'environnement doit être libre de toute utilisation avant de pouvoir être supprimé.
