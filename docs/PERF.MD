# PERF.md | DataShare

## Outil utilisé

Pour les tests de performance j'ai utilisé [k6](https://k6.io/), un outil open source qui permet de simuler des utilisateurs simultanés sur une API et de mesurer les temps de réponse.

---

## Endpoint testé

J'ai choisi de tester `POST /files/upload` car c'est l'endpoint le plus critique du projet : il fait beaucoup de choses en même temps : vérification du JWT, validation du fichier, écriture sur le disque et insertion en base de données.

---

## Configuration du test

```javascript
export const options = {
  vus: 10,        // 10 utilisateurs simultanés
  duration: '30s', // pendant 30 secondes
};
```

- **Fichier de test :** PDF
- **Authentification :** Bearer JWT valide
- **Assertions :** status 201 + token présent dans la réponse

---

## Résultats

```
checks_total.......: 600     19.636852/s
checks_succeeded...: 100.00% 600 out of 600
checks_failed......: 0.00%   0 out of 600
✓ status is 201
✓ has token

http_req_duration..............: avg=17.16ms min=11.83ms med=16.53ms max=27.32ms p(90)=20.72ms p(95)=21.71ms
http_req_failed................: 0.00%  0 out of 300
http_reqs......................: 300    9.818426/s
iteration_duration.............: avg=1.01s   min=1.01s   med=1.01s   max=1.02s   p(95)=1.02s
vus............................: 10     min=10       max=10
data_received..................: 110 kB 3.6 kB/s
data_sent......................: 55 MB  1.8 MB/s
```

---

## Comment lire les résultats

Voilà comment j'ai interprété les métriques k6 :

| Métrique | Valeur | Ce que ça veut dire                         |
|---|---|---------------------------------------------|
| Requêtes totales | 300 | 10 VUs × ~30 itérations chacun sur 30s      |
| Taux de succès | 100% | Aucune erreur sur 300 requêtes              |
| Temps de réponse moyen | 17.16ms | Rapide pour un upload avec écriture disque  |
| p95 | 21.71ms | 95% des requêtes répondent en moins de 22ms |
| Temps de réponse max | 27.32ms | Pas de pic significatif                     |
| Débit | ~10 req/s | Du au `sleep(1)` dans le script             |

**Le p95** c'est la métrique la plus importante selon ce que j'ai compris, elle représente l'expérience du pire cas pour 95% des utilisateurs. Ici 21ms c'est très bon.

---

## Conclusion

Je suis satisfait des résultats pour un MVP :

- 0% d'erreur sur 300 requêtes simultanées
- Les temps de réponse sont très homogènes (min 11ms / max 27ms), pas de dégradation sous charge
- p95 à 21ms — largement en dessous des 200ms considérés comme acceptable pour une bonne expérience utilisateur

---

## Logs structurés

J'utilise le logger natif de NestJS pour tracer les événements importants :

```typescript
this.logger.log(`File uploaded: id=${record.id} userId=${userId}`);
this.logger.warn(`Physical file not found: ${file.storagePath}`);
```

Le premier log me permet de savoir qu'un fichier a bien été uploadé. Le deuxième m'alerte si un fichier a été supprimé de la BDD mais pas du disque.

---

## Ce que j'aurais pu faire de plus

- Tester avec plus de VUs (50, 100) pour voir à partir de quand le serveur commence à saturer
- Tester aussi `GET /files/download/:token` qui implique une lecture disque et un streaming