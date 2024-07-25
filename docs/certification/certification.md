



# Certification Cloud Pi Native (work-in-progress)

L'effet recherché de Cloud Pi Native est de : produire des applications de qualité qui répondent au besoin, en soutenant l'agilité, la culture et les principes visant l'autonomie et centrés sur l'usage.

Plusieurs populations sont visées par le produit Cloud Pi Native et la doctrine Cloud au Centre :
 * les **équipes intégrées** qui utilisent le produit Cloud Pi Native au quotidien
    * comprendre le cadre d'autonomie, les opportunités et contraintes de Cloud Pi Native, apportés par l'utilisation de Cloud Pi Native & le Cadre de Cohérence Technique Intermistériel
    * être sensibilisé aux références du Software CraftSmanship
    * connaitre l'éco-systeme kubernetes
 * les **"DevSecOps/SRE/Champions/enabling team"** (terme à définir) au service de ou des équipes intégrées, qui accompagnent, coachent, supervisent leurs pratiques DevSecOps et Cloud Native
    * Mettre les équipes intégrées dans un cycle d'amélioration continue des projets
    * Être orienté sur le partage et la montée en compétence collective
    * mettre en place la culture de l'excellence et les pratiques DevSecOps au sein des équipes intégrées
    * assurer le provisionnement des infrastructures et pipeline, le flux et la stabilité de la solution
    * démontrer sa maitrise sur des prérequis techniques d'intégration et d'exploitabilité d'application
 * les **concepteurs d'application** cloud native  (opportunité k8s, vs organique qui le maintiendra)
Ce programme de certification soutient l'effet recherché et s'adresse aux experts en charge d'accompagner, de coacher et de superviser les pratiques DevSecOps et Cloud Native ("DevSecOps/SRE/Champions/enabling team") au service des équipes intégrées en charge de la réalisation de produits numériques.

**Les compétences et savoir-faires attendus**
Pour les équipes intégrées 
 * comprendre le cadre d'autonomie, les opportunités et contraintes de Cloud Pi Native, apportés par l'utilisation de Cloud Pi Native & le Cadre de Cohérence Technique Intermistériel
 * être sensibiliser aux références du Software CraftSmanship
 * connaitre l'éco-systeme kubernetes

Pour les "DevSecOps/SRE/Champions/enabling team" 
* Mettre les équipes intégrées dans une cycle d'amélioration continue des projets
* Être orienté sur le partage et la montée en compétence collective
* s'assurer de la 
* mettre en place la culture de l'excellence et les pratiques DevSecOps au sein des équipes intégrées
* assurer le provisionnement des infrastructures et pipeline, le flux et la stabilité de la solution
* démontrer sa maitrise sur des prérequis techniques d'intégration et d'exploitabilité d'application

**Les modalités de certification**
Prérequis : 
* la certification est soumise à un prérequis d'obtention de la Certified Kubernetes Application Developer de la Linux Foundation, permettant de garantir la bonne maitrise de kubernetes en tant que développeur

Promotion :
* Des promotions de 20 personnes sont organisées 2 à 3 fois par an par Cloud Pi Native. Veuillez contacter cloudpinative-relations@interieur.gouv.fr pour enregistrer votre candidature.

Type d'examen :
*  l'examen est réalisé en présentiel sur Paris, à ce jour.
*  La durée de l'examen varie entre 2 & 4 heures
*  Le passage d'examen et la certification sont individuels, sous la supervision d'un représentant Cloud Pi Native
*  L'examen est composé de 2 volets :
  * technique : des mises en situation et lab seront soumis. 
  * culture générale & process : un questionnaire sera soumis, permettant de vérifier votre bonne compréhension des processus clés et des normes à prendre en compte lors du cycle de vie du projet et de l'application
  Chaque lab réalisé avec succès et réponse exacte octroient des points.

Condition d'obtention :
* un score minumum de 80% est nécessaire pour l'obtention de la certification Cloud Pi Native - "DevSecOps/SRE/Champions/enabling team" (nom à définir)


-------------

Le matériel pédagogique proposé en open-source permet simultanément de former les experts et également ainsi que leurs fournir des outils permettant d'aider à définir le plan d'accompagnement et de formation des équipes *enabling*.

L'évaluation prend en charge la compétence nécessaire à soutenir l'usage de l'offre Cloud native et l'agilité mais ne couvre pas le cadre méthodologique ou les certifications techniques tel que kubernetes, helm, argoCG, etc...  ce sont de.

