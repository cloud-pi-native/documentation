# Récupération des secrets

Au moment de leur initialisation, certains outils stockent des secrets qui ne sont en principe plus disponibles ultérieurement.

**Attention !** Pour garantir l'[idempotence](https://fr.wikipedia.org/wiki/Idempotence), ces secrets sont stockés dans plusieurs ressources du cluster. Supprimer ces ressources **indique à Ansible qu'il doit réinitialiser les composants associés**.

Afin de faciliter la récupération des secrets, un playbook d'administration nommé « get-credentials.yaml » est mis à disposition dans le répertoire « admin-tools ».

Pour le lancer :

```bash
ansible-playbook admin-tools/get-credentials.yaml
```

Ce playbook permet également de cibler un outil en particulier, grâce à l'utilisation de tags qui sont listés au début de l'exécution, exemple avec keycloak :

```bash
ansible-playbook admin-tools/get-credentials.yaml -t keycloak
```

Enfin, dans le cas où plusieurs chaînes DSO sont déployées dans le même cluster, il permet de cibler la chaîne DSO voulue via l'utilisation de l'[extra variable](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#defining-variables-at-runtime) `dsc_cr`, exemple avec une chaîne utilisant la `dsc` nommée `ma-conf` :

```bash
ansible-playbook admin-tools/get-credentials.yaml -e dsc_cr=ma-conf
```

Et bien sûr cibler un ou plusieurs outils en même temps, via les tags. Exemple :

```bash
ansible-playbook admin-tools/get-credentials.yaml -e dsc_cr=ma-conf -t keycloak,argocd
```

**Remarque importante** : Il est **vivement encouragé** de **sauvegarder les valeurs** qui vous sont fournies par le playbook « get-credentials.yaml ». Par exemple dans un fichier de base de données chiffré de type KeePass ou Bitwarden. Il est toutefois important de **ne pas les modifier ou les supprimer** sous peine de voir certains composants, par exemple Vault, être réinitialisés.
