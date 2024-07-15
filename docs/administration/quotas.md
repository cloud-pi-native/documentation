# Quotas

Un quota est une limite dure (en terme de CPU et de RAM) de ce qu'un projet peut déployer sur un environnement donné.

Dans le monde kubernetes, cela se traduit par un objet de type ResourceQuota dans le namespace.

## Création d'un nouveau quota

Cliquer sur le bouton **+ Ajouter un nouveau quota**, une nouvelle page s'ouvre demandant un certain nombre détail.

Un exemple ci-dessous pour la création d'un quota, l'explication des champs se trouvant après:
![quota création](/img/console_admin/quota_creation.png)

1. **Nom du quota**: Nom que le quota aura sur la partie cliente de la console
2. **Mémoire allouée**: Mémoire maximum que le projet pourra allouer s'il choisit ce quota
3. **CPU alloué(s)**: Nombre de CPU maximum que le projet pourra allouer s'il choisit ce quota
4. **Quota privé**: Si le quota est uniquement accessible aux administrateurs de la console
5. **Nom des types d'environnement**: A quels environnement ce quota est associé

## Mise à jour du quota et suppression

Pour mettre à jour un quota, il suffit de cliquer sur sa tuile dans la page principal des quotas.

Si le quota est utilisé par des projets, la liste des projets et environnement est affichée.

Un quota ne peut être supprimé que s'il n'a pas de projet lié.

