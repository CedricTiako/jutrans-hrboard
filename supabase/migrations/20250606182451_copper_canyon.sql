/*
  # Insertion des données initiales des employés JUTRANS

  1. Données
    - Insertion de tous les employés existants dans la base de données
    - Données pour les années 2023, 2024, 2025
*/

-- Insertion des données des employés (exemple avec quelques employés)
-- Note: Les vraies données seront insérées via l'application

INSERT INTO employees (
  noms, sexe, nationalite, date_naissance, date_embauche, date_fin_contrat,
  annee_naissance, annee_embauche, age, anciennete, tranche_age, tranche_anciennete,
  poste, personne_contacter, affectation, salaire, year
) VALUES
-- Employés 2023
('MARTIN Jean', 'M', 'Française', '1980-05-15', '2010-03-01', NULL, 1980, 2010, 43, 13, '41 - 45', '11 - 15', 'Directeur Général', 'Marie MARTIN', 'Direction', '85000', 2023),
('DUBOIS Marie', 'F', 'Française', '1985-08-22', '2015-06-15', NULL, 1985, 2015, 38, 8, '36 - 40', '6 - 10', 'Responsable RH', 'Pierre DUBOIS', 'Administration', '55000', 2023),
('BERNARD Paul', 'M', 'Française', '1975-12-10', '2005-01-20', NULL, 1975, 2005, 48, 18, '46 - 50', '16 - 20', 'Chauffeur Senior', 'Anne BERNARD', 'Transport', '35000', 2023),
('PETIT Sophie', 'F', 'Belge', '1990-03-08', '2020-09-01', '2024-08-31', 1990, 2020, 33, 3, '31 - 35', '0 - 5', 'Assistante Administrative', 'Luc PETIT', 'Administration', '32000', 2023),
('MOREAU Antoine', 'M', 'Française', '1982-07-14', '2012-04-10', NULL, 1982, 2012, 41, 11, '41 - 45', '11 - 15', 'Responsable Logistique', 'Claire MOREAU', 'Logistique', '48000', 2023),

-- Employés 2024 (avec évolutions)
('MARTIN Jean', 'M', 'Française', '1980-05-15', '2010-03-01', NULL, 1980, 2010, 44, 14, '41 - 45', '11 - 15', 'Directeur Général', 'Marie MARTIN', 'Direction', '87000', 2024),
('DUBOIS Marie', 'F', 'Française', '1985-08-22', '2015-06-15', NULL, 1985, 2015, 39, 9, '36 - 40', '6 - 10', 'Responsable RH', 'Pierre DUBOIS', 'Administration', '57000', 2024),
('BERNARD Paul', 'M', 'Française', '1975-12-10', '2005-01-20', NULL, 1975, 2005, 49, 19, '46 - 50', '16 - 20', 'Chauffeur Senior', 'Anne BERNARD', 'Transport', '36000', 2024),
('MOREAU Antoine', 'M', 'Française', '1982-07-14', '2012-04-10', NULL, 1982, 2012, 42, 12, '41 - 45', '11 - 15', 'Responsable Logistique', 'Claire MOREAU', 'Logistique', '50000', 2024),
('GARCIA Carlos', 'M', 'Espagnole', '1988-11-25', '2024-02-01', NULL, 1988, 2024, 36, 0, '36 - 40', '0 - 5', 'Chauffeur', 'Maria GARCIA', 'Transport', '30000', 2024),

-- Employés 2025 (avec nouvelles embauches)
('MARTIN Jean', 'M', 'Française', '1980-05-15', '2010-03-01', NULL, 1980, 2010, 45, 15, '41 - 45', '11 - 15', 'Directeur Général', 'Marie MARTIN', 'Direction', '89000', 2025),
('DUBOIS Marie', 'F', 'Française', '1985-08-22', '2015-06-15', NULL, 1985, 2015, 40, 10, '36 - 40', '6 - 10', 'Responsable RH', 'Pierre DUBOIS', 'Administration', '59000', 2025),
('BERNARD Paul', 'M', 'Française', '1975-12-10', '2005-01-20', NULL, 1975, 2005, 50, 20, '46 - 50', '21+', 'Chauffeur Senior', 'Anne BERNARD', 'Transport', '37000', 2025),
('MOREAU Antoine', 'M', 'Française', '1982-07-14', '2012-04-10', NULL, 1982, 2012, 43, 13, '41 - 45', '11 - 15', 'Responsable Logistique', 'Claire MOREAU', 'Logistique', '52000', 2025),
('GARCIA Carlos', 'M', 'Espagnole', '1988-11-25', '2024-02-01', NULL, 1988, 2024, 37, 1, '36 - 40', '0 - 5', 'Chauffeur', 'Maria GARCIA', 'Transport', '31000', 2025),
('LAURENT Emma', 'F', 'Française', '1992-04-18', '2025-01-15', NULL, 1992, 2025, 33, 0, '31 - 35', '0 - 5', 'Assistante Logistique', 'Thomas LAURENT', 'Logistique', '28000', 2025);