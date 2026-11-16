# FluxSign

FluxSign est le service de signature électronique d'[Agence Flux Digital](https://www.agence-fluxdigital.fr/signature-electronique/). Il repose sur [Documenso](https://github.com/documenso/documenso) v2.22.0, publié sous licence AGPL-3.0.

Ce dépôt contient l'intégralité de nos modifications, comme le demande la licence. Elles sont toutes appliquées au moment de la construction de l'image, à partir de l'image officielle `documenso/documenso:v2.22.0` :

- `marque/Dockerfile` remplace le nom et les logos, complète la traduction française (`fr-complet.json`, `libelles-fr.json`), corrige le nom de la pièce jointe du mail de fin (`.pdf.pdf`), affiche les heures du certificat en heure de Paris au format français, retire npm de l'image et fait pointer le pied des mails vers notre offre.
- `marque/catalogue-fr.mjs`, `marque/libelles.mjs` et `marque/logo-composant.mjs` sont les scripts qui appliquent ces changements au code compilé.
- `compose.exemple.yml` montre comment l'image est lancée avec Postgres. Les variables d'environnement (secrets, adresse du serveur de courriel) ne sont pas publiées.

## Construire

```bash
docker build -t fluxsign:2.22.0 marque
```

## Licence

Les modifications sont publiées sous la même licence que Documenso, l'AGPL-3.0 (fichier `LICENSE`). Les logos et la photo appartiennent à Agence Flux Digital et ne sont pas couverts par cette licence.
