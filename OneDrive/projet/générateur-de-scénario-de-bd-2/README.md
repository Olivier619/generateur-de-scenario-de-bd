<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1XiLnY02fkpWNy7B9zxMiXfVaK_gfMKcL

## Configuration & Déploiement

### Utilisation de Perplexity AI

Cette application utilise désormais l'API **Perplexity AI** au lieu de Gemini.

1.  Obtenez une clé API sur [Perplexity AI](https://www.perplexity.ai/).
2.  Ajoutez votre clé dans le fichier `.env.local` :
    ```env
    PERPLEXITY_API_KEY=votre_cle_ici
    ```
3.  Lancez l'application localement :
    ```bash
    npm install
    npm run dev
    ```

### Déploiement sur Vercel via GitHub

1.  Poussez votre code sur un dépôt **GitHub**.
2.  Connectez-vous à [Vercel](https://vercel.com/) et créez un nouveau projet à partir de ce dépôt.
3.  Dans les **Environment Variables**, ajoutez :
    - `PERPLEXITY_API_KEY` : votre clé API Perplexity.
4.  Vercel détectera automatiquement la configuration Vite et déploiera l'application.
5.  Le fichier `vercel.json` inclus gère les redirections pour le bon fonctionnement de l'application (SPA).
