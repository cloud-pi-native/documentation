# Signature des images

Pour plus de sécurité, il est possible de signer les images sur harbor afin de n'utiliser que des images signées sur ses déploiements kubernetes.

Pour la suite, cosign sera utiliser pour signer et vérifier les images.

## Pré-requis

Télécharger le binaire de [cosign](https://github.com/sigstore/cosign/releases) et générer une paire de clé via la commande suivante:

```shell
cosign generate-key-pair
```

Cela génère 2 fichiers, **cosign.key** qui sera utilisé pour signer l'image et **cosign.pub** qui sera utilisé pour vérifier la signature

*Le mot de passe choisi sera utilisé plus tard dans une variable gitlab-ci, nommée COSIGN_SECRET dans la suite de l'exemple.*

## Signature via cosign

## Vérification pour les déploiements

Pour vérifier l'image signée, écrire une policy Kyverno comme suit en modifiant les variables:

- imageReferences: mettre l'url vers la ou les images utilisées dans les déploiments (* pour wildcard)
- publicKeys: mettre le contenu de la clé publique générée par cosign (cosign.pub) dans l'étape [Pre-requis](#pré-requis)

```yaml
apiVersion: kyverno.io/v1
kind: Policy
metadata:
  name: check-image
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
            - "harbor.apps.dso.numerique-interieur.com/mi-superprojet/*"
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
                      MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEdXIcpNJ61kRmLBv2S91SjBa7YvMl
                      U2MxOfUuw+TG6o2ru5/a54vpabmV0Ogj9cW9maDrsUfnDsbfsPj+nN1fbg==
                      -----END PUBLIC KEY-----
                    signatureAlgorithm: sha256
```
