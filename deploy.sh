#!/bin/bash

# Script de déploiement pour Katian Logistique
# Domaine: katianlogistique.com

echo "🚀 Déploiement de Katian Logistique..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/blaise/Documents/Mes Projets/Node/KSL/ksl-website"
BUILD_DIR="$PROJECT_DIR/build"
DEPLOY_DIR="/path/to/your/public_html"  # Remplacez par le chemin réel vers votre public_html

echo -e "${YELLOW}📦 Construction de l'application...${NC}"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm n'est pas installé${NC}"
    exit 1
fi

# Aller dans le répertoire du projet
cd "$PROJECT_DIR"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📥 Installation des dépendances...${NC}"
    npm install
fi

# Nettoyer le build précédent
if [ -d "build" ]; then
    echo -e "${YELLOW}🧹 Nettoyage du build précédent...${NC}"
    rm -rf build
fi

# Construire l'application
echo -e "${YELLOW}🔨 Construction de l'application...${NC}"
npm run build

# Vérifier si le build a réussi
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Échec de la construction${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Construction réussie !${NC}"

# Vérifier si le répertoire de déploiement existe
if [ ! -d "$DEPLOY_DIR" ]; then
    echo -e "${RED}❌ Répertoire de déploiement non trouvé: $DEPLOY_DIR${NC}"
    echo -e "${YELLOW}⚠️  Veuillez modifier le script pour pointer vers le bon répertoire public_html${NC}"
    exit 1
fi

# Sauvegarder l'ancien contenu (optionnel)
BACKUP_DIR="$DEPLOY_DIR/backup_$(date +%Y%m%d_%H%M%S)"
echo -e "${YELLOW}💾 Sauvegarde de l'ancien contenu...${NC}"
mkdir -p "$BACKUP_DIR"
cp -r "$DEPLOY_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true

# Nettoyer le répertoire de déploiement
echo -e "${YELLOW}🧹 Nettoyage du répertoire de déploiement...${NC}"
rm -rf "$DEPLOY_DIR"/*

# Copier les fichiers du build
echo -e "${YELLOW}📁 Copie des fichiers...${NC}"
cp -r build/* "$DEPLOY_DIR/"

# Copier le fichier .htaccess
echo -e "${YELLOW}📄 Copie du fichier .htaccess...${NC}"
cp public/.htaccess "$DEPLOY_DIR/"

# Définir les permissions
echo -e "${YELLOW}🔐 Configuration des permissions...${NC}"
chmod 644 "$DEPLOY_DIR"/*
chmod 755 "$DEPLOY_DIR"

echo -e "${GREEN}🎉 Déploiement terminé avec succès !${NC}"
echo -e "${GREEN}🌐 Votre site est maintenant disponible sur: https://katianlogistique.com${NC}"
echo -e "${YELLOW}💡 Sauvegarde disponible dans: $BACKUP_DIR${NC}"

# Vérification rapide
echo -e "${YELLOW}🔍 Vérification du déploiement...${NC}"
if [ -f "$DEPLOY_DIR/index.html" ]; then
    echo -e "${GREEN}✅ index.html trouvé${NC}"
else
    echo -e "${RED}❌ index.html manquant${NC}"
fi

if [ -f "$DEPLOY_DIR/.htaccess" ]; then
    echo -e "${GREEN}✅ .htaccess trouvé${NC}"
else
    echo -e "${RED}❌ .htaccess manquant${NC}"
fi

echo -e "${GREEN}✨ Déploiement terminé !${NC}" 