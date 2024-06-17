# Outil d'analyse qualimétrie

## Présentation

Pour l'analyse statique (bonnes pratiques et sécurité) de vos code sources applicatifs et infrastructures, l'usine logcielle de l'offre Cloud π Native vous propose le service de qualimétrie continu de code **SonarQube** en version communautaire.

Des *Quality gates* sont positionnées afin de garantir que le code construit respecte les normes de sécurité et de qualité.

Les variables d'environnement suivantes sont disponibles depuis GitLab lors des étapes de construction et permettant de contacter sonar :

- SONAR_HOST_URL
- SONAR_TOKEN

SonarQube est préconfiguré pour certains outils telsque npm et Maven, présents dans les templates [GitLab](https://cloud-pi-native.fr/services/gitlab.html) et utilisable via l'exemple suivant :

```yaml
test_front:
  variables:
    WORKING_DIR: "src"
  stage: test
  extends:
    - .node:sonar
```
