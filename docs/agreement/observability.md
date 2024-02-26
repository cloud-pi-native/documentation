

# Observabilité

Dans le cadre de l'offre Cloud-Pi Native, l'observabilité est disponible via plusieurs composants:
- Prometheus/Grafana pour les métriques
- AlertManager/Grafana pour l'alerting
- ElasticSearch/Kibana pour les logs

Ces différents services sont accessibles via la console `Cloud Pi Native > Projet > Mes Projets > Sélectionner un projet > Mes Services`

![observabilité](/img/agreement/acces_services_observabilité.png)

## Métrique
[Prometheus](https://grafana.com/products/cloud/metrics/) est utilisé pour récupérer, stocker et visualiser (via [Grafana](https://grafana.com/grafana/)) les métriques d'infrastructure ainsi qu'applicative.

> __:warning: Les métriques sont disponibles pendant un an sur les environnements de production et quelques mois pour les environnements hors production.__

Pour apprendre à utiliser ce service, [cliquer ici](/guide/metrics)


## Alerting
[AlertManager](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alertmanager/) est utilisé pour gérer les différentes alertes de vos projets.

Par défaut, aucune alerte n'est mise en place.

Pour apprendre à créer une alerte, [cliquer ici](/guide/alerting.md)

## Logs
Le couple Elastisearch/Kibana est utilisé pour vous donner accès à vos logs.

> __:warning: Les logs ne sont conservés que sur une durée de 7 jours.__

Pour couvrir d'autres besoins, le projet doit mettre en place un collecteur de logs (rsyslog, fluentbit, fluentd, vector, kafka, ...) dans son application.

Les logs seront transmis via le protocol HTTP, syslog ou vers un kafka.

Pour bénéficier de ce service, merci de créer un ticket auprès de la ServiceTeam.

Pour apprendre à utiliser kibana,  [cliquer ici](/guide/logs-kibana.md)

Un exemple de mise en place d'un collecteur de log avec le produit [vector](https://vector.dev/) vers un bucket AWS S3 est disponible [ici](/guide/archive-logs.md)