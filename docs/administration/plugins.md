# Plugins

La console DSO fonctionne via des plugins pour toutes ses fonctionnalités:

- keycloak
- vault
- harbor
- argocd
- ...

Il est possible d'écrire son propre plugin, un dépôt d'exemple si trouve [ici](https://github.com/cloud-pi-native/console-plugin-helloworld)

Pour les plugins rendant service à d'autres plugins (plugin de type API - typiquement le cas du plugin vault qui sert à stocker les secrets des autres plugins), un exemple se trouve [ici](https://github.com/cloud-pi-native/console-plugin-helloworld-api)

Chaque plugin peut exposer sa configuration à différents niveaux:

- projet: la configuration se trouvera sur la page **Mes services** du projet en question
- global: la configuration se trouvera sur la page **Administration/Plugins**

## Configuration globale

Pour changer la configuration globale d'un plugin, cliquer sur le plugin en question pour ouvrir son menu de paramètres et changer celui voulu.

Dans l'exemple suivant, le quota par défaut de harbor est mis à 1GB:
![plugin configuration](/img/console_admin/plugin_configuration.png)

Cliquer sur le bouton **Enregistrer** pour sauvegarder la nouvelle configuration.
