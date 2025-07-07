import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate that required environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '❌ Configuration Supabase manquante!\n\n' +
    'Veuillez configurer vos variables d\'environnement Supabase:\n' +
    '1. Créez un fichier .env à la racine du projet\n' +
    '2. Ajoutez vos identifiants Supabase:\n' +
    '   VITE_SUPABASE_URL=https://votre-projet.supabase.co\n' +
    '   VITE_SUPABASE_ANON_KEY=votre-clé-anonyme\n' +
    '3. Redémarrez le serveur de développement\n\n' +
    'Vous pouvez trouver ces identifiants dans votre tableau de bord Supabase > Paramètres > API'
  );
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  throw new Error(
    '❌ URL Supabase invalide!\n\n' +
    'L\'URL doit être au format: https://votre-projet.supabase.co\n' +
    'URL actuelle: ' + supabaseUrl
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour TypeScript
export interface SupabaseEmployee {
  id: string;
  noms: string;
  sexe: 'M' | 'F';
  nationalite: string;
  date_naissance: string;
  date_embauche: string;
  date_fin_contrat: string | null;
  annee_naissance: number;
  annee_embauche: number;
  age: number;
  anciennete: number;
  tranche_age: string;
  tranche_anciennete: string;
  poste: string;
  personne_contacter: string;
  affectation: string;
  salaire: string;
  year: number;
  created_at: string;
  updated_at: string;
}