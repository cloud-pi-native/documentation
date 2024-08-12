# Logs

Retrouver ce service dans la console Cloud Pi via le menu `Projet > Mes Projets > Sélectionner un projet > Mes Services` et cliquer sur l'icône Kibana qui vous intéresse.

## Connexion
Pour visualiser vos logs, sélectionner Kibana dans le tableau de bord "Mes Services".

Pour se logguer, cliquer sur le bouton `dso-client`

![login](/img/guide/kibana/log-in.png)

*Les prochaines étapes ne seront à faire qu'une seule fois*

- Kibana va demander l'autorisation d'accéder à des ressources, cocher tout et cliquer sur `Allow selected permissions`
![authorize](/img/guide/kibana/authorize.png)

- Kibana va s'ouvrir sur une page de création d'index, aucun n'étant pré-paramétré.
Remplir la zone de texte avec `app-*` pour sélectionner tous les index présents et futurs puis cliquer sur le bouton `> Next step`
![create_index_pattern](/img/guide/kibana/create_index_pattern.png)

Kibana va demander quel champ utiliser pour la date, choisir `@timestamp` dans la liste déroulante puis cliquer sur le bouton `Create index pattern`
![create_index_timestamp](/img/guide/kibana/create_index_timestamp.png)

Félicitations, vous venez de créer votre premier index Kibana et allez pouvoir dès à présent découvrir et filtrer vos logs
![create_index_valid](/img/guide/kibana/create_index_valid.png)

## Explorer vos logs
Pour explorer et requêter vos logs, allez sur l'onglet `Discover`
![discover](/img/guide/kibana/discover.png)

Cette page se décompose en plusieurs partie détaillées ci-dessous:

En haut, les options concernant la plage de temps (pour rappel, seulement 7 jours de logs sont disponibles) et l'auto-refresh
![discover_time](/img/guide/kibana/discover_time.png)

---
Juste en dessous, la zone de requête, avec comme exemple les lignes de logs dont le nom du container est `pgrest-tcnp` et le message (aka la sortie console des containers) contient le mot `WAF`.
Cliquer sur le bouton `Refresh` pour obtenir le résultat de la requête.
![discover_query](/img/guide/kibana/discover_query.png)

---
A gauche se trouve les champs requêtables (ceux trouvés dans l'index créé à l'étape précédente)
![discover_available_fields](/img/guide/kibana/discover_available_fields.png)

---
A droite se trouve les résultats avec un graphique reprenant la disparité des lignes de logs selon la date.

En en dessous, les logs correspondants à la recherche (avec les critères surlignés).

*A noter qu'il est possible de déplier les résultats en cliquant sur la flèche à côté de la date*

![discover_results](/img/guide/kibana/discover_results.png)

## Aller plus loin
La documentation de Kibana se trouve [ici](https://www.elastic.co/guide/en/kibana/6.8/index.html)

Plus d'informations concernant la syntaxe de requêtage [ici](https://www.elastic.co/guide/en/kibana/6.8/kuery-query.html)
