# Gestion des secrets avec Vault

[Hashicorp Vault](https://www.vaultproject.io/) est une solution de la société Hashicorp pour sécuriser les secrets applicatifs.

Chaque projet de la console Hexaforge dispose d'un coffre de type clé-valeur (kv-v1 dans la nomenclature Hashicorp), accessible via une WebUI avec l'identifiant de la console.

## Création d'un secret

### Via la WebUI

Sur la page **Services externes** se trouve la tuile de Vault, cliquer dessus.

Une nouvelle fenêtre s'ouvre pour s'authentifier, cliquer sur le bouton bleu **Sign in with OIDC provider**:
![login](/img/guide/secrets/vso/login.png)

---

Une fois authentifié, vous retrouvez ici tous les coffres auquels vous avez accès avec comme nom `<organisation>-<nom du projet>` (dans la nomenclature Hashicorp ce nom sera référencé en tant que **mount**).
![coffres](/img/guide/secrets/vso/mount_list.png)

> Un coffre nommé **cubbyhole** est disponible par défaut dans toutes les installations vault, ne pas l'utiliser ! Etant commun, tous les projets ont accès à ce coffre.

---

Cliquer sur le coffre voulu, vous retrouver ici tous les secrets qu'il contient:
![secrets](/img/guide/secrets/vso/secrets_list.png)

---

Pour créer un nouveau secret, cliquer sur le bouton à droite **Create secret +**, et remplir les champs suivants:

- **Path for this secret**: le chemin vers le secret dans le coffre. L'arborescence, même complexe, est automatiquement créée (dans la nomenclature Hashicorp ce nom sera référencé en tant que **path**).
- **Secret data**: les données secrètes sous la forme clé-valeur
![create_secret](/img/guide/secrets/vso/create_secret.png)

Cliquer sur le bouton bleu **Save** pour enregistrer le nouveau secret.

---

Une fois le secret créé, vault renvoie vers l'arborescence du secret (dans l'exemple *dev/*, où se trouve bien le secret **db** et un autre secret créé précédemment **dockerconfig**):
![new secret list](/img/guide/secrets/vso/new_secret_list.png)

### Via la CLI

Une CLI est disponible pour manipuler ses coffres de façon programmatique. Pour installer la cli, se référé à la [documentation officielle](https://developer.hashicorp.com/vault/docs/install/install-binary)

Récupérer un token d'authentification via la webui pour les prochaines opérations, pour cela dans la barre de menu à gauche cliquer sur le bouton représentant une personne:
![token](/img/guide/secrets/vso/token.png)

Puis sur **Copy token**

---

Par défaut, la CLI de vault tente de se connecter sur un serveur local, il faut lui spécifier l'adresse du serveur avec une variable d'environnement (dans l'exemple, il s'agit du vault disponible sur la plateforme OVH):

```shell
export VAULT_ADDR=https://vault.apps.dso.numerique-interieur.com
```

---

Il est maintenant possible de s'authentifier sur le bon serveur via la commande suivante:

```shell
vault login

Token (will be hidden):
Success! You are now authenticated. The token information displayed below
is already stored in the token helper. You do NOT need to run "vault login"
again. Future Vault requests will automatically use this token.

Key                  Value
---                  -----
token                <information confidentielle>
token_accessor       <information confidentielle>
token_duration       765h1m3s
token_renewable      true
token_policies       ["default"]
identity_policies    ["app--mi-demovault--admin" "app--orgprch-projetdemo--admin"]
policies             ["default" "app--mi-demovault--admin" "app--orgprch-projetdemo--admin"]
token_meta_role      default
token_meta_email     demo.cpin@interieur.gouv.fr
```

---

Les commandes suivantes permettent de:

- créer un secret, avec les informations suivantes pour l'exemple:
  - **mount**: mi-demovault (le coffre du projet)
  - **foo**: le chemin du secret
  - **bar=baz rab=zab**: les données du secret sous forme clé=valeur (séparées par un espace)

  ```shell
  vault kv put -mount=mi-demovault foo bar=baz rab=zab
  ```

  ```shell
  Success! Data written to: mi-demovault/foo
  ```

- lister ses secrets:

  ```shell
  vault list mi-demovault
  ```

  ```shell
  Keys
  ----
  dev/
  foo
  ```

- récupérer un secret:

  ```shell
  vault kv get -mount=mi-demovault dev/db
  ```

  ```shell
  ====== Data ======
  Key         Value
  ---         -----
  password    azerty1234
  username    app
  ```

- supprimer un secret:

  ```shell
  vault kv delete -mount=mi-demovault foo
  ```

  ```shell
  Success! Data deleted (if it existed) at: mi-demovault/foo
  ```

## Récupération d'un secret sur Kubernetes

L'opérateur [Vault Secret Operator](https://developer.hashicorp.com/vault/tutorials/kubernetes/vault-secrets-operator) est disponible afin de récupérer les secrets auprès de vault.

Pour chaque projet créé dans la console, des objets de type `VaultConnection` et `VaultAuth` sont automatiquement créés afin de pouvoir authentifié le projet.

La récupération d'un secret passe par la création d'un objet de type `VaultStaticSecret` qui lui-même va générer un secret kubernetes.

L'exemple suivant va récupérer le secret **foo** créé précédemment:

```yaml
apiVersion: secrets.hashicorp.com/v1beta1
kind: VaultStaticSecret
metadata:
  name: foo-secrets
spec:
  vaultAuthRef: vault-auth # Nom du VaultAuth, toujours vault-auth dans le cas de CPiN
  mount: mi-vaultdemo # Nom du coffre dans vault (<organisation>-<nom du projet>)
  path: foo # Chemin vers le secret
  type: kv-v2 # Type du coffre, toujours kv-v1 dans le cas de CPiN
  destination:
    name: foo-secrets # Nom du secret kubernetes que l'opérateur va créer
    create: true
```

Ce qui va bien créer le secret kubernetes suivant:

```shell
k -n mi-demovault-dev-6293 get secret foo-secrets -o yaml
```

```yaml
apiVersion: v1
data:
  _raw: eyJiYXIiOiJiYXoiLCJyYWIiOiJ6YWIifQ==
  bar: YmF6 # baz en base64
  rab: emFi # zab en base64
kind: Secret
metadata:
  creationTimestamp: "2024-11-21T14:49:56Z"
  labels:
    app.kubernetes.io/component: secret-sync
    app.kubernetes.io/managed-by: hashicorp-vso
    app.kubernetes.io/name: vault-secrets-operator
    secrets.hashicorp.com/vso-ownerRefUID: 241f8e83-d8db-45f3-b12b-c6b0eaf07bf5
  name: foo-secrets
  namespace: mi-demovault-dev-6293
  ownerReferences:
    - apiVersion: secrets.hashicorp.com/v1beta1
      kind: VaultStaticSecret
      name: foo-secrets
      uid: 241f8e83-d8db-45f3-b12b-c6b0eaf07bf5
  resourceVersion: "201279463"
  uid: bcad37c9-c3a6-4420-8dce-83371b914112
type: Opaque
```

Depuis argocd, le lien VaultStaticSecret et Secret est bien visible:
![argocd](/img/guide/secrets/vso/argocd_vss.png)

## Aller plus loin

Il est possible d'aller plus loin lors de la création du secret:

- rafraichissement automatiquement
- redémarrage automatique d'un déploiement/daemonset/statefulset lors de la mise à jour du secret
- templating du secret

Ces exemples sont disponibles sur ce [dépôt](https://github.com/cloud-pi-native/exemples_ServiceTeam/tree/main/secrets/vault)
