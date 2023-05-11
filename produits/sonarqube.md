# Outil d'analyse qualimétrie

## Présentation
L'outil d'analyse de la qualité du code static de l'offre Cloud π Native est SonarQube. Il permet de vérifier la qualité du code lors des différentes étapes du processus de développement, de la construction à la livraison.

Des *Quality gates* sont positionnées afin de garantir que le code construit respecte les normes de sécurité et de qualité.

Les variables d'environnement suivantes sont disponibles depuis Gitlab lors des étapes de build et permettant de contacter sonar :

- SONAR_HOST_URL
- SONAR_TOKEN

Celui-ci est préconfiguré pour quelques outils (npm, mvn, ...) et disponible dans les templates Gitlab CI et utilisable via l'exemple suivant :

```yaml
test_front:
  variables:
    WORKING_DIR: "src"
  stage: test
  extends:
    - .node:sonar
```