# Serivce CPiN OpenCDS: Création automatique de la Chaîne de Service au ministère de l'intérieur. 

## Introduction

Lorsqu'un projet souhaite exposer un service sur le RIE depuis les infrastructures du ministère de l'intérieur, il doit faire une demande de chaîne de service. la chaîne de service (CDS) est composée d'un ensemble de composants réseau et de sécurités permettant d'exposer une URL à l'extérieur du ministèrede lintérieur.

Pour créer une chaîne de service, plusieurs opérations sont réalisés  :

 - Création d'un enregistrement DNS correspondant au nom de domaine de son application et à destination du premier équipement de la CDS.
 - Création d'un certificat SSL pour son DNS. 
 - Configuration de plusieurs briques réseau. 

Plusieurs éléments du projets, dont le PAI sont essentiels pour que ses opérations se réalisent. 

## Fonctionnalités du service OpenCDS

La nouvelle version du service Cloud Pi Native (CPiN) ** OpenCDS ** permet à l'utilisateur (ou projet) de faire une demande de la création de la CDS directement via son code d'infrastructure. 

Cette demande est envoyée automatiquement à l'équipe Service Team de CPiN pour validation (mail reçu dés que le code sera appliqué par le service Argo CD de CPiN)

Dés validation de cette demaine, un processus automatique permettra de:

- Configurer des briques réseau 
- Créer un ticket MIN-ITIL pour demander la création d'un enregistrement DNS

## Pré-requis

Il convient dans un premier temps de faire les demandes (Via le CPH du projet) du 

- PAI au BPAH
- Certificat TLS de vos DNS au BCS.

## Comment fonctionne le service OpenCDS ?



## Comment utiliser le service OpenCDS ?

L'usage du service OpenCDS de CPiN se fait directement au niveau de votre code d'infrastructure. 
Il s'agit d'un objet Kubernetes de type (kind) ChaineDeService

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

Voici, un exemple de création d'une CDS est la suivante :

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

Sur cet exemple, le projet demande la création de la chaîne de service du DNS  ```mon-app.app1hp.dev.forge.minint.fr```, ayant le certificat TLS fourni dans le secret 'mon-secret' sera crée. 
A noter que pour le besoin de l'exemple, le secret est créé *en dur* il devrait être sécurisé via SOPS ou Vault. 

Dés que cette demande de création de CDS est appliqué (via le service ArgoCD de CPiN): 

1.  Une demande sera envoyée par mail à l'équipe Service Team de CPiN.
2.  A la validation de cette demande par l'équipe service team, votre demande rentrera dans une file d'attente
3.  A la sortie de cette demande  de la file d'attente:
    - Un ticket MIN-ITIL sera créer pour demander la création d'un enregistrement DNS (Traitement en 24h en moyenne)
    - Configuration automatique de la CDS. 

Si ces étapes se déroulent avec succes, la statut de l'objet Kubernetes ChaineDeService sera à **Success** 

## Limitations / Remarques

- La CDS sera opérationnelle une fois que le ticket MIN-ITIL correspondant à la demande DNS soit traité.
- La demande de configuration des équipements réseaux est faite par un ordonnanceur qui traite les demandes sur la période 8h00->9h00 et 13h->14h du lundi au jeudi. Ainsi, l'opération de configuration de la CDS sera réalisée lors du prochain créneau de traitement suivant la demande.

> Attention, il n'est pas possible de modifier une CDS, vérifiez bien vos valeurs avant de lancer la création. Une fois créée, en cas de besoin de modification, il est nécessaire de passer par le Chef de projet hébergement.



## Gestion des erreurs

Lors de la création d'un objet ChaineDeService, plusieurs erreurs peuvent survenir, ce paragraphe présente différents cas possibles.

### Erreurs sur les paramètres passés au service OpenCDS

Ces erreurs sont retournées par le controller OpenCDS qui va refuser la création de l'objet ChaineDeService.

Dans ces cas, il convient de modifier l'objet ChaineDeService et de le redéployer via ArgoCD.

#### 1. Paramètre manquant :

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

#### 2. Paramètre inexistant :

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

#### 3. Mauvais type :

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

#### 4. Mauvaise valeur pour les paramètres acceptant des valeurs précises :

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

### Erreurs de l'API

Ces erreurs n'empêchent pas la création de l'objet OpenCDS mais sont retournés par l'API OpenCDS après avoir effectué davantage de vérifications avant de lancer la création de la chaîne de service. 

Ces erreurs peuvent être trouvées dans la partie Message du champs Status de l'objet ChaineDeService (il peut y avoir plusieurs erreurs en même temps, une erreur sera affichée par ligne): 

```
status:
  Message: |
    param1: ...
    param2: ...
```

Dans ces cas, il convient de modifier l'objet ChaineDeService et de le redéployer via ArgoCD

#### 1. PAI

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

#### 2. commonName

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

#### 3. ipWhiteList

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

### Erreurs internes

Ces erreurs arrivent lorsque le controller et l'API OpenCDS ont tous les deux acceptés la demande mais une erreur est survenue lors de la création de la chaîne de service. Vous en serez informés par le message suivant dans la partie Message du champs Status de l'objet ChaineDeService :

```
status:
  Message: |
    An internal error occured. An admin is looking at it.
```

Cette erreur survient lorsqu'une erreur serveur s'est produite lors de la création de la chaîne de service. Aucune intervention de votre part n'est nécessaire, un administrateur sera alerté de l'erreur et la résoudra ou vous recontactera en cas besoin.

## Roadmap de l'évolution du service OpenCDS

| Fonctionnalités | Date |
| :---------------| :----|
| Ouverture d'une console d'administration | Fin août 2025 |
| Ouverture du service sur INTERNET | Octobre 2025 |
| Lancement du service en Full Auto | 2026 |
