# Prérequis

Aujourd'hui l'installation de la plateforme Cloud π Native est testée uniquement sur un cluster OpenShift (version 4.X).
La compatibilité kubernetes sera effective dans une prochaine release. 

Vous devrez disposer d'un **accès administrateur au cluster**.

Vous aurez besoin d'une machine distincte du cluster, tournant sous GNU/Linux avec une distribution de la famille Debian ou Red Hat. Cette machine vous servira en tant qu'**environnement de déploiement** [Ansible control node](https://docs.ansible.com/ansible/latest/network/getting_started/basic_concepts.html#control-node). Elle nécessitera donc l'installation d'[Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html), et plus précisément du paquet **ansible**, pour disposer au moins de la commande `ansible-playbook` ainsi que de la collection [community.general](https://github.com/ansible-collections/community.general).

Toujours sur votre environnement de déploiement, vous devrez :

- Clôner le présent [dépôt](https://github.com/cloud-pi-native/socle).
- Disposer d'un fichier de configuration ```~/.kube/config``` paramétré avec les accès administrateur, pour l'appel à l'API du cluster (section users du fichier en question).

L'installation de la suite des prérequis **sur l'environnement de déploiement** s'effectue à l'aide du playbook nommé `install-requirements.yaml`. Il est mis à disposition dans le répertoire `admin-tools` du dépôt socle que vous aurez clôné.

Si l'utilisateur avec lequel vous exécutez ce playbook dispose des droits sudo sans mot de passe (option NOPASSWD du fichier sudoers), vous pourrez le lancer directement sans options :

```bash
ansible-playbook admin-tools/install-requirements.yaml
```

Sinon vous devrez utiliser l'option `-K` (abréviation de l'option `--ask-become-pass`) qui vous demandera le mot de passe sudo de l'utilisateur :

```bash
ansible-playbook -K admin-tools/install-requirements.yaml
```

Pour information, le playbook `install-requirements.yaml` vous installera les éléments suivants **sur l'environnement de déploiement** :

- Paquet requis pour l'installation des modules python :
  - python3-pip

- Paquets requis pour l'installation du gestionnaire de paquets Homebrew :
  - git
  - ruby
  - tar

- Modules python :
  - pyyaml
  - kubernetes
  - python-gitlab

- Collection Ansible [kubernetes.core](https://github.com/ansible-collections/kubernetes.core) si elle n'est pas déjà présente.

- Gestionnaire de paquets [Homebrew](https://brew.sh/) pour une installation simplifiée des prérequis restants sur la plupart des distributions GNU/Linux utilisables en production. Testé sous Debian, Ubuntu, Red Hat Enterprise Linux et Rocky Linux.

- Commandes installées avec Homebrew :
  - [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
  - [helm](https://helm.sh/docs/intro/install/)
  - [yq](https://github.com/mikefarah/yq/#install), facultative mais utile pour debug.
  - [age](https://github.com/FiloSottile/age#installation), outil de chiffrement qui fournit les commandes `age` et `age-keygen` nécessaires pour l'installation de SOPS.
