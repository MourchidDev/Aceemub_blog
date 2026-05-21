# 🛠 Rapport d'Incident Technique : Intégration Prisma & Node.js (ESM)

## 📋 Contexte
Lors du développement du backend de **Aceemub_Blog**, nous avons rencontré des erreurs critiques bloquant l'initialisation du client Prisma sous Windows dans un environnement Node.js configuré en ES Modules (`"type": "module"`).

---

## 🔍 Problématiques Rencontrées

### 1. Conflit de Résolution de Modules (Windows & ESM)
**Erreur :** `ERR_INVALID_MODULE_SPECIFIER` / `MODULE_NOT_FOUND`
- **Cause :** Node.js en mode ESM est très strict sur la résolution des chemins. L'approche par défaut de Prisma (génération dans un dossier caché `.prisma` au sein de `node_modules`) a créé des conflits de lecture, accentués par des espaces dans les chemins de dossiers parents (`My documentation`).
- **Impact :** Impossibilité pour Node.js de localiser le moteur de requête (Query Engine).

### 2. Rupture de Version (Prisma 7.x vs 6.x)
**Erreur :** `The datasource property url is no longer supported in schema files.`
- **Cause :** Utilisation de la version 7.6.0. Cette version majeure déporte la configuration de la connexion vers un fichier `prisma.config.ts` et impose l'usage de Driver Adapters (comme `@prisma/adapter-pg`) pour les connexions directes.
- **Impact :** Incompatibilité avec la syntaxe standard `env("DATABASE_URL")` dans le fichier `schema.prisma`.

### 3. Incohérence du "Engine Type"
**Erreur :** `Using engine type "client" requires either "adapter" or "accelerateUrl"`
- **Cause :** Prisma générait par défaut un client optimisé pour l'Edge Computing (Wasm) au lieu d'un moteur binaire local (`library`). Cela exigeait une configuration supplémentaire complexe inutile pour un serveur Express classique.

---

## 🛠 Approches de Résolution & Échecs

| Approche | Résultat | Pourquoi ? |
| :--- | :--- | :--- |
| **Chemin Personnalisé (`output`)** | ⚠️ Partiel | A réglé les problèmes de détection de fichiers mais a créé des erreurs de constructeur (`PrismaClientConstructorValidationError`). |
| **Utilisation de Prisma 7** | ❌ Échec | Trop de complexité ajoutée (besoin d'adaptateurs manuels) pour un projet en phase de démarrage. |
| **Rétrogradation en Prisma 6** | ✅ **Succès** | Rétablit la compatibilité avec la syntaxe simplifiée et la gestion native des pilotes PostgreSQL. |

---

## ✅ Solution Finale Retenue (Architecture Stable)

1. **Environnement :** Migration vers **Prisma 6.x** pour garantir la stabilité.
2. **Standardisation :** Suppression des sorties personnalisées (`output`) dans `schema.prisma` pour laisser Prisma gérer son cache interne proprement.
3. **Configuration du Client :**
   - Importation via le package officiel : `import { PrismaClient } from '@prisma/client'`.
   - Utilisation de `engineType = "library"` pour exploiter les binaires Node-API natifs.
4. **Hygiène du Projet :** Nettoyage complet du cache (`node_modules` et `package-lock.json`) pour éliminer les résidus de la version 7.

---

## 💡 Leçons Apprises (Mentor Tips)

*   **Nommage des Dossiers :** Toujours éviter les espaces dans les chemins de projets de développement (utiliser `_` ou `-`).
*   **Gestion des Versions :** "Le plus récent n'est pas toujours le meilleur". En production, on privilégie souvent la version N-1 pour bénéficier d'une documentation stable.
*   **Principe d'Immutabilité :** En cas de conflit de versions de librairies, la solution la plus rapide est souvent la suppression totale de `node_modules` plutôt que le "patch" manuel.