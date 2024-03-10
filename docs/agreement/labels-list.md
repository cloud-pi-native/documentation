# Labélisation des ressources kubernetes

Dans le cadre de l'offre de services du MIOM, il sera demandé d'ajouter les labels suivants sur vos ressources kubernetes :

## Type d'environnement

Ajouter un label `env: <element>` où `element` est un élément de la liste suivante :

- dev
- formation
- qualif
- test
- preprod
- prod

## Tiers

Ajouter un label `tier: <element>` où `element` est un élément de la liste suivante :

- frontend
- backend
- db
- cache
- auth

## Criticité

Ajouter un label `criticality: <element>` où `element` est un élément de la liste suivante :

- high
- medium
- low

## Composant

Ajouter un label `component: <element>` où `element` est un élément de la liste suivante :

- web :
	- nginx
	- apache
	- caddy
	- tomcat

- defaults :
	- python
	- node
	- openjdk
	- golang
	- php
	- ruby
	- perl
	- drupal
	- java

- database : 
	- postgres
	- mariadb
	- mysql
	- mongo
	- cassandra
	- cockroach
	- influx
	- etcd

- caching :
	- varnish
	- redis
	- memcached

- broker :
	- rabbitmq
	- kafka
	- apachemq
	- kubemq

- others :
	- busybox