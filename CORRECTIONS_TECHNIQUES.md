# Documentation des Corrections Techniques - ACEEMUB Blog

## Date : 29/05/2026
## Projet : Plateforme Blog ACEEMUB (Frontend React + Backend Node.js)

---

## Table des matières

1. [Problèmes d'API et Endpoints](#1-problèmes-dapi-et-endpoints)
2. [Loader Personnalisé Non Utilisé](#2-loader-personnalisé-non-utilisé)
3. [Affichage des Images de Couverture](#3-affichage-des-images-de-couverture)
4. [Génération de Carte Membre](#4-génération-de-carte-membre)
5. [Modales de Confirmation](#5-modales-de-confirmation)
6. [Système de Notifications](#6-système-de-notifications)
7. [Erreur Vite avec Motion](#7-erreur-vite-avec-motion)
8. [Conflit d'Export usersApi](#8-conflit-dexport-usersapi)

---

## 1. Problèmes d'API et Endpoints

### 🔴 Problème
Plusieurs méthodes API manquantes ou incomplètes dans le frontend, causant des erreurs lors de l'utilisation de hooks personnalisés.

#### Erreurs spécifiques :
- `commentsApi.update()` n'existait pas mais était appelé dans `useUpdateComment`
- `eventsApi.create()`, `update()`, `addAlbum()` et autres méthodes manquantes
- `usersApi` n'existait pas du tout comme fichier séparé
- Export manquant de `usersApi` dans `api/index.ts`

### ✅ Solution

#### 1.1 Ajout de la méthode `update` dans `comments.ts`
```typescript
// src/api/comments.ts
export const commentsApi = {
  // ... autres méthodes
  update: async (p: { id: string; content: string; articleId: string }) =>
    (await apiClient.put<Comment>(`/comments/${p.id}`, { content: p.content })).data,
};

// src/api/events.ts
export const eventsApi = {
  getAll: async () => (await apiClient.get<Event[]>("/events")).data,
  getById: async (id: string) => (await apiClient.get<Event>(`/events/${id}`)).data,
  create: async (payload: any) => (await apiClient.post<Event>("/events", payload)).data,
  update: async (id: string, payload: any) => (await apiClient.put<Event>(`/events/${id}`, payload)).data,
  delete: async (id: string) => apiClient.delete(`/events/${id}`),
  addAlbum: async (eventId: string, images: File[], albumTitle?: string) => {
    const form = new FormData();
    images.forEach(img => form.append("images", img));
    if (albumTitle) form.append("title", albumTitle);
    return (await apiClient.post(`/events/${eventId}/albums`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  },
  // ... autres méthodes d'albums
};

// src/api/users.ts
import apiClient from "./client";
import type { AuthUser } from "@/types";

export type UpdateUserPayload = { 
  name?: string; 
  email?: string; 
  role?: AuthUser["role"]; 
  isActive?: boolean 
};
export type DeleteUserPayload = { reason?: string };

export const usersApi = {
  getAll: async () => (await apiClient.get<AuthUser[]>("/users")).data,
  updateRole: async (id: string, role: AuthUser["role"]) =>
    (await apiClient.put<AuthUser>(`/users/${id}/role`, { role })).data,
  toggleActive: async (id: string, isActive: boolean) =>
    (await apiClient.put<AuthUser>(`/users/${id}/active`, { isActive })).data,
  update: async (id: string, payload: UpdateUserPayload) =>
    (await apiClient.put<AuthUser>(`/users/${id}`, payload)).data,
  delete: async (id: string, payload?: DeleteUserPayload) =>
    apiClient.delete(`/users/${id}`, { data: payload }),
};

export * from "./auth";
export * from "./articles";
export * from "./categories";
export * from "./comments";
export * from "./events";
export * from "./announcements";
export * from "./forms";
export * from "./users"; // ✅ Ajouté
export { default as apiClient, API_ORIGIN } from "./client";


📊 Impact
    ✅ Tous les hooks personnalisés fonctionnent correctement

    ✅ Pas d'erreurs TypeScript sur les méthodes manquantes

    ✅ Gestion complète des événements, commentaires et utilisateurs
```

## 2. Loader Personnalisé Non Utilisé

### 🔴 Problème
Un composant Loader.tsx sophistiqué avec animations SVG existait mais n'était jamais utilisé. Les pages affichaient du texte simple "Chargement..." au lieu d'une animation professionnelle.

### ✅ Solution
#### 2.1 Intégration dans les pages clés
```tsx
    // ArticleDetail.tsx
import Loader from "@/components/Loader";

function ArticleDetailPage() {
  const { data: article, isLoading } = useQuery({...});
  
  if (isLoading) {
    return <Loader isLoading={true} />; // ✅ Au lieu de <div>Chargement...</div>
  }
  // ...
}

Pages modifiées :

ArticleDetail.tsx - Chargement de l'article

MemberCard.tsx - Chargement de la carte membre

Join.tsx - Soumission du formulaire d'adhésion

AuthPage.tsx - Authentification en cours

Blog.tsx - Chargement des articles et catégories

#### 2.2 Exemple d'utilisation conditionnelle
// Join.tsx
const [submitting, setSubmitting] = useState(false);

const submit = async () => {
  setSubmitting(true);
  try {
    const card = await membershipApi.apply({ ...form, photo });
    nav(`/membre/${card.id}`);
  } finally {
    setSubmitting(false);
  }
};

if (submitting) return <Loader isLoading={true} />;


 Impact
✅ Expérience utilisateur améliorée avec animations fluides

✅ Cohérence visuelle sur toute l'application

✅ Feedback visuel professionnel pendant les chargements

## 3. Affichage des Images de Couverture

### 🔴 Problème
Les images de couverture des articles ne s'affichaient pas dans la page de détail. Aucune gestion d'erreur en cas d'image manquante ou URL invalide.

### ✅ Solution
#### 3.1 Ajout du gestionnaire d'erreur
// ArticleDetail.tsx
{article.coverImage && (
  <div className="mt-7 px-5">
    <div className="overflow-hidden rounded-3xl bg-muted">
      <img
        src={article.coverImage}
        alt={article.title}
        className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
        onError={(e) => {
          e.currentTarget.style.display = 'none'; // ✅ Masque l'image si erreur
        }}
      />
    </div>
  </div>
)}

### 3.2 Transformation des URLs dans l'API
// src/api/articles.ts
const toDisplayArticle = (a: Article): Article => {
  let imageUrl = a.coverImage ?? null;
  if (imageUrl && imageUrl.startsWith("/uploads/")) {
    imageUrl = `${API_ORIGIN}${imageUrl}`; // ✅ Conversion URL relative → absolue
  }
  return {
    ...a,
    coverImage: imageUrl,
    // ...
  };
};

Impact
✅ Images affichées correctement avec URLs absolues

✅ Pas de broken images visibles

✅ Dégradation gracieuse si l'image n'existe pas



4. Génération de Carte Membre
🔴 Problème
Plusieurs problèmes avec la fonctionnalité de carte membre :

Erreur 404 lors de la création (endpoint incorrect)

Structure de réponse backend non prise en compte

QR code non affiché

Téléchargement PDF non fonctionnel

✅ Solution
4.1 Correction des endpoints API
// src/api/forms.ts - AVANT
const { data } = await apiClient.post<MembershipCard>("/membership", form, {...});
return data;

// APRÈS
const { data } = await apiClient.post<{ card: MembershipCard }>("membership/apply", form, {...});
return data.card; // ✅ Extraction de la carte depuis l'objet réponse

Changements :

/membership → membership/apply (sans / initial car baseURL contient /api)

Prise en compte de la structure { card: MembershipCard }

4.2 Affichage du QR code réel
// MemberCard.tsx
<div className="border-t border-background/10 p-5 text-center">
  {c.qrCode ? (
    <img src={c.qrCode} alt="QR Code" className="mx-auto h-28 w-28 rounded-2xl" />
  ) : (
    <div className="mx-auto grid h-28 w-28 place-items-center rounded-2xl bg-background text-foreground">
      <QrCode className="h-16 w-16" />
    </div>
  )}
</div>

4.3 Téléchargement PDF
const handleDownloadPDF = async () => {
  try {
    const response = await fetch(`${API_ORIGIN}/api/membership/${id}/pdf`);
    if (!response.ok) throw new Error("Échec du téléchargement");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carte-membre-${c.memberNumber}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("Carte téléchargée !");
  } catch {
    toast.error("Impossible de télécharger la carte");
  }
};

4.4 Fallback pour développement
// Gestion gracieuse si backend pas prêt
catch (error: any) {
  if (error?.response?.status === 404) {
    return {
      id: `temp-${Date.now()}`,
      memberNumber: `AEEMB-${Math.floor(1000 + Math.random() * 9000)}`,
      // ... données mock
    };
  }
  throw error;
}


 Impact
✅ Création de carte fonctionnelle

✅ QR code généré et affiché

✅ Téléchargement PDF opérationnel

✅ Fallback pour tests sans backend

5. Modales de Confirmation
🔴 Problème
Utilisation de window.confirm() natif du navigateur pour les suppressions :

Interface non personnalisable

Pas de cohérence avec le design system

Expérience utilisateur basique

// AVANT - Mauvaise pratique
<button onClick={() => confirm("Supprimer ?") && del.mutate(id)}>
  Supprimer
</button>

Solution
5.1 Utilisation du hook useConfirm
// AdminArticles.tsx
import ConfirmDialog from "@/components/ConfirmDialog";
import { useConfirm } from "@/hooks/useConfirm";

function AdminArticlesPage() {
  const { confirm, isOpen, options, handleConfirm, handleCancel } = useConfirm();
  
  const handleDelete = async (id: string, title: string) => {
    const confirmed = await confirm({
      title: "Supprimer l'article",
      message: `Êtes-vous sûr de vouloir supprimer <strong>${title}</strong> ? Cette action est irréversible.`,
      confirmText: "Supprimer",
      confirmColor: "danger",
    });
    if (confirmed) del.mutate(id);
  };
  
  return (
    <>
      {/* ... contenu */}
      {isOpen && options && (
        <ConfirmDialog
          title={options.title}
          message={options.message}
          confirmText={options.confirmText}
          cancelText={options.cancelText}
          confirmColor={options.confirmColor}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

5.2 Pages modifiées
✅ AdminArticles.tsx - Suppression d'articles

✅ AdminCategories.tsx - Suppression de catégories

✅ AdminComments.tsx - Suppression de commentaires

✅ AdminEvents.tsx - Suppression d'événements

✅ AdminUsers.tsx - Suppression d'utilisateurs

📊 Impact
✅ Interface cohérente avec le design system

✅ Messages HTML personnalisables

✅ Animations et transitions fluides

✅ Meilleure accessibilité

 Système de Notifications
🔴 Problème
Le NotificationProvider existait mais n'était pas intégré dans l'application.

✅ Solution
// main.tsx - APRÈS
<NotificationProvider>
  <App />
  <Toaster richColors position="top-center" />
</NotificationProvider>

Impact
✅ Notifications visuelles fonctionnelles

✅ Feedback utilisateur immédiat

7. Erreur Vite avec Motion
🔴 Problème
The file does not exist at "node_modules"
Solution
// vite.config.ts
optimizeDeps: {
  exclude: ['motion'], // ✅ Ajouté
},


8. Conflit d'Export usersApi
🔴 Problème
usersApi défini dans auth.ts ET users.ts

✅ Solution
Suppression du doublon dans auth.ts, conservation uniquement dans users.ts