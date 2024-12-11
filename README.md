# Documentation Cloud π Native / Hexaforge

Ce dépôt est construit et déployé à l'adresse : <https://cloud-pi-native.fr>

## Contribuer

L'offre Cloud π Native s'améliore grâce aux retours de nos utilisateurs, n'hésitez pas à contribuer, notamment en nous faisant des retours sur la documentation. Le détail pour contribuer est [ici](CONTRIBUTING.md)

__Pour formater le code, veuillez à lancer la commande `pnpm run format` avant votre commit.__

### Documentation de l'offre de service Cloud π Native

Le dépôt est construit avec [vitepress](https://vitepress.dev) à l'aide de fichiers markdown positionnés dans les dossiers [cloud-pi-native](./cloud-pi-native/), les assets (images, fichiers additionnels, etc...) sont positionnés dans le dossier [public](./cloud-pi-native/public/).

Structure de la documentation :

```sh
./cloud-pi-native
  ├── acceleration/
  ├── guide/
  ├── agreement/
  ├── best-practices/
  ├── certification/
  ├── faq/
  ├── public
  │   ├── examples/
  │   ├── img/
  │   ├── favicon.ico
  │   └── logo-marianne-gouvernement.png
  ├── contribute.md
  └── index.md
```

### Documentation de la plateforme Hexaforge

Le dépôt est construit avec [vitepress](https://vitepress.dev) à l'aide de fichiers markdown positionnés dans le dossiers [hexaforge](./hexaforge/), les assets (images, fichiers additionnels, etc...) sont positionnés dans le dossier [public](./hexaforge/public/).

Structure de la documentation :

```sh
./hexaforge
  ├── administration/
  ├── guide/
  ├── installation/
  ├── platform/
  ├── public
  │   ├── examples/
  │   └── img/
  ├── services/
  ├── contribute.md
  └── index.md
```

## Contact

Pour toute information, veuillez nous contacter à l'adresse suivante : <cloudpinative-relations@interieur.gouv.fr>.
