# Katian Logistique - Plateforme de Logistique Innovante

Site web officiel de Katian Logistique, une plateforme innovante pour optimiser les livraisons et gérer les points relais en Côte d'Ivoire.

## 🌟 Fonctionnalités

- **Interface moderne** avec design responsive
- **Système d'authentification** complet
- **Inscription multi-étapes** pour différents types d'utilisateurs
- **Thème sombre/clair** avec persistance
- **Routing côté client** optimisé
- **Performance optimisée** avec compression et cache

## 🚀 Déploiement sur katianlogistique.com

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- Accès au répertoire `public_html` de votre hébergement

### Configuration du fichier .htaccess

Le fichier `.htaccess` est déjà configuré dans le dossier `public/` avec :

- ✅ **SPA Routing** : Redirection vers index.html pour le routing React
- ✅ **Compression GZIP** : Optimisation des performances
- ✅ **Cache des fichiers statiques** : Amélioration du temps de chargement
- ✅ **Headers de sécurité** : Protection XSS, clickjacking, etc.
- ✅ **HTTPS redirection** (commenté - à activer si vous avez un certificat SSL)

### Étapes de déploiement

#### Option 1 : Script automatique (Recommandé)

1. **Modifiez le script de déploiement** :
   ```bash
   # Éditez le fichier deploy.sh
   nano deploy.sh
   
   # Remplacez cette ligne par le chemin réel vers votre public_html :
   DEPLOY_DIR="/chemin/vers/votre/public_html"
   ```

2. **Exécutez le script** :
   ```bash
   ./deploy.sh
   ```

#### Option 2 : Déploiement manuel

1. **Construire l'application** :
   ```bash
   npm install
   npm run build
   ```

2. **Copier les fichiers** :
   ```bash
   # Copier le contenu du dossier build vers votre public_html
   cp -r build/* /chemin/vers/votre/public_html/
   
   # Copier le fichier .htaccess
   cp public/.htaccess /chemin/vers/votre/public_html/
   ```

3. **Configurer les permissions** :
   ```bash
   chmod 644 /chemin/vers/votre/public_html/*
   chmod 755 /chemin/vers/votre/public_html
   ```

### Configuration SSL/HTTPS

Pour activer HTTPS, décommentez ces lignes dans le fichier `.htaccess` :

```apache
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Vérification du déploiement

Après le déploiement, vérifiez que :

- ✅ Le site est accessible sur https://katianlogistique.com
- ✅ Le routing fonctionne (essayez d'accéder directement à `/login` ou `/register`)
- ✅ Les images et ressources se chargent correctement
- ✅ Le thème sombre/clair fonctionne
- ✅ L'inscription et la connexion marchent

## 🛠️ Développement local

### Installation

```bash
git clone https://github.com/saman0702/ksl-website.git
cd ksl-website
npm install
```

### Lancement en mode développement

```bash
npm start
```

Le site sera accessible sur http://localhost:3000

### Build de production

```bash
npm run build
```

## 📁 Structure du projet

```
ksl-website/
├── public/
│   ├── .htaccess          # Configuration Apache
│   ├── index.html         # Template HTML principal
│   └── katian-logo.png    # Logo de l'entreprise
├── src/
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages de l'application
│   ├── services/         # Services API
│   ├── contexts/         # Contextes React
│   └── utils/            # Utilitaires
├── deploy.sh             # Script de déploiement
└── README.md             # Ce fichier
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
REACT_APP_API_URL=https://api.katianlogistique.com
REACT_APP_SITE_URL=https://katianlogistique.com
```

### Personnalisation

- **Couleurs** : Modifiez les variables CSS dans `src/index.css`
- **Logo** : Remplacez `public/katian-logo.png`
- **Favicon** : Remplacez `public/favicon.ico`

## 🚨 Dépannage

### Problèmes courants

1. **Erreur 404 sur les routes** :
   - Vérifiez que le fichier `.htaccess` est bien copié
   - Assurez-vous que `mod_rewrite` est activé sur votre serveur

2. **Images qui ne se chargent pas** :
   - Vérifiez les permissions des fichiers (644)
   - Vérifiez que les chemins sont corrects

3. **Problèmes de cache** :
   - Videz le cache du navigateur
   - Vérifiez les headers de cache dans `.htaccess`

### Logs d'erreur

Pour déboguer, vérifiez les logs d'erreur Apache :
```bash
tail -f /var/log/apache2/error.log
```

## 📞 Support

Pour toute question ou problème :
- **Email** : support@katianlogistique.com
- **GitHub** : https://github.com/saman0702/ksl-website/issues

## 📄 Licence

© 2024 Katian Logistique. Tous droits réservés. 