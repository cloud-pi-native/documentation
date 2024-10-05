# Clusters

Un cluster est, au même titre qu'un cluster kubernetes, un ensemble de noeuds pilotés, par une solution d'orchestration (kubernetes vanille, OpenShift, Rancher, etc...)

La console n'installe pas de cluster kubernetes à proprement parlé mais permet de piloter des projets sur différents clusters.

## Création d'un cluster

En appuyant sur le bouton **+ Ajouter un nouveau cluster**, une nouvelle page s'ouvre pour faire l'action idoine.

Un exemple de remplissage des différents champs de configuration, une explication se trouvant après:
![cluster ajout](/img/console_admin/cluster_ajout.png)

1. **Kubeconfig**: Fournir un kubeconfig sous forme de fichier texte
2. **Nom du serveur Transport Layer Security (TLS)**: information extraite du fichier kubeconfig
3. **Nom du cluster applicatif**: Nom que le cluster aura dans l'interface de la console par les utilisateurs.
4. **Informations supplémentaires sur le cluster**: Informations supplémentaires qui seront visibles par les utilisateurs, typiquement l'adresse IP des FIP
5. **Ignorer le certificat TLS du server (risques potentiels de sécurité !)**: à cocher pour désactiver la vérification du certificat TLS dans le kubeconfig
6. **Ressources cluster**: Cochez la case si des ressources de type cluster peuvent être déployées par Argocd, à réserver pour les clusters dédiés
7. **Zone associée**: Zone associée au cluster
8. **Confidentialité du cluster**: choix si le cluster est public (partagé et visible par tout le monde) ou dédié (pour un projet ou une équipe projet). En cas de cluster dédié, il sera demander de choisir les projets associés qui peuvent être déployé sur ce cluster.
9. **Nom des types d'environnement**: un cluster est lié à un certain nombre d'environnement, typiquement les environnements hors production sur un cluster et l'environnement concernant la production sur un cluster dédié
10. Cliquer sur le bouton **Ajouter le cluster**

## Détail d'un cluster

En cliquant sur la tuile d'un cluster, il est possible d'avoir une page détaillée concernant ce dernier.

Les mêmes informations que lors de la création apparaissent ainsi qu'une liste des projets (environnements) associés

![cluster détail environnement](/img/console_admin/cluster_details_env.png)

## Suppresion d'un cluster

Pour pouvoir supprimer un cluster, il faut se rendre sur la page de [détail d'un cluster](#detail-d-un-cluster).

Le cluster ne doit avoir aucun projet actuellement déployé dessus.

![cluster suppression](/img/console_admin/cluster_suppression.png)
