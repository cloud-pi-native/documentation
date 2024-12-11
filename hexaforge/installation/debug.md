# Debug

## Réinstallation

Si vous rencontrez des problèmes lors de l'éxécution du playbook, vous voudrez certainement relancer l'installation d'un ou plusieurs composants plutôt que d'avoir à tout réinstaller.

Pour cela, vous pouvez utiliser les tags qui sont associés aux rôles dans le fichier « install.yaml ».

Voici par exemple comment réinstaller uniquement les composants keycloak et console, dans la chaîne DSO paramétrée avec la `dsc` par défaut (`conf-dso`), via les tags correspondants :

```bash
ansible-playbook install.yaml -t keycloak,console
```

Si vous voulez en faire autant sur une autre chaîne DSO, paramétrée avec votre propre `dsc` (nommée par exemple `ma-dsc`), alors vous utiliserez l'[extra variable](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_variables.html#defining-variables-at-runtime) `dsc_cr` comme ceci :

```bash
ansible-playbook install.yaml -e dsc_cr=ma-dsc -t keycloak,console
```

## CloudNativePG

La BDD PostgreSQL des composants Keycloak et SonarQube est installée à l'aide de l'opérateur communautaire [CloudNativePG](https://cloudnative-pg.io/), via le role `cloudnativepg`.

Le playbook d'installation, en s'appuyant sur le role en question, s'assurera préalablement que cet opérateur n'est pas déjà installé dans le cluster. Il vérifiera pour cela la présence de deux éléments :

- L'API `postgresql.cnpg.io/v1`.
- La `MutatingWebhookConfiguration` nommée `cnpg-mutating-webhook-configuration`.

Si l'un ou l'autre de ces éléments sont absents du cluster, cela signifie que l'opérateur CloudNativePG n'est pas installé. Le rôle associé procédera donc à son installation.

**Attention !** Assurez-vous que si une précédente instance de CloudNativePG a été désinstallée du cluster elle l'a été proprement. En effet, si l'opérateur CloudNativePG avait déjà été installé auparavant, mais qu'il n'a pas été correctement désinstallé au préalable, alors il est possible que les deux ressources vérifiées par le role soient toujours présentes. Dans ce cas de figure, l'installation de Keycloak ou de SonarQube échouera car l'opérateur CloudNativePG n'aura pas été installé par le role.
