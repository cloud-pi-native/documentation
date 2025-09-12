# Dasboard Sécurité

Retrouver ce service dans la console Cloud Pi via le menu `Projet > Mes Projets > Sélectionner un projet > Mes Services` et cliquer sur l'icône Grafana correspondant au cluster sur lequel votre déploiement applicatif est présent.

Dans cette section, nous allons découvrir comment créer un nouveau dashboard contenant un graphique.

## Connexion
Pour visualiser vos métriques, sélectionner Grafana dans le tableau de bord "Mes Services".

Pour se logguer, cliquer sur le bouton en bas de page commençant par "Sign in with..."

![signin](/img/guide/grafana-sign-in.png)

Une fois connecté, l'accès aux dashboards est disponible via la menu hamburger en haut à gauche

![menu](/img/guide/grafana_menu.png)
![menu dashboard](/img/guide/grafana_menu_dashboard.png)

Par défaut, les équipes de Cloud Pi Native ont prévu un dashboard reprenant les informations d'infrastructure (CPU/RAM/Quota/Réseaux/Stockage) de vos différents namespace ainsi que des dashboard de sécurité Kyverno/Trivy/Falco

![dashboard_infra](/img/guide/dashboard_infra.png)

### Kyverno
Le dashboard [PolicyReport](/img/guide/kyverno.png) remonte les informations l'état de la conformité des règles Kyverno. La consultation permet d'avoir le détail du nombre de règles respecté ou non ainsi que les règles en question.

### Trivy
Le dashboard [Trivy Operator](/img/guide/trivy_dashboard.png) permet de consulter les vulnérabilités (CVE) et criticité pour les différentes workload ainsi que leur évolution dans le temps.

### Falco
Le Falco dashboard permet d'avoir une vision au runtime des activités anormales (Lancement d'un shell dans un container, etc ...).