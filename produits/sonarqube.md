SonarQube est l'un outil d'analyse de code source fournis par l'offre Cloud π Native, il permet de vérifier la qualité du code lors des différentes étapes du processus de développement, de la construction à la livraison.

Des *Quality gates* seront positionné afin de garantir que le code construit respecte les normes de sécurité et de qualité.

Les variables d'environnement suivantes sont disponibles permettant de contacter sonar :

- SONAR_HOST_URL
- SONAR_TOKEN

Celui-ci sera préconfiguré pour quelques outils (npm, mvn, ...) et disponible dans les templates Gitlab CI et utilisable via l'exemple suivant :

```yaml
test_front:
  variables:
    WORKING_DIR: "src"
  stage: test
  extends:
    - .node:sonar
```