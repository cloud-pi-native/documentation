# Organisations

Une organisation est un moyen de regrouper plusieurs projets dans un groupement cohérent. Chaque projet appartient à une seule organisation, ainsi il est possible d'avoir plusieurs projets avec le même nom mais appartenants à des organisations différentes.

Dans le cadre de Cloud Pi Native, les organisations sont en fait les ministères.

Chaque organisation est identifiée par un label (ex: Ministère de l'intérieur et des outre-mer) ainsi que par un nom technique (ex: mi).

Dans le menu Administration > Organisations, il est possible de retrouver la liste des organisations déjà créées ainsi que leur status (activée ou non).

## Création d'une organisation

Un formulaire est disponible en bas de page permettant de créer d'autres organisations.

![création organisation](/img/console_admin/create_org.png)

Le nom technique de l'organisation doit remplir les critères suivants:

- en minuscule
- moins de 10 caractères
- sans caractère spéciaux

Cliquer sur le bouton **Ajouter l'organisation**

## Synchronisation des organisations

Au lieu d'ajouter manuellement les organisations une par une, il est possible de définir une url permettant de charger les organisations depuis une source extérieure.

Le bouton **Synchroniser les organisations** sert à synchroniser une liste d'organisations depuis une source extérieure. L'endpoint est défini directement dans le code de la console
