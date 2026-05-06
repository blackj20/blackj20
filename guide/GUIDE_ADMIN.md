# Guide d'utilisation administrateur EMC Sarlu

Ce guide explique comment utiliser l'espace d'administration du site EMC Sarlu pour gérer les images, les réalisations, les actualités, les annonces et les statistiques.

## 1. Acceder a l'administration

1. Ouvrir le site dans le navigateur.
2. Aller sur la page de connexion admin :

```text
/admin/login
```

En local, l'adresse ressemble souvent a :

```text
http://localhost:PORT/admin/login
```

Le `PORT` depend de la configuration du fichier `.env`.

3. Saisir :

- l'identifiant admin ;
- le mot de passe admin.

4. Cliquer sur `Se connecter`.
5. Apres connexion, le navigateur redirige vers :

```text
/admin
```

Si une session admin valide existe deja, ouvrir `/admin/login` redirige automatiquement vers le tableau de bord.

## 2. Regles importantes

### Mot de passe

Le site ne contient pas de systeme de recuperation de mot de passe. Si le mot de passe admin est perdu, l'acces au compte peut devenir impossible sans intervention technique dans la base de donnees.

Bonnes pratiques :

- conserver le mot de passe dans un gestionnaire de mots de passe ;
- ne pas partager le mot de passe par message public ou non securise ;
- eviter les mots de passe courts ou faciles a deviner.

### Session admin

Apres connexion, le site place un cookie securise dans le navigateur. Ce cookie transporte la session admin.

La duree exacte du token depend de la variable `JWT_EXPIRES_IN` dans `.env`. Le cookie admin est prevu pour durer 7 jours, mais si le token expire avant, il faudra se reconnecter.

Quand la session expire, l'admin est renvoye vers la page de connexion ou vers une page d'erreur. Il suffit alors de refaire la connexion.

### Fichiers autorises

L'administration est prevue pour les images.

Ne pas uploader de videos. Le systeme n'est pas concu pour les fichiers video et cela peut provoquer des lenteurs, des erreurs ou un mauvais affichage du site.

Formats conseilles :

- JPG ou JPEG ;
- PNG ;
- WebP si le navigateur cible le supporte correctement.

Conseils avant upload :

- utiliser des images legeres ;
- eviter les noms de fichiers trop longs ;
- verifier que l'image est nette et bien orientee ;
- eviter les images confidentielles ou non autorisees.

## 3. Vue generale du tableau de bord

La page `/admin` contient :

- un bouton `Retour au site` pour revenir a la partie publique ;
- un bouton `Deconnexion` pour fermer la session admin ;
- des compteurs : images, realisations, actualites, annonces, visiteurs uniques ;
- une section `Uploader des images` ;
- une section `Realisations` ;
- une section `Actualites` ;
- une section `Annonces` ;
- une section `Statistiques` avec les images les plus vues.

Toutes les modifications sont enregistrees directement dans la base de donnees.

## 4. Gerer les images

La section `Uploader des images` sert a ajouter des images dans la galerie admin.

### Ajouter une image

1. Aller dans la section `Uploader des images`.
2. Cliquer sur le champ `Image`.
3. Choisir une image sur l'ordinateur.
4. Cliquer sur `Envoyer`.
5. Attendre le message de succes.

L'image apparait ensuite dans la galerie avec son nom de fichier.

### Supprimer une image

1. Trouver l'image dans la galerie.
2. Cliquer sur `Supprimer`.
3. Confirmer la suppression.

Attention : eviter de supprimer une image encore utilisee par une actualite ou une realisation. Si une image est deja affichee sur le site public, modifier d'abord le contenu concerne avec une nouvelle image.

## 5. Gerer les realisations

Les realisations alimentent notamment la page publique des realisations et les derniers projets visibles sur l'accueil.

### Ajouter une realisation

1. Aller dans la section `Realisations`.
2. Remplir les champs :

- `Annee` : exemple `2024` ;
- `Localisation` : exemple `Kinshasa` ;
- `Titre` : nom du projet ;
- `Description` : resume court du projet ;
- `Image (fichier)` : image representant la realisation.

3. Cliquer sur `Enregistrer`.
4. Verifier le message de succes.
5. Controler ensuite l'affichage sur la page publique `/realisation`.

L'image est obligatoire lors de la creation d'une realisation.

### Modifier une realisation

1. Dans le tableau des realisations, cliquer sur `Editer`.
2. Le formulaire remonte en mode modification.
3. Modifier les champs necessaires.
4. Pour garder l'image actuelle, ne pas choisir de nouveau fichier.
5. Pour remplacer l'image, choisir une nouvelle image dans `Image (fichier)`.
6. Cliquer sur `Mettre a jour`.

### Supprimer une realisation

1. Dans le tableau, cliquer sur `Supprimer`.
2. Confirmer la suppression.

La suppression retire la realisation du site public. Elle ne doit etre faite que si le contenu ne doit plus etre affiche.

## 6. Gerer les actualites

