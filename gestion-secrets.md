# Gestion des secrets sur DSO

La gestion des secrets est en cours de mise ne oeuvre. Le déploiement applicatif suit le principe gitOps et donc de "pousser" l'ensemble des déploiements et charts helm sur un repository GIT. Le problème est de pousser un secret kubernetes et qui se retrouve donc accessible.

Une première solution de mise en oeuvre avec [SOPS](https://github.com/mozilla/sops) est proposée. Ainsi, sur ce principe le secret est toujours poussé sur un repo git mais chiffré par une clé asymétrique.

Pour cela des paires de clés au format age ont été générées sur les différents clusters dont voici les clés publiques:
 * Cluster 4-7 : age1v34shlqv52vggpp54e3fn93rna2wek84s40lkv6wlzjun5xm
 * Cluster 4-8 : TO BE DONE
 * Cluster 4-5 : TO BE DONE

Afin de chiffrer un secret, il faut commencer par créer un secret par exemple :
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

> Les valeurs d'un objet secret dans kubernetes sont stockés au format base64 :  
  * YWRtaW4= : admin
  * MWYyZDFlMmU2N2Rm : 1f2d1e2e67df

Ces valeurs peuvent se décoder très facilement :

```bash
$ echo "MWYyZDFlMmU2N2Rm" | base64 -d
1f2d1e2e67df
```

Ce fichier **ne doit pas** être commité et envoyé sur un repo git et rester en local.

Ensuite, il faut chiffrer ce fichier via SOPS avec la clé publique correspondant à l'environnement. Par exemple sur l'environnement 4 7 :

```bash
sops --encrypt --age age1v34shlqv52vggpp54e3fn93rna2wek84s40lkv6wlzjun5xm secret.sops.yaml > secret.sops.yaml
```

Le fichier chiffré doit conserver l'extension .yaml

Le contenu du fichier devient alors :

```yaml
apiVersion: ENC[AES256_GCM,data:6jk=,iv:lv9mcOt+B2j5MdAj4otkM/i/n0zWu6LuLJ8dvX0JKT4=,tag:iIqB+o+g2sAj6zOA+4lN4A==,type:str]
kind: ENC[AES256_GCM,data:Tizrk3DL,iv:T3NHIidEvQOAd/TURdg0i2IITQvVk6uk0cWczk6GVho=,tag:/RgSCxBL08fRqMXDLetRew==,type:str]
metadata:
    name: ENC[AES256_GCM,data:ced2MXWLpvs=,iv:uIb7G7soczd13mXUL0ETwrto8n02zTYLUcW3oErotVA=,tag:r1RBTJSlksyCeftH3mH60w==,type:str]
type: ENC[AES256_GCM,data:NmecC9UM,iv:qFpB66dQ2gxh6aJFG3eVwXASDoFiiohFRloi2PY+hiE=,tag:Vy5u36J9u4ZBSGETgEYYaw==,type:str]
data:
    username: ENC[AES256_GCM,data:OXGYgoGcidA=,iv:iFpRqLoY9SsXKUg1X+12UYYSKFWLRnApTkmzYb+EwZE=,tag:IsHcZiuuPntBxs1L/FNCiw==,type:str]
    password: ENC[AES256_GCM,data:5LB1rQMM2TZO55+g4reriA==,iv:76S+SDT4oqeN4Kv/NvrLMCQJL9d0xq2itSSiXVh1O1w=,tag:P2OKKZzfIDW2DS7PLo3qWw==,type:str]
sops:
    kms: []
    gcp_kms: []
    azure_kv: []
    hc_vault: []
    age:
        - recipient: age1v34shlqv52vggpp54e3fn93rna2wek84s40lkv6wlzjun5xm6ekqemjhn3
          enc: |
            -----BEGIN AGE ENCRYPTED FILE-----
            YWdlLWVuY3J5cHRpb24ub3JnL3YxCi0+IFgyNTUxOSBhYXFOTHAyOEFVV0pWUE1p
            YXBUSzZRTVhnY1lLN1phZHFRR1pxU3Nya0EwClZOLzBseWxWdmpwc01INlFRamxL
            SzFNT1pmakZTVDVOMEdrU0lHVGdNZTgKLS0tIFJxT1RVd04vOTFMaEh4SktSblYx
            SzZzUndqN0xuMnhqeUdNcHVMcWdYYUEKRjJDAHmJVOfdgIKmxGkD1RvUJ88tYOKC
            w9FZSbAFfggbv1K7td8bkv+7EdV4QgmnN6P2XdGkQDus2bDdkYSo7A==
            -----END AGE ENCRYPTED FILE-----
    lastmodified: "2023-04-17T15:45:02Z"
    mac: ENC[AES256_GCM,data:TCTJnB56twm94iacmQaEFohteHF9vbRwbrW83HJZc01kd8WRPl6m3Ci1j14hjsgrOWYA6ZCs+LMTANc6IAdpNUzdL1FUQQgrRQFQnOR7ZhKRtzDk5j39r/fYQnMAoqNlIvT2rdBy+iKQAn+Kr4zNv8c2NASLUVZFYQ1GaXKFSCQ=,iv:sHzN0JlrNna7nQwCDijntbSxS9A007iZn4AcW7Mb5hk=,tag:3zCCJPi8nt+R8+k66b6pEQ==,type:str]
    pgp: []
    unencrypted_suffix: _unencrypted
    version: 3.7.3
```

Ce fichier peut être commité et envoyé sur un repo git car le contenu est chiffré.

Il est nécessaire ensuite de créer un fichier afin de préciser :

```yaml
apiVersion: viaduct.ai/v1
kind: ksops
metadata:
  name: example-secret-generator
files:
  - ./secret.sops.yaml
```
Enfin dans le fichier kustomization, il faut préciser le générateur ci-dessus :

```yaml
generators:
  - ./secret-generator.yaml
```




