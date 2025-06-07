import { createClient } from '@supabase/supabase-js';

// Try to get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we're in development mode and provide a mock client
const isDevelopment = import.meta.env.DEV;

if (isDevelopment && (!supabaseUrl || supabaseUrl === 'https://placeholder-url.supabase.co' || !supabaseAnonKey || supabaseAnonKey === 'placeholder-key')) {
  console.warn('⚠️ Using placeholder Supabase credentials. Please set up your .env file with valid Supabase credentials.');
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