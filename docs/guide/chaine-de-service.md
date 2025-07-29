# Création automatique de Chaîne de Service : OpenCDS (au MI) - VERSION BETA

## Introduction

Lorsqu'un projet souhaite exposer un service sur le RIE depuis les infrastructures du ministère de l'intérieur, il doit faire une demande de chaîne de service. la chaîne de service (CDS) est composée d'un ensemble de composants réseau et de sécurités permettant d'exposer une URL à l'extérieur du ministère.

Pour créer une chaîne de service, deux macros opérations sont nécessaires :
 - Configurer les éléments réseaux pour exposer la cible;
 - Créer un enregistrement DNS correspondant au nom de domaine de son application et à destination du premier équipement de la CDS.

De plus, il est nécessaire d'être en possession :
 - D'un certificat SSL pour son URL : un secret au sens Kubernetes devra être créé par le projet avec les informations de ce certificat.
 - De connaitre le PAI de son projet.

La demande de réalisation de ces opérations est à faire par la création de tickets et les tâches associées sont relativement complexes, fastidieuses et impliquent différentes équipes. Elles prennent donc un temps non négligeable à prendre en compte dans le planning de son projet et le suivi de l'avancée de ces travaux par les projets est difficile.

> Le service OpenCDS vise à automatiser au maximum ces opérations.

Sur Cloud Pi Native, les différentes opérations de création d'une CDS peuvent être réalisées :
 - De façon classique : via demande à son chef de projet infrastructure, celui-ci va faire les différentes demandes et coordonner les travaux.
 - Via OpenCDS : créer un objet *ChaineDeService* et gérer sa demande de CDS via *Infrastructure as Code*

## Création d'une CDS en IaC

La création de CDS se fait en mode semi-automatique, c'est à dire que la création de CDS va créer un ticket MIN-ITIL pour demander la création d'un enregistrement DNS. A noter que le statut de l'objet ChaineDeService correspond uniquement à la configuration des éléments réseaux et non au traitement du ticket MIN-ITIL. Ainsi, une fois que le statut ChaineDeService est **Success**, il convient de vérifier que l'enregistrement DNS est créé afin que la CDS soit opérationnelle (il faut compter 24h à partir du passage du status à **Success**).

### Pré-requis

Il convient dans un premier temps de faire les demandes de PAI au BPAH et de certificat au BCS. Une fois ces éléments en main, il est possible de créer un objet ChaineDeService afin de lancer les processus de configuration des éléments réseaux ainsi que la demande de création de DNS.

Cet objet prend les paramètres suivants :

| spec | obligatoire | valeurs | description | default |
| :----| :--------| :-------| :-----------| :-------|
| network | obligatoire | RIE | choix du type d'exposition | n/a |
| commonName | obligatoire | fqdn | url primaire de l'application | n/a |
| pai | obligatoire | string | nom du PAI comme indiqué lors de sa création | n/a |
| subjectAlternativeName | optionnel | list(string) | liste d'urls secondaires | null |
| certificate | optionnel | map | element permettant de retrouver le secret contenant le certificat | null |
| certificate.secretName | obligatoire | string | nom du secret | n/a |
| certificate.certificateKey | obligatoire | string | nom de la clé contenant le certificat en p12 | n/a |
| certificate.passphraseKey | obligatoire | string | nom de la clé contenant la pass phrase du p12 | n/a |
| redirect | optionnel | bool | activer la redirection HTTP to HTTPS | false |
| antivirus | optionnel | bool | activer l'antivirus. Il est possible de l'activer à posteriori mais via ticket uniquement. L'antivirus analyse le trafic et notamment les fichiers uploadés. | false |
| maxFileSize | optionnel | int | taille maximale des fichiers pour l'antivirus en Mo | null |
| websocket | optionnel | bool | activer la possibilité de faire du websocket | false |
| ipWhiteList | optionnel | list(string) | liste des IPs autorisées à accéder à l'url | ["10.0.0.0/8","100.64.0.0/10"] |
| sslOutgoing | optionnel | bool | à activer si l'ingress écoute en HTTPS | false |

La version minimale de création d'une CDS est la suivante :

````yaml
apiVersion: v1
kind: Secret
metadata:
  name: mon-secret
type: Opaque
stringData:
  mon-cert.p12: |
    base64(p12)
  passphrase: Passw0rd!
