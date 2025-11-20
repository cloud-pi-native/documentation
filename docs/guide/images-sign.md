# Signature des images

La signature d'une image consiste à ajouter un tampon sur une image de conteneur.

Celui-ci peut contenir diverses information comme le numéro de version, l'auteur de l'image etc.

Une signature permet au personne de verifier l'image et ainsi de s'assurer de son authenticité.

Harbor prend en charge la signature des images grâce à l'intégration de Notary et Cosign.

Dans notre cas, nous utiliserons [Cosign](https://docs.sigstore.dev/cosign/signing/signing_with_containers).

La signature d'une image repose sur deux éléments :
- Le hash de l'image (le tag n'est pas recommandé étant donné qu'il peut être modifié)
- La clé privée ainsi que son mot de passe

Ci-dessous, un schéma qui décrit le processus de signature d'une image:

![schema](/img/guide/sign_schema.png)

Nous vous proposons une pipeline GitLab qui permet d'effectuer cette signature.

Tout d'abord, il vous faut une paire de clés, celle-ci peut être générée avec l'utilitaire Cosign.

```bash
$ cosign generate-key-pair
Enter password for private key:
Enter again:
Private key written to cosign.key
Public key written to cosign.pub
```

Concernant les éléments tels que la clé privée ainsi que son mot de passe, nous vous recommandons de ne pas les ajouter au dépôt Git.

En attendant l'arrivée de la fonctionnalité permettant la gestion des secrets, vous pouvez les renseigner dans l'onglet `Settings > CI/CD > Variables` de votre dépôt sur GitLab.

Une demande doit être faite auprès de l'équipe service team pour obtenir cet accès.

```yaml
---
include:
  - project: $CATALOG_PATH
    file: vault-ci.yml
    ref: main

stages:
  - read-secret
  - docker-build
  - sign

read_secret:
  stage: read-secret
  extends:
    - .vault:read_secret

simple-build-push:
  stage: docker-build
  variables:
    DOCKERFILE: Dockerfile
    WORKING_DIR: .
    IMAGE_NAME: apache
    EXTRA_BUILD_ARGS: ""
    REGISTRY_URL: $IMAGE_REPOSITORY
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  script:
    # CA
    - if [ ! -z $CA_BUNDLE ]; then cat $CA_BUNDLE >> /kaniko/ssl/certs/additional-ca-cert-bundle.crt; fi
    - mkdir -p /kaniko/.docker
    - echo "$DOCKER_AUTH" > /kaniko/.docker/config.json
    - >-
      /kaniko/executor
      --build-arg http_proxy=$http_proxy
      --build-arg https_proxy=$https_proxy
      --build-arg no_proxy=$no_proxy
      --context="$CI_PROJECT_DIR"
      --dockerfile="$CI_PROJECT_DIR/$WORKING_DIR/$DOCKERFILE"
      --image-name-with-digest-file="${CI_PROJECT_DIR}/digest.txt"
      --destination $REGISTRY_URL/$IMAGE_NAME:$CI_COMMIT_SHORT_SHA
  artifacts:
    name: digest
    expose_as: Image digest
    paths:
      - digest.txt

# Les variables $MON_SUPER_MDP et MA_SUPER_CLE on été renseigné dans les settings du projet et sont ainsi hérité dans le job.
# Les annotations ne sont pas obligatoire , ici il s'agit simplement d'un exemple.

sign_push:
  stage: sign
  variables:
    COSIGN_PASSWORD: $MON_SUPER_MDP
    REGISTRY_URL: $IMAGE_REPOSITORY
  image: chainguard/cosign:latest
  before_script:
    - mkdir -p $HOME/.docker
    - echo "$DOCKER_AUTH" > $HOME/.docker/config.json
  script:
    - IMAGE_DIGEST=$( tail -n 1 digest.txt )
    - cosign sign --key env://MA_SUPER_CLE $IMAGE_DIGEST -y --annotations "Project=$CI_PROJECT_NAME"
```

Vous pouvez verifier l'état de la signature d'une image depuis Harbor.

![Harbor](/img/guide/sign_harbor.png)

## Vérification

La vérification de la signature d'une image peut être effectuée en utilisant la clé publique (issue de la clé privée qui a signé l'image).

Nous vous proposons pour cela une règle Kyverno. À vous d'adapter les valeurs `imageReferences` et `publicKeys` avec vos informations.

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: check-image
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
spec:
  validationFailureAction: Enforce
  background: false
  webhookTimeoutSeconds: 30
  failurePolicy: Fail
  rules:
    - name: check-image
      match:
        any:
          - resources:
              kinds:
                - Pod
      verifyImages:
        - type: Cosign
          imageReferences:
            - "harbor.apps.dso.numerique-interieur.com/mi-home/*"
          imageRegistryCredentials:
            secrets:
              - registry-pull-secret
          mutateDigest: true
          required: true
          verifyDigest: true
          attestors:
            - count: 1
              entries:
                - keys:
                    publicKeys: |-
                      -----BEGIN PUBLIC KEY-----
                      MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyDD+VMA545Uj0xJCFyprTrAJjJDj
                      ALaUovzfofQk7VmKvD6noX2P2nXW1EL+C/6knrG1GIgMDii6PUA8R1XFsw==
                      -----END PUBLIC KEY-----
                    signatureAlgorithm: sha256
```

## En complément

Un projet mock est disponible sur [Github](https://github.com/cloud-pi-native/mock-signature-image).

Harbor offre une option permettant de restreindre le pull des images uniquement aux images signées, et cette restriction s'applique au niveau du projet.

Par exemple, si vous avez un projet contenant deux images :
- backend (signée)
- frontend (non signée)

Lors de vos déploiements, seule l'image backend sera déployée. Harbor empêchera le pull de l'image frontend non signée.

Une demande doit être faite auprès de l'équipe service team pour obtenir cette option.
