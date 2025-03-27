# Création automatique de Chaine de Service : OpenCDS (au MI) - VERSION BETA

## Introduction

Lorsqu'un projet souhaite exposer un service sur Internet (ou sur le RIE) depuis les infrastructure du ministère de l'intérieur, il doit faire une demande de chaine de service. la chaine de service (CDS) est composée d'un ensemble de composants réseau et de sécurité permettant d'exposer une URL à l'extérieur du ministère.

Pour créer une chaine de service, deux macro opérations sont nécessaires :
 - Créer un enregistrement DNS correspondant au nom de domaine de son application et à destination de l'ingress d'entrée du Cluster cible;
 - Configurer les éléments réseaux pour prendre en compte l'entrée DNS ci-dessus.

La demande de réalisation de ces opérations est à faire par la création de tickets et les tâches associées sont relativement complexes, fastidieuses et impliquent différentes équipes. Elles prennent donc un temps non négligeable à prendre en compte dans le planning de son projet et le suivi de l'avancé de ces travaux par les projet est difficile.

> Le projet OpenCDS vise à automatiser au maximum ces opérations.

## Création d'une CDS sur CPiN

Sur Cloud Pi Native, les différentes opérations de création d'une CDS peuvent être réalisées :
 - De façon classique via demande à son chef de projet infrastructure : celui-ci va faire les différentes demandes et coordonner les travaux.
 - Créer un objet *ChaineDeService* et gérer sa demande de CDS via *Infrastructure as Code* 

### Création d'une CDS en IaC

Depuis le chart helm de son projet créer un nouvel objet Kubernetes de type ChaineDe Service :

```yaml
kind: ChaineDeService
```

Cet objet prend les paramètres suivants :

| spec | required | valeurs | description | default |
| :----| :--------| :-------| :-----------| :-------|
| network | required | RIE ou INTERNET | choix du type d'exposition | n/a |
| commonName | required | fqdn | url primaire de l'application | n/a |
| PAI | required | string | nom du PAI comme indiqué lors de sa création | n/a |
| subjectAlternativeName | optionnel | list(string) | liste d'urls secondaires | null |
| certificate | optionnel | map | element permettant de retrouver le secret contenant le certificat | null |
| certificate.secretName | required | string | nom du secret | n/a |
| certificate.certificateKey | required | string | nom de la clé contenant le certificat en p12 | n/a |
| certificate.passphraseKey | required | string | nom de la clé contenant la pass phrase du p12 | n/a |
| redirect | optionnel | bool | activer la redirection HTTP to HTTPS | false |
| antivirus | optionnel | bool | activer l'antivirus | false |
| maxFileSize | optionnel | int | taille maximal des fichiers pour l'antivirus en Mo | null |
| websocket | optionnel | bool | activer la possibilité de faire du websocket | false |
| ipWhiteList | optionnel | list(string) | liste des IPs autorisées a acceder a l'url | ["10.0.0.0/8"] ou ["0.0.0.0"] |
| endToEnd | optionnel | bool | a activer si l'ingress écoute en HTTPS | false |

La version minimale de création d'une CDS est la suivante :

````yaml
apiVersion: octant.interieur.gouv.fr/v1alpha1
kind: ChaineDeService
metadata:
  name: chainedeservice-rie
spec:
  network: "RIE"
  commonName: "mon-app.rie.midaas.fr"
  PAI: "short-pai"
````
Ceci va créer une chaine de Service pour l'URL mon-app.rie.midaas.fr en utilisant un certificat SSL auto-signé. Ceci est utilisé sur les environnements hors production.

Dans le cas où il est souhaité un certificat valide et récupéré préalablement par le service concerné, il est nécessaire de l'ajouter sous la forme d'un secret Kubernetes en plus de la CDS dans ce cas la demande de CDS devient :

A noter que pour le besoin de l'exemple, le secret est créé *en dur* il devrait être sécurisé soit via SOPS, soit via Vault.

````yaml
apiVersion: v1
kind: Secret
metadata:
  name: mon-secret
type: Opaque
data:
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
  PAI: "short-pai"
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

### Limitations / remarques

Lors de la création d'une CDS via le kind ChaineDeService, il est important d'avoir en têtes certains éléments :
 - L'enregistrement DNS est demandé via la création d'un ticket *minitil*, le suivi du traitement du ticket n'est pas pris en compte dans le statut de traitement de l'objet. Autrement dit, le statut de l'objet ChaineDeService correspond à la configuration des équipements réseau. Il faut attendre que le ticket correspondant à la demande DNS ait été traité aifn que la CDS soit réellement opérationnelle.
 - La demande de configuration des équipement réseau est faite par un ordonnanceur qui traite les demandes sur la période 8h00->9h00 et 13h->14h du lundi au jeudi. Ainsi, l'opération de configuration de la CDS sera réalisé lors du prochain créneau de traitement suivant la demande.