---
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: chainedeservice
spec:
  network: "RIE"
  commonName: "mon-app.app1hp.dev.forge.minint.fr"
  pai: "short-pai"
  certificate:
    secretName: "mon-secret"
    certificateKey: "mon-cert.p12"
    passphraseKey: "passphrase"
````
Ceci va créer une chaîne de service pour l'URL ```mon-app.app1hp.dev.forge.minint.fr``` en utilisant le certificat SSL fourni dans le secret 'mon-secret'.
A noter que pour le besoin de l'exemple, le secret est créé *en dur* il devrait être sécurisé via SOPS (voir ci-dessous).

### Schéma du déploiement d'une CDS

![schema_opencds](/img/guide/schema_opencds.png)

### Création du secret contenant le certificat avec SOPS

Dans le cadre d'un déploiement applicatif sur le principe GitOps, il est nécessaire de "pousser" tous les fichiers y compris les secrets sur Git, il est donc nécessaire de les chiffrer.
La solution sur laquelle nous allons nous appuyer est [SOPS](https://github.com/mozilla/sops).
> Pour plus d'informations sur SOPS au sein de CloudPI Native : https://cloud-pi-native.fr/guide/secrets-management

Tout d'abord, il faut encoder le certificat en base64 :

```bash
base64 -w 0 mon-cert.p12
```

Nous allons ensuite créer un manifest d'un object SopsSecret où nous allons coller le certificat (encodé en base64) et le mot de passe (en clair), ce fichier ne doit pas être pousser sur git.

```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
  name: sops-secret-cds
spec:
  secretTemplates:
    - name: secret-cds
      stringData:
        certificate.p12: |
          base64(mon-cert.p12)
        passphrase: Pa$$W0rd!
```

Il faut ensuite chiffrer ce fichier en éxecutant la commande :

```bash
sops -e --age $AGE_KEY --encrypted-suffix Templates secret-cert.sops.yaml > secret-cert.sops.enc.yaml
```
> La variable AGE_KEY correspond à la clé publique SOPS du cluster sur lequel on déploie notre objet, cette clé peut être trouvée sur la console DSO.

Nous obtenons alors un nouveau fichier de la forme suivante :

```yaml
apiVersion: isindir.github.com/v1alpha3
kind: SopsSecret
metadata:
  name: sops-secret-cds
spec:
  secretTemplates:
    - name: secret-cds
      stringData:
        certificate.p12: ENC[AES256_GCM,data:pOJHaDqYuqbe3sF/a2+NZdZuK+VHOMQ62Vi2dVpevpuWpEFUEbhtI1k0/dqqrktnBedQQtmwfCPTnnayKlN6jNSJoYyokprCF/kXUpzZjoDHuU+SI4aPdL/F04408qzEmDLY7NuQ35bgmW3uvUtlaRRunDZzVqt0i4isoFhU/EpA5vlRt1A+k46B9dRQNcRdX/Qo6ph7qxAWr9NvOvSe2onU5gl3sjtSVjo0a5KkjA/XnzRAABPHLUscpcf/Dc40SfvE4dzVeROBcqKxAtQv9hCXLUhr4AuoAXfFxKv+jfqWR+gOl0pyA25/ti8DlAZH5yBoVkMqOCLZyZEKIqzyJecBPGbObxIbauX3qRux4gj+74UKKMeSHoCeZjlCaKNsZd7GfaNod8lj0IPf6xa/NPybD9Zt52jBPiQ9I78EtaoQ4SdldIJdyzhZItRxing+MuvsETVY4g3OO6i+W8MoXoQi7geOdCD8HKkFMc3m9/EzIPn/CM9ikhJ+xv95h55OXUlyCVSnp0P3EdTJ7s/UKxGhcwZQDfRTrB3L3GAf4VlNDJrIV8mooYx7xFuTK09q0nVJrDrQ2ozUhgS0eYM5yTYYTMNdp1JUkHaMzzNq9qldY4hCtNagiC2KuVQxQSq8vT8BfHSPth4cX6qsrPPa/RZPiV/2iQIfJ9VEfsxHnBbPUir+sal6eKekixLsb5sXIvZsnwEqu4/pLUDi/z9iGUSDaF42W6jTylFh4dv2bLuWC8FnZOHTPNiJrcX3PxJsYtPHY/WpU8W9CyUk29XbMxITTBhIO30c2PIMN+iqiAJqKKbl8iKDzGCD7wiWVS78mdShj5CH2p3CTCPL2T45Gcg4E9I21KrJs5HhqGb/Oh3VhuYY5SosE1QVbiRhWsRSaSwxGnBbmZgQ/f3Zd76cYZ9dgHOx9NhLcyxFVUCywxrcUMfcaxoADCf8swONoybAIG5LanpvGUo5542IIL2BMRUUw2ZpCFtir70rgvB1GQaTh5cA2w2rLMka0wS5vHqqVomUleRhY14VnY1ptvcQr368EaJHEZjFw1uui+gDgc1KvrN007KRtIbIe3a73ndlewYrBjR4/y1FOackiEhv9RBUg+8jOUDpzqpGiQEXu6XgUhYKDfUrw+RPSSGCIzcJSaad3oZXCK5ta4BTer1JtnveWtsI43JE8SEHYRwvV+hWKKCHXEkZHZABRZL42joPhWlwxb8XBYzvBOjsAY7rufZb5xOdgpOJeSOKoQli0jPabvpSaGcBJFEMFcK6Q1zxDnOz2ytDrJ+if9J4pRpNhuCQTpPhj5dUygZMHy0yLK84PnDE7qElMj65p2chq2GAEmKBZnSSG8Axkys52Tb4pm85ICykg1VzVQRHbh20jGmlUR1DBM1ZGkSjbb+uk1KTU5USjMeSyJ5Rcj1o7lSBrH43p7Uq5BjO4ZwcB+bGtH3gfdxdyq2edIT0UwPWP9QeKPmU2mb+PYBo7TBarnsvhyECndr4UxUI6593shoCwD3PMYEX+oZ0HoaBRGqpOH/rF6eMJOVxNHvBu7EZLsTqEy5YXKQSyyyQRZOk/JMAJdhJOSY69JawtmT2rEaQYzLHwOIeJgNhRUmdJMl/goh9pelJUlvdNW36y2ZJYcRZO8VFow2b7M9znXzQ8Ey6lFEV4lZNnGv1+tV1F1ikNztV8rMprYNI80/QJLhvULtofdIAxiZa6cEESwqzAfwu1p8grOIz5r9Rjb1QYxJZ57AWKB1N3u+rv7Sbpup7oqnaohYu2HbkZ04FefBs45Wiz/ZxtVFe1+sCSHaKzJxDzgn0HclQ+5ck7S7TQoXFs5sZSKsYTzENWsrsCreYLpwY1K2KnSDvKfqslTzM12gS4VT0dUGdzNFUGx1SiYx20ZS5eGsIu1bTlPF+Ro4GI/9x6Cn0xlxfkvAhjaDrmx0fvpl7mCGnCkT6lV4h9QQL3gVuZwlMrx4UnJ61/Wxrwzlae7m3n5VA0Vs=,iv:bFDUs+G3EBjtrOtcIe1dw9flLgosXxVLuSIDwQwgkv8=,tag:ZmsYuV9ywqJfZFYQ0lOdTA==,type:str]
        passphrase: ENC[AES256_GCM,data:g1ynoshyQ71lfWhsZzlODBlFbzgojdI=,iv:3am/eWvmlZWUmMZ0NoLDYggh6N4qFppyGxTM2FwShp8=,tag:a6CMrUmMIFyfWkCSu40tzA==,type:str]
```

Voici un fichier yaml contenant tous les paramètres ainsi que leur description en commentaire :
````yaml
## Ce document est un exemple de manifest pour déployer un objet ChaineDeService 
## qui utilise le controller OpenCDS

apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  ## 'name': Le nom de l'objet ChaineDeService que vous souhaitez créer.
  name: example-cds
spec:
  ## Paramètres requis

  ## Ce paramètre est pour attribuer le secret au certificat.
  ## Vous devez tout d'abord créer le secret en utilisant le manifest fourni. 
  certificate:
    certificateKey: certificate.p12
    passphraseKey: passphrase
    secretName: secret-cds

  ## 'commonName': Il s'agit du CN de votre certificat.
  commonName: cn-example-project.interieur.rie.gouv.fr

  ## 'network': Le réseau sur lequel vous souhaitez déployer votre CDS ('RIE'). 
  network: RIE

  ## 'pai': Le PAI de votre projet.
  pai: EXAMPLE-PROJECT

  ## Paramètres facultatifs
  ## Ces paramètres sont en commentaire par défaut, vous pouvez les utiliser selon votre besoin.

  ## 'antivirus': Un booléen permettant de décrire si vous souhaitez un antivirus pour analyser les fichiers importés.
  ## Default: false
  # antivirus: false

  ## 'maxFileSize': Un integer (en Mb) permettant de fixer une taille maximale des fichiers analysés par l'antivirus.
  ## Si le paramètre 'antivirus' est fixé sur 'true'
  ## Default: 10
  # maxFileSize: 10

  ## 'ipWhiteList': La possibilité d'avoir une liste d'IP autorisées sur votre CDS.
  ## Default: ['10.0.0.0/8', '100.64.0.0/10']
  # ipWhiteList: []

  ## 'sslOutgoing': Un booléen permettant de décider si vous souhaitez une exposition du backend sur le port HTTP ou HTTPS.
  ## Default: false
  # sslOutgoing: false

  ## 'redirect': Un booléen permettant de décider si vous souhaitez une redirection du protocole HTTP vers le protocole HTTPS
  ## on your CDS
  ## Default: false
  # redirect: false

  ## 'subjectAlternativeName': Permet de fixer une liste de SANs si votre certificat est de type SAN
  ## Default: []
  # subjectAlternativeName:
  # - san1-example-project.interieur.rie.gouv.fr
  # - san2-example-project.interieur.rie.gouv.fr

  ## 'websocket': Un booléen permettant de décider si vous souhaitez autoriser l'utilisation des protocoles de websocket sur votre CDS.
  ## Default: false
  # websocket: false
````

Le suivi du traitement peut ensuite être réalisé via le statut de l'objet *ChaineDeService* via ArgoCD. 

### Validation de la création de CDS

La création d'un objet ChaineDeService déclenche l'envoi d'un e-mail contenant un lien de validation à l'adresse des membres de la ServiceTeam qui valident les demandes de CDS effectuées par les projets.

### Limitations / Remarques

Lors de la création d'une CDS via le kind ChaineDeService, il est important d'avoir en tête certains éléments :
 - L'enregistrement DNS est demandé via la création d'un ticket *MIN-ITIL*, le suivi du traitement du ticket n'est pas pris en compte dans le statut de traitement de l'objet. Autrement dit, le statut de l'objet ChaineDeService correspond à la configuration des équipements réseau. Il faut attendre que le ticket correspondant à la demande DNS ait été traité afin que la CDS soit réellement opérationnelle (il faut compter 24h après la configuration des éléments réseaux).
 - La demande de configuration des équipements réseaux est faite par un ordonnanceur qui traite les demandes sur la période 8h00->9h00 et 13h->14h du lundi au jeudi. Ainsi, l'opération de configuration de la CDS sera réalisée lors du prochain créneau de traitement suivant la demande.

> Attention, il n'est pas possible de modifier une CDS, vérifiez bien vos valeurs avant de lancer la création. Une fois créée, en cas de besoin de modification, il est nécessaire de passer par le Chef de projet hébergement.

### Gestion des erreurs

Lors de la création d'un objet ChaineDeService, plusieurs erreurs peuvent survenir, ce paragraphe présente différents cas possibles.

#### Erreurs sur les paramètres passés à OpenCDS

Ces erreurs sont retournées par le controller OpenCDS qui va refuser la création de l'objet ChaineDeService.

Dans ces cas, il convient de modifier l'objet ChaineDeService et de le redéployer via ArgoCD.

##### 1. Paramètre manquant :

Cette erreur survient lorsqu'il manque un paramètre obligatoire dans le manifest.

Exemple :
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-missing-param
spec:
  certificate:
    certificateKey: missing-param.p12
    passphraseKey: passphrase
    secretName: secret-cds-missing-param
  commonName: missing-param.minint.fr 
  network: RIE
```

Réponse du controller :
```
The ChaineDeService "cds-missing-param" is invalid: spec.pai: Required value
```

##### 2. Paramètre inexistant :

Cette erreur survient lorsqu'un paramètre inexistant est renseigné dans le manifest.

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-param
spec:
  certificate:
    certificateKey: wrong-param.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-param
  commonName: wrong-param.minint.fr 
  network: RIE
  pai: TEST
  wrongParam: wrong
```

Réponse du controller :
```
Error from server (BadRequest): error when creating "cds-wrong-param.yaml": ChaineDeService in version "v1alpha1" cannot be handled as a ChaineDeService: strict decoding error: unknown field "spec.wrongParam"
```

##### 3. Mauvais type :

Cette erreur survient lorsqu'on renseigne une valeur d'un mauvais type pour un des paramètres du manifest.

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-type
spec:
  certificate:
    certificateKey: wrong-type.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-type
  commonName: wrong-type.minint.fr 
  network: RIE
  pai: TEST
  antivirus: wrong
```

Réponse du controller :
```
The ChaineDeService "cds-wrong-type" is invalid: spec.antivirus: Invalid value: "string": spec.antivirus in body must be of type boolean: "string"
```

##### 4. Mauvaise valeur pour les paramètres acceptant des valeurs précises :

Cette erreur survient lorsqu'on renseigne une mauvaise valeur pour un des paramètres du manifest qui attendent des valeurs précises (enum).

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-value
spec:
  certificate:
    certificateKey: wrong-value.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-value
  commonName: wrong-value.minint.fr 
  network: WRONG
  pai: TEST
```

Réponse du controller :
```
The ChaineDeService "wrong-value" is invalid: spec.network: Unsupported value: "WRONG": supported values: "RIE"
```

#### Erreurs de l'API

Ces erreurs n'empêchent pas la création de l'objet OpenCDS mais sont retournés par l'API OpenCDS après avoir effectué davantage de vérifications avant de lancer la création de la chaîne de service. 

Ces erreurs peuvent être trouvées dans la partie Message du champs Status de l'objet ChaineDeService (il peut y avoir plusieurs erreurs en même temps, une erreur sera affichée par ligne): 

```
status:
  Message: |
    param1: ...
    param2: ...
```

Dans ces cas, il convient de modifier l'objet ChaineDeService et de le redéployer via ArgoCD

##### 1. PAI

Le PAI ne fait pas partie de la liste des PAI acceptés. Vérifier que le PAI est correct et contacter la Service Team si celui-ci est bien renseigné.

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-pai
spec:
  certificate:
    certificateKey: wrong-pai.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-pai
  commonName: wrong-pai.minint.fr 
  network: RIE
  pai: WRONG
```

Réponse de l'API :
```
PAI : PAI not in project list (input: WRONG)
```

##### 2. commonName

Le commonName n'est pas un sous-domaine accepté par OpenCDS. Les seuls domaines acceptés sont des sous-domaines de *.minint.fr et *.interieur.rie.gouv.fr.

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-commonName
spec:
  certificate:
    certificateKey: wrong-commonName.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-commonName
  commonName: wrong-commonName.fr 
  network: RIE
  pai: TEST
```

Réponse de l'API :
```
commonName : commonName is not a subdomain of the allowed domains (input: wrong-commonName.fr)
```

##### 3. ipWhiteList

L'une des valeurs dans la liste ipWhiteList n'est pas une IP valide.

Exemple:
```
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: cds-wrong-ipWhiteList
spec:
  certificate:
    certificateKey: wrong-ipWhiteList.p12
    passphraseKey: passphrase
    secretName: secret-cds-wrong-ipWhiteList
  commonName: wrong-ipWhiteList.minint.fr 
  network: RIE
  pai: TEST
  ipWhiteList: [10.0.0.0/8, 1.2.3]
```

Réponse de l'API :
```
ipWhiteList : value is not a valid IPv4 or IPv6 network (input: 1.2.3)
```

#### Erreurs internes

Ces erreurs arrivent lorsque le controller et l'API OpenCDS ont tous les deux acceptés la demande mais une erreur est survenue lors de la création de la chaîne de service. Vous en serez informés par le message suivant dans la partie Message du champs Status de l'objet ChaineDeService :

```
status:
  Message: |
    An internal error occured. An admin is looking at it.
```

Cette erreur survient lorsqu'une erreur serveur s'est produite lors de la création de la chaîne de service. Aucune intervention de votre part n'est nécessaire, un administrateur sera alerté de l'erreur et la résoudra ou vous recontactera en cas besoin.

## Roadmap de l'évolution d u service OpenCDS

| fonctionnalités | date |
| :---------------| :----|
| Ouverture d'une console d'administration | Fin août 2025 |
| Ouverture du service sur INTERNET | Octobre 2025 |
| Lancement du service en Full Auto | 2026 |
