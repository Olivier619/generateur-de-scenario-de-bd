import type { StoryFormData, Script } from '../types';

const API_KEY = process.env.PERPLEXITY_API_KEY;

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const callPerplexity = async (messages: any[], temperature = 0.8, jsonMode = false) => {
    if (!API_KEY) {
        throw new Error("PERPLEXITY_API_KEY non configurée. Veuillez l'ajouter dans vos variables d'environnement.");
    }

    const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'sonar',
            messages,
            temperature,
            response_format: jsonMode ? { type: 'json_object' } : undefined,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erreur API Perplexity (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

export const generateSummary = async (formData: StoryFormData): Promise<string> => {
    let prompt = `Tu es un scénariste professionnel de bandes dessinées. Ta tâche est de créer un résumé captivant pour une nouvelle histoire en français, entre 100 et 200 mots. Ce résumé servira de base pour écrire le script complet plus tard. Il doit être créatif et donner envie de lire la suite.\n\n`;
    prompt += `--- PARAMÈTRES DE L'HISTOIRE ---\n`;
    prompt += `Titre: ${formData.title}\n`;
    prompt += `Genre: ${formData.genre} (${formData.subGenre})\n`;
    prompt += `Ton: ${formData.tone}\n`;
    prompt += `Public Cible: ${formData.targetAudience}\n`;
    prompt += `Idée de base: ${formData.baseIdea}\n`;
    prompt += `Éléments clés de l'intrigue: ${formData.plotKeywords.join(', ')}\n`;
    prompt += `Thèmes principaux: ${formData.mainThemes.join(', ')}\n`;
    prompt += `Personnages: ${formData.characters.map(c => `${c.name} (${c.description})`).join('; ')}\n\n`;
    prompt += `Génère maintenant le résumé.`;

    try {
        const text = await callPerplexity([
            { role: 'system', content: 'Tu es un assistant écrivain expert en scénario de BD.' },
            { role: 'user', content: prompt }
        ]);
        return text.trim();
    } catch (error) {
        console.error("Error generating summary:", error);
        throw error;
    }
};

const buildScriptPrompt = (formData: StoryFormData, summary: string, existingScript: Script | null = null): string => {
    const chaptersToGenerateSettings = existingScript
        ? formData.chapterSettings.slice(existingScript.chapters.length)
        : formData.chapterSettings;

    let prompt = `Tu es un scénariste professionnel de bandes dessinées. Ta tâche est de générer un script complet et structuré en français en te basant sur le résumé approuvé ci-dessous.\n\n`;

    prompt += `--- RÉSUMÉ APPROUVÉ DE L'HISTOIRE ---\n`;
    prompt += `${summary}\n\n`;

    if (existingScript) {
        prompt += `Continue le script suivant à partir du chapitre ${existingScript.chapters.length + 1}. Voici le début de l'histoire pour te donner le contexte:\n\n${JSON.stringify(existingScript, null, 2)}\n\nAssure-toi que la suite est cohérente avec les événements précédents.\n\n`;
    }

    prompt += `--- PARAMÈTRES DE L'HISTOIRE ---\n`;
    prompt += `Titre: ${formData.title}\n`;
    prompt += `Nombre de chapitres à générer: ${chaptersToGenerateSettings.length}\n`;
    prompt += `Structure des chapitres:\n`;
    chaptersToGenerateSettings.forEach((chap, index) => {
        const chapterNumber = (existingScript?.chapters.length || 0) + index + 1;
        prompt += ` - Chapitre ${chapterNumber}: ${chap.pages} pages.\n`;
    });
    prompt += `Genre: ${formData.genre}\n`;
    prompt += `Ton: ${formData.tone}\n`;
    prompt += `Style artistique: ${formData.artStyle}\n`;

    prompt += `\n--- FORMAT DE SORTIE JSON ATTENDU ---\n`;
    prompt += `Tu DOIS répondre UNIQUEMENT avec un objet JSON valide suivant cette structure :\n`;
    prompt += `{
  "title": "Titre du script",
  "chapters": [
    {
      "chapterTitle": "Titre du chapitre",
      "pages": [
        {
          "pageNumber": 1,
          "panels": [
            {
              "panelNumber": 1,
              "description": "Description visuelle détaillée",
              "dialogues": [{ "character": "Nom", "dialogue": "Texte" }],
              "narration": "Texte narratif ou vide",
              "onomatopoeia": "BOOM! ou vide"
            }
          ]
        }
      ]
    }
  ]
}\n\n`;

    prompt += `--- INSTRUCTIONS IMPORTANTES ---\n`;
    prompt += `1. Respecte le nombre de pages par chapitre.\n`;
    prompt += `2. Varie le nombre de cases par page (1 à 6).\n`;
    prompt += `3. Ne réponds rien d'autre que l'objet JSON.\n`;

    return prompt;
};

export const generateScript = async (formData: StoryFormData, summary: string, existingScript: Script | null = null): Promise<Script> => {
    const prompt = buildScriptPrompt(formData, summary, existingScript);

    try {
        const text = await callPerplexity([
            { role: 'system', content: 'Tu es un scénariste de BD qui répond exclusivement en JSON.' },
            { role: 'user', content: prompt }
        ], 0.7, true);

        const cleanedText = text.replace(/^```json\s*|```\s*$/g, '');
        const generatedData = JSON.parse(cleanedText);

        if (existingScript) {
            return {
                ...existingScript,
                chapters: [...existingScript.chapters, ...generatedData.chapters]
            };
        }

        return generatedData as Script;
    } catch (error) {
        console.error("Error generating script:", error);
        throw error;
    }
};
