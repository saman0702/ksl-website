# 🚀 Guide de Déploiement Rapide - Katian Logistique

## Déploiement sur katianlogistique.com

### 📋 Prérequis
- Accès FTP/SFTP à votre hébergement
- Chemin vers le répertoire `public_html`

### 🔧 Étapes de déploiement

#### 1. Construire l'application
```bash
npm run build
```

#### 2. Préparer les fichiers
Le dossier `build/` contient tous les fichiers nécessaires :
- `index.html` - Page principale
- `.htaccess` - Configuration Apache (déjà inclus)
- `static/` - Fichiers CSS, JS et images
- Autres ressources

#### 3. Uploader sur votre hébergement

**Option A : Via FTP/SFTP**
1. Connectez-vous à votre hébergement via FTP
2. Naviguez vers le répertoire `public_html`
3. Supprimez tous les fichiers existants (sauvegardez si nécessaire)
4. Uploadez tout le contenu du dossier `build/`

**Option B : Via cPanel File Manager**
1. Ouvrez cPanel → File Manager
2. Naviguez vers `public_html`
3. Supprimez les fichiers existants
4. Uploadez le contenu du dossier `build/`

#### 4. Vérifier les permissions
```bash
chmod 644 public_html/ksl-website/*
chmod 755 public_html/ksl-website
chmod 644 public_html/ksl-website/.htaccess
```

### ✅ Vérification

Après le déploiement, testez :

1. **Page d'accueil** : https://katianlogistique.com/ksl-website
2. **Routing** : https://katianlogistique.com/ksl-website/login
3. **Inscription** : https://katianlogistique.com/ksl-website/register
4. **Thème sombre/clair** : Cliquez sur l'icône de thème

### 🚨 Problèmes courants

**Erreur 404 sur les routes**
- Vérifiez que `.htaccess` est bien uploadé
- Contactez votre hébergeur pour activer `mod_rewrite`

**Images qui ne se chargent pas**
- Vérifiez les permissions (644)
- Vérifiez que tous les fichiers sont uploadés

**Site ne se charge pas**
- Vérifiez que `index.html` est à la racine de `public_html/ksl-website`
- Vérifiez les logs d'erreur de votre hébergeur

### 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs d'erreur de votre hébergeur
2. Contactez le support de votre hébergeur
3. Ouvrez une issue sur GitHub : https://github.com/saman0702/ksl-website/issues

### 🔄 Mise à jour

Pour mettre à jour le site :
1. Faites les modifications dans votre code
2. `npm run build`
3. Uploadez le nouveau contenu du dossier `build/`

---

**🎉 Votre site Katian Logistique est maintenant en ligne !** 