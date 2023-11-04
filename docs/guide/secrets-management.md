# Gestion des secrets sur DSO

> La gestion des secrets est en cours de mise en oeuvre sur la forge DSO.

Le déploiement applicatif suit le principe gitOps et donc de "pousser" l'ensemble des manifestes et charts helm sur un repository GIT. Cependant, ce principe ne peut s'appliquer aux secrets afin de ne pas divulger le contenu d'un secret dans l'historique du repository.

Une première solution de mise en oeuvre avec [SOPS](https://github.com/mozilla/sops) est proposée. Ainsi, sur ce principe le secret est toujours poussé sur un repo git mais chiffré par une clé asymétrique dont la clé privée n'est connue que du Cluster Openshift et la clé publique accessible à tous les projets.

Pour cela des paires de clés au format age ont été générées sur les différents clusters dont voici les clés publiques:
 * Cluster c4 (applications clientes - environnement OVH via la Console Cloud PI): age1g867s7tcftkgkdraz3ezs8xk5c39x6l4thhekhp9s63qxz0m7cgs5kan9a
 * Cluster 4-7 (tests internes DSO) : age1q0zku56p802ul44uhzc24ngvehfurq72p0pcu9gegezn40ukmc7qlpq56n

```bash
export AGE_KEY=age1g867s7tcftkgkdraz3ezs8xk5c39x6l4thhekhp9s63qxz0m7cgs5kan9a
```

Afin de chiffrer un secret, il faut commencer par créer un objet kubernetes de type SopsSecret par exemple :
```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
  name: mysecret-sops
spec:
  secretTemplates:
    - name: secret-exemple
      labels:
        label1: label1-value1
      annotations:
        key1: key1-value
      stringData:
        data-name0: data-value0
      data:
        data-name1: ZGF0YS12YWx1ZTE=
    - name: token-exemple
      stringData:
        token: supersecrettoken
    - name: docker-login
      type: "kubernetes.io/dockerconfigjson"
      stringData:
        .dockerconfigjson: '{"auths":{"index.docker.io":{"username":"user","password":"pass","email":"toto@example.com","auth":"dXNlcjpwYXNz"}}}'
```

Ce fichier **ne doit pas** être commité et envoyé sur un repo git et rester uniquement en local. Seul la version chiffrée peut être envoyée sur le repo GIT.

Il convient donc de chiffrer ce fichier via SOPS avec la clé publique correspondant à l'environnement. Par exemple sur l'environnement 4 7 :

```bash
sops -e --age $AGE_KEY --encrypted-suffix Templates secret.sops.yaml > secret.sops.enc.yaml
```

Attention, le fichier chiffré doit conserver l'extension .yaml

Le contenu du fichier devient alors :

```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
    name: mysecret-sops
spec:
    secretTemplates:
        - name: ENC[AES256_GCM,data:GCTwnqz3qLWBltXkI1E=,iv:6s/89KUaymATUyyiavb1JQdndbvBY5XrBwdqg7Zp7nM=,tag:LcEyQU0/UvYWt7YCyGiFpw==,type:str]
          labels:
            label1: ENC[AES256_GCM,data:YKnixwbNsFPccmx7Kw==,iv:TQNNfHyvcJaXTnuNAi7iq/HHGpjtIN3SInxds1aWJpM=,tag:LCHNCjIQ8lrKRzlHIflYRA==,type:str]
          annotations:
            key1: ENC[AES256_GCM,data:IrcoTdCj0sS+tA==,iv:W5ccDu7jna7fP/ZfQ6cYaQX/uqU9PjKJ83PgJpHR9b0=,tag:4UDYI4WHXgipY8wXZu/NhA==,type:str]
          stringData:
            data-name0: ENC[AES256_GCM,data:t431CrKunuDACSw=,iv:pou2IIpBl6LeKloCC1yGzHA8Vkt/0Jo0nu8M4e+8XW0=,tag:kkuw1HXkSCS9f5K73MBEgw==,type:str]
          data:
            data-name1: ENC[AES256_GCM,data:p7ffMnDqVKj8Vog=,iv:KI07DuHBarC4du/sqrLus4o9s7o5knu/wu3W8ssO4e8=,tag:TgKXwVJJGEI9H5jWM5Ca4A==,type:str]
        - name: ENC[AES256_GCM,data:isdJvbWonL593lfI4w==,iv:bpHG0fsIXWcmJ3fCDebKXeFGWNrHfHRWTQ86e+Dgruw=,tag:HmgDZLLssR+roPBSsSrizw==,type:str]
          stringData:
            token: ENC[AES256_GCM,data:QYXc7S8EHkSblo7RDW9Ovw==,iv:9lJcVQ5EJR+LYVFX/0OUJ+uZqQx0kiL2Kze8OJ3fu0M=,tag:QDpVKlSS1jj+OnWzpfCW2Q==,type:str]
        - name: ENC[AES256_GCM,data:pHr2cwiFjGsIBZj+,iv:x1TkramaD0peRJe95n+r+ye5IWeeE630C0LwbVWJ154=,tag:7TiqbtURY7fn+9r2V7PlDA==,type:str]
          type: ENC[AES256_GCM,data:8ZBm++dOCx4xlmPW4bZagHMVua5gj7v7GVkEtBRX,iv:Y8HYgfO8Ae9SY3WYF/BYhKY9n6KESwQEHMNUPZfQd9o=,tag:LqlUy6FLcYAtYEa8qtx5NQ==,type:str]
          stringData:
            .dockerconfigjson: ENC[AES256_GCM,data:1TmIvfP95WReEpGqF2/ukxkvyFVdYbO3gda+oAtNZqwRZw749qvU8koYsi012s1/yhutll5v3ldqUYtr4sNuVS7TFVy2/qZ+ryiBaI8qUxt+kOx85eyfp36pJolwQtdQPNanRTLLkV4mf1JzSYOG6WAokkQ=,iv:X1jzTyp+CzTIowxH6gl2cIInk892cuO9/5JUkuCJdqI=,tag:DbtJe3pRo8TMrBO/gt4BDw==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age1g867s7tcftkgkdraz3ezs8xk5c39x6l4thhekhp9s63qxz0m7cgs5kan9a
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBTZFJGdkRzeVJFdDVUVjVS
            SmU0ekE0aGplVzhxZm5UTklzZnA3QlIwRzNNCjJha21CU0VEZkt3SHB0THlVZ1ZM
            VnlBSEZpbmJZVnlyY1VCTjdXZEtOR2cKLS0tIHBhRkprelpsQTJZWGphYUtRSlhJ
            ZnpFSDNYT0M3K294VmlBVitmN09nUlUKI+THCBdEkTnAElA3b0z4r8Nx1KcW7gks
            H5xJwqzzNn5C+UMy+v+Qn2hzg07juISBTDVcLtBDggVrZOAsh8kTMQ==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2023-04-18T15:02:34Z"
    mac: ENC[AES256_GCM,data:Cpl1/GWn2LQivSo0qNTGyDxqCxm79DnomIpf1uDsoIuA5qqsluCUja0RLkEOm/fUD+UKzL8Muaqjo8+fbuKOvr4nfqaeARACPz377tdPEH55DHyg8Czv00OsxdHZ8C9BGeeSZr3YHDqQEKqQpK1zs7rBz/2adqD1SXrOFu+aiuQ=,iv:w+4DAXVAvD7IvDCBMTF+NfMRctp0dEWl+QsRJPsrd70=,tag:fWa0Sz3TlCQ2lIkVe6zE4Q==,type:str]
    pgp: []
    encrypted_suffix: Templates
    version: 3.7.3
```

Ce fichier peut être commité et envoyé sur un repo git car le contenu est chiffré.

> A noter que chaque élément du secretTemplates donnera lieu à un objet Secret dans kubernetes une fois le secret déchiffrée lors du déploiement. 
Ainsi, dans l'exemple, le secret secret-exemple sera crée avec les données suivantes
```yaml
data:
  data-name0: ZGF0YS12YWx1ZTA=
  data-name1: ZGF0YS12YWx1ZTE=
```
Le secret peut alors être utilisé directement par les POD de façon classique, par exemple :

```yaml
    spec:
      containers:
        - name: myContainer
          image: myImage:MyTag
          env:
            - name: My_SECRET
              valueFrom:
                secretKeyRef:
                  name: secret-exemple
                  key: data-name0
```

## Chiffrement partiel

Il est aussi possible de chiffrer **partiellement** le SoapSecret si celui-ci contient des données plus ou moins sensibles si dans le fichier suivant on veut chiffrer que la clé password

```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
  name: mysecret-sops
spec:
  secretTemplates:
    - name: exemple
      data:
        password: c2VjcmV0
        clearValue: ZGF0YS1jbGVhcg==
```

Il sera possible de définir une **encrypted_regex** qui défini le regex pattern des clés que l'on souhaite chiffrer, dans le fichier de configuration **.sops.yaml** à la racine du projet.

```yaml
creation_rules:
  - path_regex: .*newsecret.sops.yaml.*
    encrypted_regex: "^.*password.*$"
    age: age1g867s7tcftkgkdraz3ezs8xk5c39x6l4thhekhp9s63qxz0m7cgs5kan9a
```

Je chiffre mon secret

```bash
sops -e newsecret.sops.yaml > newsecret.sops.enc.yaml
```

Le fichier de sorti aura le format suivant, on peut voir que seul la clé **password** a été chiffrée

```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
    name: mysecret-sops
spec:
    secretTemplates:
        - name: exemple
          data:
            password: ENC[AES256_GCM,data:0yl7pmw7,iv:EH29fOotz0gKKEGesOO2v7fwM8FPtBgpBpZQllnP9K0=,tag:GQVbRh6rhYCdquk2wOInzw==,type:str]
            clearValue: ZGF0YS1jbGVhcg==
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age1g867s7tcftkgkdraz3ezs8xk5c39x6l4thhekhp9s63qxz0m7cgs5kan9a
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBZU3d0Z2N6QytuaHZWTXBm
            QlRlV2RCM2ZKZW1DZ0lLT0xQdjUxKzVGYlRrCnMrT0hINTdBYkZaMDZzYlVHci9w
            TGRHcUIzcEZqZGdsYVdxcERGdE9xRmsKLS0tIGdBL0NSNDdRYVVHRFU2WUQxS1Fw
            SG5sa1ZJRUNjOWY5QURpcHZrWDI2SjAKO8hY5sVJ4wixFzN+Q7QB8MEheizsmKrB
            m5JPbGUHmC15/HzSb0o8UFGXoi2MeDMie8hMu+A8uqVIhiBUrga3FA==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2023-04-20T14:31:45Z"
    mac: ENC[AES256_GCM,data:17CYI5VKgxnc5Ae9dY/cwBu0d2hFKC+xdN5Y5vIIqdvXF6IOQKPQRwdNSXaLIjFWo9Xk+NP0nzAFbqyrIAR7hgGg5uWE0dAaWQw6NKgWvDIBWPU/Et2JuuBlbmny3cO//geij3XiODDAXxUg19XIDol0+f1Q5IPgPrtghKs6YC4=,iv:4YnMWSD23xRwNIiiAXMTM44ORq03J5dBNKkn9yE7bXw=,tag:Q+3SfVPTJjp777qlOwEEBg==,type:str]
    pgp: []
    encrypted_regex: ^.*password.*$
    version: 3.7.3
```
