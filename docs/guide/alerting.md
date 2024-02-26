# Alerting

Retrouver ce service dans la console Cloud Pi via le menu `Projet > Mes Projets > Sélectionner un projet > Mes Services` et cliquer sur l'icône Grafana qui vous intéresse.

Dans cette section, nous allons découvrir comment créer une alerte et la router vers un service web.

## Connexion
Pour visualiser vos métriques, sélectionner Grafana dans le tableau de bord "Mes Services".

Pour se logguer, cliquer sur le bouton en bas de page commençant par "Sign in with..."

![signin](/img/guide/grafana-sign-in.png)

Via la menu hamburger en haut à gauche, vous aurez accès aux dashboards.

![menu](/img/guide/grafana_menu.png)
![menu dashboard](/img/guide/grafana_menu_alerting.png)

## Créer une alerte
Dans le menu, sélectionner `Alert Rules`, vous retrouvez ici toutes les alertes définies.

Pour créer une alerte, cliquer sur le bouton `Create alert rule`
![create alert](/img/guide/grafana_create_alert.png)

...


## Routage des alertes
Par défaut les alertes sont envoyées par mail, nous allons voir comment définir un nouveau `Contact points` et une nouvelle `Notification policies` pour router les alertes sur un webhook.

