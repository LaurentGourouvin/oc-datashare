# API Contract | DataShare

## Général

| Propriété | Valeur |
|---|---|
| Base URL | `http://localhost:3000` |
| Format | JSON |
| Authentification | Bearer JWT |

---

## Authentification

### POST `/auth/register`

Création d'un compte utilisateur.

**Auth requise :** Non

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 201 | Compte créé | `{ "access_token": "eyJ..." }` |
| 400 | Données invalides ou email déjà utilisé | `{ "message": "Registration failed" }` |

---

### POST `/auth/login`

Connexion d'un utilisateur existant.

**Auth requise :** Non

**Body :**
```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 200 | Connexion réussie | `{ "access_token": "eyJ..." }` |
| 401 | Identifiants incorrects | `{ "message": "Invalid credentials" }` |

---

## Fichiers

### POST `/files/upload`

Upload d'un fichier par un utilisateur connecté.

> ⚠️ US déléguée au copilote IA — voir `AGENTS.md`

**Auth requise :** Oui (Bearer JWT)

**Content-Type :** `multipart/form-data`

**Body :**

| Champ | Type | Requis | Description |
|---|---|---|---|
| `file` | File | ✅ | Le fichier à uploader (max 1 Go) |
| `expiresIn` | number | ❌ | Durée en jours avant expiration (défaut : 7, max : 7) |
| `filePassword` | string | ❌ | Mot de passe de protection (min 6 caractères) |

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 201 | Upload réussi | `{ "token": "uuid", "originalName": "photo.jpg", "size": 204800, "expiresAt": "2026-03-05T..." }` |
| 400 | Fichier invalide | `{ "message": "File type not allowed" }` |
| 400 | Fichier trop lourd | `{ "message": "File size exceeds 1GB limit" }` |
| 401 | Non authentifié | `{ "message": "Unauthorized" }` |

---

### GET `/files`

Récupère l'historique des fichiers de l'utilisateur connecté.

**Auth requise :** Oui (Bearer JWT)

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 200 | Liste des fichiers | Voir exemple ci-dessous |
| 401 | Non authentifié | `{ "message": "Unauthorized" }` |

**Exemple de réponse 200 :**
```json
[
  {
    "id": "uuid",
    "token": "uuid",
    "originalName": "photo.jpg",
    "mimeType": "image/jpeg",
    "size": 204800,
    "expiresAt": "2026-03-05T10:00:00.000Z",
    "createdAt": "2026-02-26T10:00:00.000Z",
    "isExpired": false
  }
]
```

---

### DELETE `/files/:id`

Supprime un fichier appartenant à l'utilisateur connecté.

**Auth requise :** Oui (Bearer JWT)

**Paramètres :**

| Paramètre | Type | Description |
|---|---|---|
| `id` | string (UUID) | L'identifiant du fichier |

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 200 | Fichier supprimé | `{ "message": "File deleted successfully" }` |
| 401 | Non authentifié | `{ "message": "Unauthorized" }` |
| 403 | Fichier d'un autre utilisateur | `{ "message": "Forbidden" }` |
| 404 | Fichier introuvable | `{ "message": "File not found" }` |

---

### GET `/files/download/:token`

Télécharge un fichier via son token public.

**Auth requise :** Non

**Paramètres :**

| Paramètre | Type | Description |
|---|---|---|
| `token` | string (UUID) | Le token unique de téléchargement |

**Query params (optionnel) :**

| Paramètre | Type | Description |
|---|---|---|
| `password` | string | Mot de passe si le fichier est protégé |

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 200 | Fichier streamé | Binaire du fichier avec headers `Content-Disposition` |
| 401 | Mot de passe incorrect | `{ "message": "Invalid password" }` |
| 404 | Token invalide | `{ "message": "File not found" }` |
| 410 | Lien expiré | `{ "message": "Link has expired" }` |

---

### GET `/files/download/:token/info`

Récupère les métadonnées d'un fichier avant téléchargement.

**Auth requise :** Non

**Réponses :**

| Code | Description | Body |
|---|---|---|
| 200 | Métadonnées du fichier | `{ "originalName": "photo.jpg", "size": 204800, "mimeType": "image/jpeg", "expiresAt": "...", "isProtected": true }` |
| 404 | Token invalide | `{ "message": "File not found" }` |
| 410 | Lien expiré | `{ "message": "Link has expired" }` |