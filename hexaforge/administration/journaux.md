# Journaux

Les journaux sont essentiels pour comprendre la vie de la plateforme et apporter une réponse en cas de problème.

Ce menu permet de voir tous les actions que la console effectue suite aux saisies utilisateurs.

Dès qu'un problème apparait, l'entrée du journal est entourée en rouge (vert si l'action s'est correctement effectuée) avec les clés suivantes:

```json
{
  "args": {
  },
  "config": {
  },
  "failed": [
  ],
  "results": {
  }
}
```

La clé args regroupe toutes les données que la console a pu récupérer sur le projet (id, nom, membres, environnements, etc).

La clé failed contient le plugin en erreur (pour faciliter la vie de l'administrateur)

La clé results contient les logs des différents plugins joués et donne un 1er aperçu du problème rencontré.

Dans l'exemple suivant, le projet a un soucis d'authenfication concernant GitLab. D'expérience, il s'agit très certainement d'un clonage de dépôt privé dont les informations d'identification ont été mal renseignées.
![journaux erreur](/img/console_admin/journaux_erreur.png)