La certification "Cloud Pi Native" est remise par le ministère de l'Intérieur ou via les entités qui ont reçus l'acréditation pour le faire. La certification est remise sous la forme d'un mail et d'un badge numérique.
Elle est pour l'instant valable pour un an.

Si vous êtes intéressé, avez des questions et/ou suggestion, contactez-nous à:
<cloudpinative-relations@interieur.gouv.fr>

**Dans ce repository vous trouverez un article qui présente l'ensemble des compétences requises:**

- Les fondamentaux à connaitre pour mettre en oeuvre et maintenir dans le temps des applications de qualité qui répondent aux besoins;
- mettre en place l'amélioration continue et le refactoring;
- softskill et approche pour accompagner les les équipes de développement;
- connaissance du CCT Cloud Pi native et des exigences applicables;
- compréhension de l'offre de service Cloud Pi Native et le parcours de contractualisation;
- compréhension et utilisation de la chaine de construction applicative;
- comment contribuer à l'offre pull request et faire un feedback.

Ce repository référence les capacités et messages clés à transmettre mais ne référence par les contenus détaillés. 
Les experts se forment avec les programmes de leur choix, ils doivent juste être connaissant ou compétent sur les thèmes cités. 

A toutes fin utiles : une base de connaissance et d'embarquement en open-source "Cloud Native" est disponible sur : <https://github.com/cloud-pi-native/embarquement-autoformation>. C'est également une aide pour monter des parcours.

**Les messages clés, le contexte et la vision:**

Cloud Pi Native est un programme d'ensemble du ministère de l'Intérieur et des Outres-mer pour produire un numérique de qualité, soutenable dans la durée au coup de possession optimisé et qui répond au besoin. 
L'objectif visé est de soutenir la production de produits logiciels de qualité, en réduisant la xharge de travail de l'équipe pour le construire, facilement évolutif et maintenable dans le temps avec un coût de possession optimisé tout en répondant au besoin en ce centrant sur l'usager.

Ce qui est structurant : l'utilisation exclusive de Kubernetes pour l'orchestration de conteuneurs,le modèle opérationnel "you built it, you run it" et la mise en disposition en open-source de l'ensemble des ressources sauf portion sensible.

L'hébergement du service peut-être effectué soit via l'offre interministériel Cloud Pi, soit sur un cloud public si le niveau de sensbilité des données le permet ainsi que l'absence de conflit de normes juridiques entre les CGU de l'hébergeur avec les réglementations française et européennes.

**Le programme d'ensemble Cloud Pi Native inclus :**

- une architecture applicative de référence facilitant la construction et l'homologation des applications
- un pipeline DevSecOps à 2 étapes permettant à un développeur de construire et déployer en continue une application sur les environnements ministériel ou vers un cloud public depuis son environnement de travail pouvant être situé sur internet
- une console et une infrastructure automatisée permettant une mise à disposition rapide des ressources d'insfrastructures au profil d'un hébergement sur le cloud Pi du ministère. 
- un cadre de cohérence technique dédié à cette offre, comprenant un référentiel d'exigences à respecter
- un programme de formation d'ensemble du ministère, au cloud, à l'agilité, au mode produit, dont une valise de fomation et de référencement de ressources majoritairement gratuite permettant la montée en connaissance des acteurs
- un programme de certification, l'objet de ce repository permettant de valider les acquis de compétence dans l'objectif de répartir la connaissance auprès des développeurs et des entreprise de service numérique.

**Dans le cadre de la certification nous recrutons des volontaires pour:**
- la production et/ou la critique des éléments de contenu pédagogique
- le cadre d'évaluation et le tutorat des coachs   
- élaborer un test d'auto-évaluation qui sera accessible à tous.

Le rythme de production de la certification est réalisée en incrément de planning tout les 2,5 mois environ. 
Synchronisé avec la production de l'offre elle-même.
 Signalez-vous par les fonctions collaboratives de GitHub.

Nous sommes à votre écoute pour toute suggestion, critique et apport de contenu. 

Bien à vous, l'équipe Cloud Pi Native ;)


Définitions :

*Enabling team* est défini au sein du livre *Team Topologies* cf. : <https://hennyportman.wordpress.com/2020/05/25/review-team-topologies/>
Selon les organisation, ces équipes peuvent parfois s'appeler équipes DevOps ou par abus de langage *SRE*, si inclusion d'une activité SysAdmin.
Le terme SRE est un terme spécifique à l'organisation Google cf <https://cloud.google.com/sre?hl=fr>

