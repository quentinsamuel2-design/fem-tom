# Tom&Fem — Prototype interactif

L'appli de rencontre pour femboys & tombouys. **Ton style, tes règles — aucune case obligatoire.**

## Lancer le prototype

Aucune dépendance, aucun build. Ouvrir simplement `index.html` dans un navigateur, ou :

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Fonctionnalités

- **Cartes à swiper** (glisser ou boutons ♥ / ✕) avec previews Like/Nope
- **3 vibes** : femboy (rose), tomboy (bleu), fluide (dégradé rose-bleu)
- **Profils détaillés** : bio, ville, pronoms, tags d'intérêts (clic sur une carte)
- **Écran "C'est un match !"** quand le like est mutuel
- **Onglet Matchs** : liste des profils matchés
- **Bouton ↩** pour annuler le dernier swipe

## Structure

- `index.html` — structure (deck, matchs, modales profil/match)
- `style.css` — thème sombre violet + pastels rose/bleu, responsive mobile
- `app.js` — données de démo (8 profils), logique swipe/match/rewind

## Données de démo

Les profils sont dans `PROFILES` (app.js). Les likes mutuels simulés sont
définis dans `LIKED_BACK` (ids 1, 4, 6, 7) pour la démo.

## Prochaines étapes (hors prototype)

- Sondage communautés (Reddit/Discord) pour valider l'intérêt — cf. étude de marché
- Anti-fétichisation : signalement, blocage, charte anti-chasers
- Anonymat optionnel, modération renforcée
- Lancement concentré sur 1-2 grandes villes