Les actualites alimentent la page publique `/actualites`.

### Ajouter une actualite

1. Aller dans la section `Actualites`.
2. Remplir :

- `Titre` ;
- `Description` ;
- `Image (fichier)`.

3. Cliquer sur `Enregistrer`.
4. Verifier le message de succes.
5. Controler l'affichage sur `/actualites`.

L'image est obligatoire lors de la creation d'une actualite.

### Modifier une actualite

1. Cliquer sur `Editer` dans la ligne de l'actualite.
2. Modifier le titre ou la description.
3. Choisir une nouvelle image seulement si l'image doit changer.
4. Cliquer sur `Mettre a jour`.

### Supprimer une actualite

1. Cliquer sur `Supprimer`.
2. Confirmer la suppression.

La suppression retire l'actualite du site public.

## 7. Gerer les annonces

Les annonces alimentent la page publique `/annonce`.

Une annonce contient seulement :

- un `Titre` ;
- un `Message`.

### Creer une annonce

1. Aller dans la section `Annonces`.
2. Remplir `Titre`.
3. Remplir `Message`.
4. Cliquer sur `Enregistrer`.
5. Verifier l'affichage sur `/annonce`.

### Modifier une annonce

1. Cliquer sur `Editer`.
2. Modifier le titre ou le message.
3. Cliquer sur `Mettre a jour`.

### Supprimer une annonce

1. Cliquer sur `Supprimer`.
2. Confirmer la suppression.

## 8. Lire les statistiques

La section `Statistiques` affiche :

- le nombre de visiteurs uniques ;
- les images les plus vues ;
- le nombre de vues par image.

Le nombre de visiteurs uniques est base sur un cookie visiteur conserve environ 30 jours dans le navigateur du visiteur.

Les vues d'images augmentent quand une image stockee dans `uploads` est affichee ou quand le site public signale une vue d'image.

Ces statistiques donnent une tendance, mais elles ne remplacent pas un outil d'analyse complet comme Google Analytics ou Matomo.

## 9. Se deconnecter

Pour fermer la session :

1. Cliquer sur `Deconnexion` en haut a droite du tableau de bord.
2. Le site renvoie vers `/admin/login`.

Toujours se deconnecter apres utilisation sur un ordinateur partage.

## 10. Controle apres modification

Apres chaque ajout, modification ou suppression, verifier :

- la page `/` ou `/accueil` pour les derniers projets ;
- la page `/realisation` pour les realisations ;
- la page `/actualites` pour les actualites ;
- la page `/annonce` pour les annonces ;
- l'affichage mobile si possible.

Si une image ne s'affiche pas :

- verifier que le fichier etait bien une image ;
- essayer de recharger la page ;
- verifier que le contenu utilise une image valide ;
- contacter le support technique si l'URL de l'image pointe vers un ancien domaine ou vers `localhost`.

## 11. Messages et erreurs courantes

### `identifiants invalides`

L'identifiant ou le mot de passe est incorrect.

Actions :

- verifier les majuscules/minuscules ;
- verifier que le bon compte admin est utilise ;
- ressaisir le mot de passe lentement.

### `pas de token` ou `invalid or expired token`

La session admin est absente, invalide ou expiree.

Action :

- retourner sur `/admin/login` et se reconnecter.

### `Veuillez choisir une image`

Une realisation ou une actualite est creee sans image.

Action :

- selectionner une image dans le champ `Image (fichier)`, puis enregistrer.

### `Aucun fichier recu`

Le serveur n'a pas recu le fichier image.

Actions :

- recommencer l'upload ;
- choisir un autre fichier ;
- verifier que le fichier n'est pas une video.

## 12. Annexe technique pour maintenance

Routes admin principales :

```text
GET    /admin/login
POST   /admin/login
GET    /admin
POST   /admin/logout
POST   /admin/upload-image
GET    /admin/images
DELETE /admin/images/:id
GET    /admin/realisation
POST   /admin/realisation
PUT    /admin/realisation/:id
DELETE /admin/realisation/:id
GET    /admin/actualite
POST   /admin/actualite
PUT    /admin/actualite/:id
DELETE /admin/actualite/:id
GET    /admin/annonce
POST   /admin/annonce
PUT    /admin/annonce/:id
DELETE /admin/annonce/:id
GET    /admin/stats
```

Tables principales :

- `users` : comptes admin ;
- `images` : images uploadees ;
- `realisation` : projets/realisations ;
- `actualite` : actualites ;
- `annonce` : annonces ;
- `visitor_session` : visiteurs uniques ;
- `image_views` : vues des images.

Variables `.env` importantes :

- `PORT` : port du serveur ;
- `PUBLIC_URL` : URL publique utilisee pour construire les liens d'images ;
- `DB_PATH` : chemin de la base SQLite ;
- `JWT_SECRET` : secret de signature des sessions ;
- `JWT_EXPIRES_IN` : duree de validite du token admin.

Ne jamais publier les valeurs reelles de `JWT_SECRET` ou des identifiants admin.
