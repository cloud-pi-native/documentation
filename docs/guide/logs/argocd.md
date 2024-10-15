# ArgoCD

Pendant la phase de développement, il est pratique d'avoir les logs directement sur la brique intéressante.

ArgoCD a une fonctionnalité permettant d'afficher les logs que les pods génèrent.

Pour cela sur ArgoCD, choisir le pod, déploiement, job, etc... (les logs des pods remontent dans les briques ascendantes).

Il est possible de filtrer les ressources via un menu à gauche (ici un kind **deployment**):

![filtre_menu](/img/guide/logs/argocd/filtre.png)
![ressource](/img/guide/logs/argocd/ressources.png)

Cliquer sur la ressource voulue (dans l'exemple pgrest-tcnp), puis choisir l'onglet **Logs**:
![onglet_logs](/img/guide/logs/argocd/logs.png)