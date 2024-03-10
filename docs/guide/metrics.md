# Métriques

Retrouver ce service dans la console Cloud Pi via le menu `Projet > Mes Projets > Sélectionner un projet > Mes Services` et cliquer sur l'icône Grafana correspondant au cluster sur lequel votre déploiement applicatif est présent.

Dans cette section, nous allons découvrir comment créer un nouveau dashboard contenant un graphique.

## Connexion
Pour visualiser vos métriques, sélectionner Grafana dans le tableau de bord "Mes Services".

Pour se logguer, cliquer sur le bouton en bas de page commençant par "Sign in with..."

![signin](/img/guide/grafana-sign-in.png)

Une fois connecté, l'accès aux dashboards est disponible via la menu hamburger en haut à gauche 

![menu](/img/guide/grafana_menu.png)
![menu dashboard](/img/guide/grafana_menu_dashboard.png)

Par défaut, les équipes de Cloud Pi Native ont prévu un dashboard reprenant les informations d'infrastructure (CPU/RAM/Quota/Réseaux/Stockage) de vos différents namespace.

![dashboard_infra](/img/guide/dashboard_infra.png)

Il est possible d'en ajouter d'autres, ceux-ci seront automatiquement sauvegardés pour une utilisation future.

## Créer un dashboard
Pour créer un dashboard, se rendre dans la liste des dashboard et cliquer sur `New > New Dashboard`
![new dashboard](/img/guide/grafana_new_dashboard.png)

Cliquer sur le bouton `+ Add visualization`
![add visualization](/img/guide/grafana_add_visualization.png)

Grafana va ouvrir une page pour créer une nouvelle visualisation, un exemple avec la capture d'écran suivante:
![first visualization](/img/guide/grafana_first_visualization.png)

---
En bas, on retrouve les informations concernant les requêtes sur les métriques:
![zoom queries](/img/guide/grafana_first_visualization_metrics.png)

Ici on veut la consommation de RAM du container postgresql

Le bouton `run queries` permet de prévisualiser le graphique obtenu

---
Le panel du haut permet de gérer la fênetre de temps pour laquelle on veut les métriques.

![time window](/img/guide/grafana_first_visualization_time_window.png)

Sur l'exemple, le prévisualisation contient les métriques pour les 5 dernières minutes

Cette fênetre peut être glissante (5 dernières minutes, la dernière heure, la semaine passée) ou fixe (du 24/12/2023 à 23h55 au 25/12/2023 à 0h05)

Le bouton composé de 2 flèches formant un cercle permet de rafraichir la prévisualisation avec la fenêtre de temps choisie

---
Le panel de droite permet de définir des options pour le graphique, notamment son type (ici `bar chart`) et le titre associé (ici `RAM postgresql`)
![option](/img/guide/grafana_first_visualization_option.png)


---
Tout en haut à droite se trouve 3 boutons:
![visualization_save](/img/guide/grafana_visualization_save.png)

- `Discard`: Annule la création de la visualisation
- `Save`: Créer la nouvelle visualisation et sauvegarde le dashboard
- `Apply`: Créer la nouvelle visualisation

Cliquer sur `Apply` pour créer la visualisation

---
Votre nouvelle visualisation est maintenant sur votre dashboard !
![first_dashboard](/img/guide/grafana_first_dashboard.png)

Grâce au bouton `Add`, il est possible de créer d'autres visualisations et ensuite de les agencer comme vous le voulez.

A côté du bouton `Add` se trouve le bouton pour sauvegarder le dashboard, cliquer dessus:

![first_dashboard_save](/img/guide/grafana_dashboard_save.png)

Remplir les informations et cliquer sur `Save`

---
Votre dashboard est maintenant disponible dans la liste des dashbords
![dashboard_list](/img/guide/grafana_list_dashboard_final.png)

## Aller plus loin
La communauté propose des dashboards pré-définis pour la plupart des outils.

Quelques liens utiles concernant les dashboard:
- <https://grafana.com/grafana/dashboards>: Dashboards créés par la communauté
- <https://promcat.io>: dashboards créés par la société Sysdig basés sur le principe des golden signals
- <https://prometheus.io/docs/prometheus/latest/querying/basics>: Documentation sur le langage PromQL, permettant d'interroger Prometheus
- <https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/import-dashboards>: Comment importer un dashboard dans grafana

