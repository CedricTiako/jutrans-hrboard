/*
  # Création de la table des employés JUTRANS

  1. Nouvelle table
    - `employees`
      - `id` (uuid, primary key)
      - `noms` (text, nom complet)
      - `sexe` (text, M/F)
      - `nationalite` (text)
      - `date_naissance` (date)
      - `date_embauche` (date)
      - `date_fin_contrat` (date, nullable)
      - `annee_naissance` (integer)
      - `annee_embauche` (integer)
      - `age` (integer)
      - `anciennete` (integer)
      - `tranche_age` (text)
      - `tranche_anciennete` (text)
      - `poste` (text)
      - `personne_contacter` (text)
      - `affectation` (text)
      - `salaire` (text)
      - `year` (integer, année de référence)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS sur la table `employees`
    - Politique pour permettre toutes les opérations aux utilisateurs authentifiés
*/

-- Création de la table employees
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  noms text NOT NULL,
  sexe text NOT NULL CHECK (sexe IN ('M', 'F')),
  nationalite text NOT NULL,
  date_naissance date NOT NULL,
  date_embauche date NOT NULL,
  date_fin_contrat date,
  annee_naissance integer NOT NULL,
  annee_embauche integer NOT NULL,
  age integer NOT NULL,
  anciennete integer NOT NULL,
  tranche_age text NOT NULL,
  tranche_anciennete text NOT NULL,
  poste text NOT NULL,
  personne_contacter text,
  affectation text,
  salaire text NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations aux utilisateurs authentifiés
CREATE POLICY "Authenticated users can manage employees"
  ON employees
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_employees_year ON employees(year);
CREATE INDEX IF NOT EXISTS idx_employees_poste ON employees(poste);
CREATE INDEX IF NOT EXISTS idx_employees_age ON employees(age);
CREATE INDEX IF NOT EXISTS idx_employees_anciennete ON employees(anciennete);
CREATE INDEX IF NOT EXISTS idx_employees_sexe ON employees(sexe);
CREATE INDEX IF NOT EXISTS idx_employees_nationalite ON employees(nationalite);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();