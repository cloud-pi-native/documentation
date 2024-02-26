# Archivage des logs

Il est possible de demander le forward des logs de son application vers son namespace applicatif afin de par exemple les archiver pour des raisons légales.

Cette section va décrire comment recevoir les logs applicatifs et les archiver sur un S3 grâce au logiciel [vector](https://vector.dev)

Vector est un ETL open-source édité par l'entreprise Datadog et est le choix recommandé d'OpenShift pour le traitement des logs.

Un chart helm est disponible [ici](https://artifacthub.io/packages/helm/vector/vector), voici comment le configurer pour démarrer un serveur http de réception des logs et les archiver sur un S3.

L'archivage des logs se fera par paquet (30min ou 100Mo) et sera stocké dans un dossier YYYY/MM/DD/...

Les clés de sécurité (AK/SK) sont sauvegardés dans un secret, voir avec [SOPS comment les chiffrer](/guide/secrets-management)

## Archivage

**Chart.yaml:**
```yaml
dependencies:
- name: vector
  version: "0.30.0"
  repository: "https://helm.vector.dev"
  condition: vector.enabled
```

**values.yaml:**
```yaml
vector:
  enabled: true
  commonLabels:
    app: tcnp-infra
    tier: logs
    component: vector
  podMonitor:
    enabled: true
  fullnameOverride: vector
  persistence:
    enabled: true
    size: 10Gi
  extraVolumes:
  - name: aws-creds
    secret:
      secretName: aws-log-archive
  extraVolumeMounts:
  - name: aws-creds
    mountPath: /var/aws/
  resources:
    requests:
      cpu: 100m
      memory: 200Mi
    limits:
      cpu: 100m
      memory:  200Mi
  customConfig:
    data_dir: /vector-data-dir
    api:
      enabled: true
      address: 127.0.0.1:8686
      playground: false
    sources:
      internal_metrics:
        type: internal_metrics
      http_server:
        type: http_server
        address: 0.0.0.0:8080
    sinks:
      prom_exporter:
        type: prometheus_exporter
        flush_period_secs: 3600
        inputs: [internal_metrics]
        address: 0.0.0.0:9090
      aws_s3_out:
        type: "aws_s3"
        acknowledgements:
          enabled: true
        tls: 
          verify_certificate: false
        inputs:
        - http_server
        endpoint: "https://monendpointS3"
        bucket: "logs"
        region: "eu-east-1"
        auth:
          credentials_file: /var/aws/credentials
        compression: "gzip"
        encoding:
          codec: "raw_message"
        key_prefix: "%Y/%m/%d/"
        buffer: 
          type: disk
          max_size: 268435488
        batch:
          max_bytes: 104857600
          timeout_secs: 1800
        tags:
          Project: monprojet

```

Les clés de sécurité (AK/SK):
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: aws-log-archive
type: Opaque
data:
  credentials: |-
              [default]
              aws_access_key_id = ++++++++++++
              aws_secret_access_key = ++++++++++++
```

:warning: **Pour profiter de ce service, ouvrir un ticket auprès de la ServiceTeam détaillant le namespace source, la méthode de transmission (http, kafka, syslog) ainsi que l'url (+ port) vers laquelle envoyer les logs.** :warning:

## Bonus: générer des métriques à partir des logs
Vector est capable de parser les logs afin d'en tirer des métriques.

Dans l'exemple précédent, le podMonitor ainsi que le service lié à prometheus sont démarrés, il ne reste plus que les instructions liées au parsage des logs pour avoir des métriques qui remontent dans grafana.

L'exemple suivant prendre en exemple des logs issus de postgrest (log au format apache combined).

Ainsi le log suivant: `127.0.0.1 bob frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.seniorinfomediaries.com/vertical/channels/front-end/bandwidth" "Mozilla/5.0 (X11; Linux i686; rv:5.0) Gecko/1945-10-12 Firefox/37.0"`

est parsé en:
```json
{
  "agent": "Mozilla/5.0 (X11; Linux i686; rv:5.0) Gecko/1945-10-12 Firefox/37.0",
  "host": "127.0.0.1",
  "identity": "bob",
  "message": "GET /apache_pb.gif HTTP/1.0",
  "method": "GET",
  "path": "/apache_pb.gif",
  "protocol": "HTTP/1.0",
  "referrer": "http://www.seniorinfomediaries.com/vertical/channels/front-end/bandwidth",
  "size": 2326,
  "status": 200,
  "timestamp": "2000-10-10T20:55:36Z",
  "user": "frank"
}
```

L'idée est de compter le nombre de requête par utilisateur (ici frank).


La propriété `transforms` permet de transformer ses logs (voir [documentation](https://vector.dev/docs/reference/configuration/transforms/) pour plus d'exemple).

Les transformations peuvent s'enchaîner, c'est ce qui est utilisé ici sélectionner, parser et remonter une métrique.

```yaml
vector:
  customConfig:
    sources:
      internal_metrics:
        type: internal_metrics
      http_server:
        type: http_server
        address: 0.0.0.0:8080
    transforms:
      remap: # Parse les logs reçus (format json) pour ne garder que le payload sans toutes les informations ajoutées par vector
        type: remap
        inputs:
          - http_server
        source: >-
          . =  parse_json!(.message)
      parse_pgrest_log: 
        # Check si le log reçu correspond est émis par le pod qui contient un label component:postgrest
        # Si c'est le cas, parse la clé message qui est au format apache combined
        type: remap
        inputs:
          - remap # Fait appel au transform précédent
        source: >-
          component, err = string(.kubernetes.labels.component)

          if err != null {
            abort
          }

          if !contains(component, "postgrest") {
              abort
          }

          . = parse_apache_log!(.message, "combined")
      pgrest_log_to_metrics:
        ## Transforme le log en métrique, ici compter le nombre de requête par utilisateur
        type: log_to_metric
        inputs:
          - parse_pgrest_log # Fait appel au transform précédent
        metrics:
          - type: counter
            field: user
            name: response_total
            namespace: tcnp
            tags:
              user: "{{ `{{user}}` }}"
    sinks:
      prom_exporter:
        type: prometheus_exporter
        flush_period_secs: 3600
        inputs:
        - internal_metrics
        - pgrest_log_to_metrics # Ajout du dernier transform afin d'avoir la métrique exposée au format prometheus
        address: 0.0.0.0:9090
```