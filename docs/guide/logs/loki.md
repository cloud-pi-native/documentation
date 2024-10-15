# Loki

Les logs sont gérés via la solution [Loki de Grafana](https://grafana.com/oss/loki/)

Retrouvez ce service dans la console Cloud Pi Native via le menu `Projet > Mes Projets > Sélectionner un projet > Mes Services` et cliquer sur l'icône Grafana qui vous intéresse.

## Connexion

Pour se logguer, cliquer sur le bouton en bas pour utiliser l'authentification par SSO.

![login](/img/guide/logs/loki/connexion.png)

## Premiers pas

Pour explorer vos logs de façon ponctuelle, sélectionner **Explore** dans le menu de gauche, puis **Loki** dans la liste déroulante

![explore](/img/guide/logs/loki/explore.png)

Dans la liste déroulante *label filters*, sélectionner `namespace` puis dans *select value* choisir le bon namespace.

Cliquer sur le bouton bleu **Run query** pour retrouver tous les logs générés par votre application dans le namespace choisi:

![premierspas](/img/guide/logs/loki/premierspas.png)

Il est aussi possible de filtrer selon le texte contenu dans une ligne de log, pour cela dans le champ de texte **Line contains** mettre la chaîne de caractère recherchée:

![premierspas_contains](/img/guide/logs/loki/premierspas_contains.png)

## Filtrage par label

Loki permet de filtrer les logs via un système de label.

Certains labels sont statiques (générés par l'équipe CPiN) et il est aussi possible de créer des labels à la volée via le langage LogQL.

Pour les labels statiques:

- cluster: nom du cluster où est déployée l'application
- container:
- job:
- namespace: le namespace où est le pod générant les logs
- service_name:
- stream: la sortie des logs, stdout ou stderr
- tenant:

### Labels dynamiques

Il est possible de créer des labels à la volée en utilisant les fonctions LogQL suivantes qui permettent de parser la ligne de log:

- [json](https://grafana.com/docs/loki/latest/query/log_queries/#json): utilisable si la ligne est au format json
- [logfmt](https://grafana.com/docs/loki/latest/query/log_queries/#logfmt): utilisable si la ligne est de la forme *clé=valeur*
- [pattern](https://grafana.com/docs/loki/latest/query/log_queries/#pattern): quand les données forment un pattern régulier (exemple log apache)
- [regexp](https://grafana.com/docs/loki/latest/query/log_queries/#regular-expression): utilise une expression régulière pour parser la ligne de log

Les parseurs json et logfmt sont à préférer quand cela est possible. Si cela n'est pas possible mais que les données forment un pattern régulier (champs séparés par un espace mais sans clé=valeur par exemple) il vaut mieux utiliser le parseur pattern (plus simple à écrire et plus rapide à exécuter). Pour le reste, il est possible d'écrire une [regex](https://regex101.com/) (format golang) avec le parseur regexp

Pour les exemples suivants, la sélection des logs se fait via `{namespace="mi-demo"}`

#### Json

Pour parser la ligne suivante:

```json
{
  "protocol": "HTTP/2.0",
  "servers": ["129.0.1.1", "10.2.1.3"],
  "request": {
    "time": "6.032",
    "method": "GET",
    "host": "foo.grafana.net",
    "size": "55",
    "headers": {
      "Accept": "*/*",
      "User-Agent": "curl/7.68.0"
    }
  },
  "response": {
    "status": 401,
    "size": "228",
    "latency_seconds": "6.031"
  }
}
```

Avec la ligne LogQL `{namespace="mi-demo"} | json` cela donne (à noter que les tableaux disparaissent):

```txt
"protocol" => "HTTP/2.0"
"request_time" => "6.032"
"request_method" => "GET"
"request_host" => "foo.grafana.net"
"request_size" => "55"
"response_status" => "401"
"response_size" => "228"
"response_latency_seconds" => "6.031"
```

#### logfmt

Pour parser la ligne suivante:

```log
at=info method=GET path=/ host=grafana.net fwd="124.133.124.161" service=8ms status=200
```

Avec la ligne LogQL `{namespace="mi-demo"} | logfmt` cela donne:

```txt
"at" => "info"
"method" => "GET"
"path" => "/"
"host" => "grafana.net"
"fwd" => "124.133.124.161"
"service" => "8ms"
"status" => "200"
```

#### Pattern

Ligne de log:

```log
0.191.12.2 - - [10/Jun/2021:09:14:29 +0000] "GET /api/plugins/versioncheck HTTP/1.1" 200 2 "-" "Go-http-client/2.0" "13.76.247.102, 34.120.177.193" "TLSv1.2" "US" ""
```

LogQL: `{namespace="mi-demo"} | pattern <ip> - - <_> "<method> <uri> <_>" <status> <size> <_> "<agent>" <_>`

Champs extraits:

```txt
"ip" => "0.191.12.2"
"method" => "GET"
"uri" => "/api/plugins/versioncheck"
"status" => "200"
"size" => "2"
"agent" => "Go-http-client/2.0"
```

## Dashboards

Loki étant fortement intégré à l'écosystème Grafana, il est possible d'utiliser des requêtes LogQL pour extraire des métriques et en faire des dashboards.

Pour l'exemple suivant, les logs utilisés sont au format apache:

```log
10.129.4.2 - - [15/Oct/2024:08:22:34 +0000] "GET / HTTP/1.1" 200 734 "-" "kube-probe/1.26" "-"
10.131.4.226 - blackboxchargement [15/Oct/2024:08:22:05 +0000] "GET /chargement?limit=1&order=id.desc&select=status:status_chargement HTTP/1.1" 200 - "" "Blackbox Exporter/0.24.0"
```

Ces lignes représentes les champs suivants (séparé par des espaces):

- ip
- identité
- utilisateur
- date
- requête
- status http
- taille de la réponse
- en-tête Referer
- en-tête User-Agent

Pour l'exemple, l'utilisateur va être extrait de la ligne pour voir dans le temps qui fait des requêtes sur l'api:
![dashboard](/img/guide/logs/loki/dashboard.png)

La requête LogQL utilisée est la suivante: `rate({namespace="mi-demo", service_name="api"} | pattern '<ip> - <user> <_>' | keep user[$__auto])`

`{namespace="mi-demo", service_name="api"}`: permet de sélectionner la source des logs
`| pattern '<ip> - <user> <_>'`: applique un pattern sur la ligne de log, pour ne garder que l'ip et l'utilisateur (_ permet de dire que le champ n'est pas intéressant)
`| keep user`: permet de ne garder que le label **user**

`rate( <expr> [$ auto])`: calcul le nombre d'appel par utilisateur au fil du temps

*La représentation graphique dans l'exemple est une heatmap*

## Aller plus loin

La documentation de Loki se trouve [ici](https://grafana.com/docs/loki/latest/)

Plus d'informations concernant la syntaxe de requêtage (LogQL) [ici](https://grafana.com/docs/loki/latest/query/)
