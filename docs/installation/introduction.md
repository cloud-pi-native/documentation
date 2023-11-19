# Introduction

L'installation de la plateforme Cloud π Native s'effectue de manière automatisée avec **Ansible** et le dépôt https://github.com/cloud-pi-native/socle.

Les éléments déployés seront les suivants :

| Outil                       | Site officiel                                                                  |
| --------------------------- | ------------------------------------------------------------------------------ |
| Argo CD                     | <https://argo-cd.readthedocs.io>                                               |
| Cert-manager                | <https://cert-manager.io>                                                      |
| Console Cloud π Native      | <https://github.com/cloud-pi-native/console>                                   |
| CloudNativePG               | <https://cloudnative-pg.io>                                                    |
| GitLab                      | <https://about.gitlab.com>                                                     |
| gitLab-ci-catalog           | <https://github.com/cloud-pi-native/gitlab-ci-catalog>                         |
| GitLab Runner               | <https://docs.gitlab.com/runner>                                               |
| Harbor                      | <https://goharbor.io>                                                          |
| Keycloak                    | <https://www.keycloak.org>                                                     |
| Kubed                       | <https://appscode.com/products/kubed>                                          |
| Sonatype Nexus Repository   | <https://www.sonatype.com/products/sonatype-nexus-repository>                  |
| SonarQube Community Edition | <https://www.sonarsource.com/open-source-editions/sonarqube-community-edition> |
| SOPS                        | <https://github.com/isindir/sops-secrets-operator>                             |
| HashiCorp Vault             | <https://www.vaultproject.io>                                                  |

Certains outils peuvent prendre un peu de temps pour s'installer, par exemple Keycloak ou GitLab.

Vous pouvez trouver la version des outils installés dans le fichier [versions](https://github.com/cloud-pi-native/socle/blob/main/versions.md)
