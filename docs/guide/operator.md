# Opérateurs

Un opérateur kubernetes est un moyen d'étendre les fonctionnalités de kubernetes en cachant la complexité derrière une simplicité d'utilisation.

Cloud Pi Native a choisi d'activer deux opérateurs sur sa plateforme:

- [prometheus](https://github.com/prometheus-operator/prometheus-operator): permet de paramétrer le monitoring de ses services en mode gitops
- [cnpg](https://cloudnative-pg.io/): permet de manager une base de données postgresql de façon simple mais puissante (backup/recovery, HA, réplication inter-cluster, ...)

> Des exemples d'utilisation sont disponibles [ici](/guide/tutorials.md)

Il est possible de demander l'ajout d'un opérateur via l'[ouverture d'un ticket](https://support.dev.numerique-interieur.com/) de type **Nouvelle fonctionnalité**.

Concernant les clusters dédiés, tout ajout d'opérateur sera à faire homologuer par le projet demandeur.
