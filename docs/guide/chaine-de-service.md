# Création automatique de Chaîne de Service : OpenCDS (au MI) - VERSION BETA

## Introduction

Lorsqu'un projet souhaite exposer un service sur Internet (ou sur le RIE) depuis les infrastructures du ministère de l'intérieur, il doit faire une demande de chaîne de service. la chaîne de service (CDS) est composée d'un ensemble de composants réseau et de sécurités permettant d'exposer une URL à l'extérieur du ministère.

Pour créer une chaîne de service, deux macros opérations sont nécessaires :
 - Créer un enregistrement DNS correspondant au nom de domaine de son application et à destination de l'ingress d'entrée du Cluster cible;
 - Configurer les éléments réseaux pour prendre en compte l'entrée DNS ci-dessus.

De plus, il est nécessaire d'être en possession:
 - D'un certificat SSL pour son URL : un secret au sens Kubernetes devra être créé par le projet avec les informations de ce certificat.
 - De connaitre le PAI de son projet.

La demande de réalisation de ces opérations est à faire par la création de tickets et les tâches associées sont relativement complexes, fastidieuses et impliquent différentes équipes. Elles prennent donc un temps non négligeable à prendre en compte dans le planning de son projet et le suivi de l'avancée de ces travaux par les projets est difficile.

> Le projet OpenCDS vise à automatiser au maximum ces opérations.

## Création d'une CDS sur CPiN

Sur Cloud Pi Native, les différentes opérations de création d'une CDS peuvent être réalisées :
 - De façon classique via demande à son chef de projet infrastructure : celui-ci va faire les différentes demandes et coordonner les travaux.
 - Créer un objet *ChaineDeService* et gérer sa demande de CDS via *Infrastructure as Code* 

### Création d'une CDS en IaC

La création de CDS se fait en mode semi-automatique, c'est à dire que la création de CDS va créer un ticket Minitil pour demander la création d'un enregistrement DNS. A noter que le statut de l'objet ChaineDeService correspond uniquement à la configuration des éléments réseau et non au traitement du ticket Minitil. Ainsi, une fois que le statut ChaineDeService est **Success**, il convient de vérifier que l'enregistrement DNS est créé afin que la CDS soit opérationnelle.

Il convient dans un premier temps de faire les demandes de PAI au BPAH et de certificat au BCS. Une fois ces éléments en main, il est possible de créer un objet ChaineDeService afin de lancer les processus de configuration des éléments réseau ainsi que la demande de création de DNS.

![schema_creation_cds](/img/guide/openCDS/schema-openCDS.png)

Depuis le chart Helm de son projet, créer un nouvel objet Kubernetes de type ChaineDeService :

```yaml
kind: ChaineDeService
```

Cet objet prend les paramètres suivants :

| spec | required | valeurs | description | default |
| :----| :--------| :-------| :-----------| :-------|
| network | required | RIE ou INTERNET | choix du type d'exposition | n/a |
| commonName | required | fqdn | url primaire de l'application | n/a |
| pai | required | string | nom du PAI comme indiqué lors de sa création | n/a |
| subjectAlternativeName | optionnel | list(string) | liste d'urls secondaires | null |
| certificate | optionnel | map | element permettant de retrouver le secret contenant le certificat | null |
| certificate.secretName | required | string | nom du secret | n/a |
| certificate.certificateKey | required | string | nom de la clé contenant le certificat en p12 | n/a |
| certificate.passphraseKey | required | string | nom de la clé contenant la pass phrase du p12 | n/a |
| redirect | optionnel | bool | activer la redirection HTTP to HTTPS | false |
| antivirus | optionnel | bool | activer l'antivirus. Il est possible de l'activer à posteriori mais via ticket uniquement. L'antivirus analyse le trafic et notamment les fichiers uploadés. | false |
| maxFileSize | optionnel | int | taille maximale des fichiers pour l'antivirus en Mo | null |
| websocket | optionnel | bool | activer la possibilité de faire du websocket | false |
| ipWhiteList | optionnel | list(string) | liste des IPs autorisées à accéder à l'url | ["10.0.0.0/8","192.168.1 /23"] ou ["0.0.0.0"]  |
| endToEnd | optionnel | bool | à activer si l'ingress écoute en HTTPS | false |

La version minimale de création d'une CDS est la suivante :

````yaml
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: chainedeservice
spec:
  network: "RIE"
  commonName: "mon-app.app1hp.dev.forge.minint.fr"
  pai: "short-pai"
````
Ceci va créer une chaîne de service pour l'URL ```mon-app.app1hp.dev.forge.minint.fr``` en utilisant un certificat SSL auto-signé, donc générant une alerte de sécurité au niveau du navigateur pour les clients. Ceci est utilisé sur les environnements hors production. 

Dans le cas où il est souhaité un certificat valide et récupéré préalablement par le service concerné, il est nécessaire de l'ajouter sous la forme d'un secret Kubernetes en plus de la CDS dans ce cas la demande de CDS devient :

A noter que pour le besoin de l'exemple, le secret est créé *en dur* il devrait être sécurisé soit via SOPS, soit via Vault.

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
  name: chainedeservice-rie
spec:
  network: "INTERNET"
  commonName: "mon-app.interieur.gouv.fr"
  pai: "short-pai"
  subjectAlternativeName: ["mon-app.interieur.gouv.fr"]
  certificate:
    secretName: "mon-secret"
    certificateKey: "mon-cert.p12"
    passphraseKey: "passphrase"
  ipWhiteList: ["8.8.0.0/8"]
  redirect: true
  antivirus: true
  websocket: true
  endToEnd: true
  maxFileSize: 50
````

Le suivi du traitement peut ensuite être réalisé via le statut de l'objet *ChaineDeService* via ArgoCD. 

### Validation de la création de CDS

La création d'un objet ChaineDeService déclenche l'envoi d'un e-mail contenant un lien de validation à l'adresse des membres du projet ayant le role *CDS*. Ce mail contient également un rappel des conditions générales d'utilisation de la plateforme (CGU). Dans un premier temps seule la ServiceTeam possède le rôle *CDS* et valide les demandes de CDS effectuées par les projets. A terme, le rôle *CDS* sera accessible depuis l'onglet rôle de la console et le propriétaire d'un projet pourra définir qui au sein de son projet possède le rôle *CDS*.

### Limitations / Remarques

Lors de la création d'une CDS via le kind ChaineDeService, il est important d'avoir en tête certains éléments :
 - L'enregistrement DNS est demandé via la création d'un ticket *minitil*, le suivi du traitement du ticket n'est pas pris en compte dans le statut de traitement de l'objet. Autrement dit, le statut de l'objet ChaineDeService correspond à la configuration des équipements réseau. Il faut attendre que le ticket correspondant à la demande DNS ait été traité afin que la CDS soit réellement opérationnelle.
 - La demande de configuration des équipements réseau est faite par un ordonnanceur qui traite les demandes sur la période 8h00->9h00 et 13h->14h du lundi au jeudi. Ainsi, l'opération de configuration de la CDS sera réalisée lors du prochain créneau de traitement suivant la demande.

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
