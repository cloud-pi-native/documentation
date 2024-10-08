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

Les étapes d'après expliquent les informations demandées pour créer une alerte:
- Donner un nom à son alerte
![create_alert_step_1](/img/guide/alerting/create_alert_step_1.png)

---
- Choisir `Mimir or Loki alert` et `Prometheus` comme datasource

:warning: **La métrique choisie doit renvoyer vraie quand l'alerte doit être levée** :warning:

Par exemple ici, AlertManager surveille le nombre de pod pgrest ready et s'il est inférieur à 1, cela lève l'alerte
![create_alert_step_2](/img/guide/alerting/create_alert_step_2.png)

---
- Pendant combien de temps la métrique doit être évaluée à vrai avant de lever l'alerte
![create_alert_step_3](/img/guide/alerting/create_alert_step_3.png)

---
- Choisir le namespace et le groupe (voir capture d'écran après pour savoir à quoi cela correspond)

:warning: **Pour créer un nouveau namespace/groupe, remplir la zone de texte et valider en appuyant sur la touche `entrée`** :warning:

![create_alert_step_4](/img/guide/alerting/create_alert_step_4.png)

*Affichage des alertes selon le namespace et le groupe*
![alert_ns_group](/img/guide/alerting/alert_ns_group.png)

---
- Il est possible de définir des labels supplémentaires quand l'alerte est levée, comme le label `refapp`

:warning: **Pour créer un nouveau label, remplir la zone de texte et valider en appuyant sur la touche `entrée`** :warning:
![create_alert_step_5](/img/guide/alerting/create_alert_step_5.png)

---
- Remonter en haut de la page et cliquer sur le bouton `Save and exit` pour sauvegarder l'alerte

### Etat des alertes
Une alerte a 3 états différents:
- **Normal**: le service tourne normalement
- **Pending**: changement d'état en cours
- **Firing**: le service n'est plus assuré et l'alerte est levée

Service Normal
![alert_ns_group](/img/guide/alerting/alert_ns_group.png)

Service Firing
![alert_firing](/img/guide/alerting/alert_firing.png)

## Points de contact
Les contact points définissent les différents canaux qu'il est possible d'utiliser pour notifier d'une alerte (les plus courants étant les emails et les webhook)

Cliquer sur `Contact points` dans le menu.

Dans la liste déroulante `Choose Alertmanager`, choisir `Alertmanager`
![contact_point_manager](/img/guide/alerting/contact_point_manager.png)

Cliquer sur le bouton `+ Add contact point`

Remplir les informations selon le canal voulu, exemple pour un webhook:
![contact_point_create](/img/guide/alerting/contact_point_create.png)

Dans le sous menu `> Optional webhook settings` il est possible de retrouver les options d'authentification pour les webhooks

## Politiques de notifications
Les alertes levées sont normalement envoyées via le canal de communication défini par défaut dans les contact points.

Il est possible de définir d'autres politiques pour envoyer certaines alertes à d'autres canaux de communication.

Cliquer sur `Notification policies` dans le menu

Dans la liste déroulante `Choose Alertmanager`, choisir `Alertmanager`
![contact_point_manager](/img/guide/alerting/contact_point_manager.png)

La première politique sera celle par défaut (choisir un canal approprié pour les recevoir), il est possible par la suite de définir des politiques imbriquées pour router les alertes selon des règles spécifiques

---
La liste déroulante `Default contact Point` permet de choisir le canal de communication par défaut.
![policy_default](/img/guide/alerting/policy_default.png)
Cliquer sur `Add default policy` pour sauvegarder

---
Il est par la suite possible de définir des politiques imbriquées.

Choisir où l'imbrication se fera et cliquer sur le bouton `+ New nested policy`

Une nouvelle fenêtre s'ouvre, où il est possible de choisir les alertes selon l'existence d'un label, etc. (attention le bouton `Add policy` se trouve en bas)

Exemple si le label `refapp`est égal à `demo`, alors l'alerte est routée vers le point de contact nommé `opsdroid`
![notification_policy_nested_create](/img/guide/alerting/notification_policy_nested_create.png)

Cliquer sur `Add policy` pour créer la nouvelle politique imbriquée, que l'on retrouve sous celle par défaut dans cet exemple:
![notification_policies](/img/guide/alerting/notification_policies.png)
