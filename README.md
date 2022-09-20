# API mon-menu.app

**Langage :** Node.js  
**Licence :** GNU Affero GPL

Ce projet contient le code source de l'API servant de back-end pour le site [mon-menu.app](https://mon-menu.app). Elle permet de fournir les services suivants :

* Gestion des utilisateurs,
* Gestion des aliments (en lecture seule pour la partie publique, et écriture pour la partie privée),
* [en cours] Gestion des recettes.

Les données exposées au travers de l'API peuvent provenir :

* D'une base de données PostgreSQL.

La documentation de l'API est disponible à la racine du répertoire d'installation, par exemple [api.mon-menu.app](https://api.mon-menu.app).

## Installation

1. Dans le répertoire **src**, créer un fichier **config.js** à partir d'un exemple (conseillé : **config_PostgreSQL.js**) et modifier son contenu pour pouvoir se connecter à la source de données.

2. Lancer le serveur.
