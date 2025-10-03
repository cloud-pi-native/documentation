# Observabilité


Dans le cadre de l'offre Cloud-Pi Native, l'observabilité est disponible via plusieurs composants:
- Prometheus pour les métriques et les dashboards de sécurité
- Loki pour les logs
- Grafana pour les dashboard et les alertes

Ces différents services sont accessibles via la console `Cloud Pi Native > Projet > Mes Projets > Sélectionner un projet > Services externes`

![observabilité](/img/agreement/acces_services_observabilité.png)

## Métrique
[Prometheus](https://grafana.com/products/cloud/metrics/) est utilisé pour récupérer, stocker et visualiser (via [Grafana](https://grafana.com/grafana/)) les métriques d'infrastructure ainsi qu'applicative.

> __:warning: Les métriques sont disponibles pendant un an sur les environnements de production et quelques mois pour les environnements hors production.__

Pour apprendre à utiliser ce service, [cliquer ici](/guide/metrics)

## Alerting
[AlertManager](https://grafana.com/docs/grafana/latest/alerting/fundamentals/alertmanager/) est utilisé pour gérer les différentes alertes de vos projets.

Par défaut, aucune alerte n'est mise en place.

Pour apprendre à créer une alerte, [cliquer ici](/guide/alerting.md)

## Dashboard
Des dashboards [Grafana](https://grafana.com/grafana/) pour consulter les métriques, les logs ainsi que des indicateurs de sécurité sont fournis par défaut pour son projet :

![dashboard par defaut](/img/agreement/dashboard-defaut.png)

Pour consulter les dashboard de sécurité, [cliquer ici](/guide/dashboardsecurite.md)


## Dashboard as code

À partir de la version 9.4.0 de la console, une fonctionnalité *Dashboard as code* est disponible.

Lors de la création d'un projet (ou lors du reprovisionnement d'un projet pour les projets créés avant la version 9.4.0 de la console), un nouveau repo de code est automatiquement créé dans gitlab : infra-observability

![repo infra-observability](/img/agreement/repo-infra-observability.png)

Ce repo de code contient 2 types de fichiers :
 - Des Dashboard grafana sous forme de fichiers .json dans le répertoire "/files/dashboards/"
 - Des alertes sous la forme de fichiers .yaml.tpl  dans le répertoire /files/rules/

L'ajout de fichier dans ces répertoires sont automatiquements déployés dans grafana (peut prendre jusqu'à 3 minutes pour se synchroniser).

Afin de sauvegarder un dashboard dans Cloud Pi Native, il est nécessaire d'exporter le contenu JSON d'un dashboard depuis Grafana puis de copier le contenu dans un fichier /files/dashboards/mondashboard.json.

Pour cela depuis un dashboard cliquez sur *share* :
![share](/img/agreement/dashboard-share.png)

Puis *Export* et *View JSON*
![export](/img/agreement/dashboard-export-view-json.png)

Enfin cliquez sur Copy to Clipboard
![copy](/img/agreement/dashboard-copy-to-clipboard.png)

La synchronisation du repo de code gitlab *infra-observability* vers *Grafana* se fait via une *Application ArgoCD* nommée [env]-[projet]-observability :
![argo](/img/agreement/argocd-dashboard-as-code.png)

Un objet de type Kubernetes *GrafanaDashboard* est créé pour chaque dashboard créé *as code*. En cas d'erreur sur le contenu du JSON, les erreurs seront visibles depuis cet objet via ArgoCD.

> À noter que seule la branche **main** est synchronisée


La video suivante illustre cette fonctionnalité

<video width="640" height="480" controls>
  <source src="https://cpin-public-ressources.s3.fr-par.scw.cloud/documentation/cloud-pi-native/dashboard-as-code.mp4" type="video/mp4" />
</video>

## Logs
Le couple Loki/Grafana est utilisé pour vous donner accès à vos logs.

> __:warning: Les logs ne sont conservés que sur une durée de 30 jours.__

Pour les besoins de conservation au delà de 30 jours, le projet doit mettre en place un collecteur de logs (rsyslog, fluentbit, fluentd, vector, kafka, ...) dans le périmètre de son application afin de récupérer le flux de logs et les stockés sur un autre support (S3 par exemple)

Les logs peuvent être transmises via le protocol HTTP, syslog ou vers un kafka.

Pour bénéficier de ce service, merci de créer un ticket auprès de la ServiceTeam.

Un exemple de mise en place d'un collecteur de log avec le produit [vector](https://vector.dev/) vers un bucket AWS S3 est disponible [ici](/guide/archive-logs.md)
