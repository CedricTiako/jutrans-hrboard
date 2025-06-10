import { supabase, SupabaseEmployee } from '../lib/supabase';
import { Employee, EmployeeFormData, EmployeeValidationErrors } from '../types/hr';

/**
 * 🎯 SERVICE SUPABASE POUR LA GESTION DES EMPLOYÉS JUTRANS
 */
export class SupabaseEmployeeService {
  
  /**
   * ✅ CONVERTIR EMPLOYEE VERS SUPABASE FORMAT
   */
  private static toSupabaseFormat(employee: Employee): Omit<SupabaseEmployee, 'id' | 'created_at' | 'updated_at'> {
    return {
      noms: employee.NOMS,
      sexe: employee.SEXE,
      nationalite: employee.NATIONALITE,
      date_naissance: employee.DATE_NAISSANCE,
      date_embauche: employee.DATE_EMBAUCHE,
      date_fin_contrat: employee.DATE_FIN_CONTRAT,
      annee_naissance: employee.ANNEE_NAISSANCE,
      annee_embauche: employee.ANNEE_EMBAUCHE,
      age: employee.AGE,
      anciennete: employee.ANCIENNETE,
      tranche_age: employee.TRANCHE_AGE,
      tranche_anciennete: employee.TRANCHE_ANCIENNETE,
      poste: employee.POSTE,
      personne_contacter: employee.PERSONNE_CONTACTER,
      affectation: employee.AFFECTATION,
      salaire: employee.SALAIRE,
      year: employee.YEAR
    };
  }

  /**
   * ✅ CONVERTIR SUPABASE FORMAT VERS EMPLOYEE
   */
  private static fromSupabaseFormat(supabaseEmployee: SupabaseEmployee): Employee {
    return {
      ID:supabaseEmployee.id, // Convertir UUID en nombre
      NOMS: supabaseEmployee.noms,
      SEXE: supabaseEmployee.sexe,
      NATIONALITE: supabaseEmployee.nationalite,
      DATE_NAISSANCE: supabaseEmployee.date_naissance,
      DATE_EMBAUCHE: supabaseEmployee.date_embauche,
      DATE_FIN_CONTRAT: supabaseEmployee.date_fin_contrat,
      ANNEE_NAISSANCE: supabaseEmployee.annee_naissance,
      ANNEE_EMBAUCHE: supabaseEmployee.annee_embauche,
      AGE: supabaseEmployee.age,
      ANCIENNETE: supabaseEmployee.anciennete,
      TRANCHE_AGE: supabaseEmployee.tranche_age,
      TRANCHE_ANCIENNETE: supabaseEmployee.tranche_anciennete,
      POSTE: supabaseEmployee.poste,
      PERSONNE_CONTACTER: supabaseEmployee.personne_contacter,
      AFFECTATION: supabaseEmployee.affectation,
      SALAIRE: supabaseEmployee.salaire,
      YEAR: supabaseEmployee.year
    };
  }

  /**
   * ✅ RÉCUPÉRER TOUS LES EMPLOYÉS
   */
  static async getAllEmployees(year?: number): Promise<Employee[]> {
    try {
      let query = supabase
        .from('employees')
        .select('*')
        .order('noms', { ascending: true });

      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur Supabase:', error);
        throw new Error(`Erreur lors de la récupération des employés: ${error.message}`);
      }

      return data ? data.map(emp => this.fromSupabaseFormat(emp)) : [];
    } catch (error) {
      console.error('Erreur getAllEmployees:', error);
      throw error;
    }
  }

  /**
   * ✅ RÉCUPÉRER UN EMPLOYÉ PAR ID
   */
  static async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Employé non trouvé
        }
        throw new Error(`Erreur lors de la récupération de l'employé: ${error.message}`);
      }

      return data ? this.fromSupabaseFormat(data) : null;
    } catch (error) {
      console.error('Erreur getEmployeeById:', error);
      throw error;
    }
  }

  /**
   * ✅ CRÉER UN NOUVEL EMPLOYÉ POUR TOUTES LES ANNÉES JUSQU'À MAINTENANT
   */
  static async createEmployee(formData: EmployeeFormData, year: number): Promise<{ success: boolean; employee?: Employee; errors?: EmployeeValidationErrors }> {
    try {
      // Validation
      const errors = this.validateEmployeeData(formData);
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      // Calcul des champs dérivés
      const birthDate = new Date(formData.DATE_NAISSANCE);
      const hireDate = new Date(formData.DATE_EMBAUCHE);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const hireYear = hireDate.getFullYear();

      // Vérifier si l'année d'embauche est dans le futur
      if (hireYear > currentYear) {
        return { success: false, errors: { DATE_EMBAUCHE: 'La date d\'embauche ne peut pas être dans le futur' } };
      }

      // Préparer les données pour chaque année
      const employeeDataList = [];
      
      for (let yearToAdd = hireYear; yearToAdd <= currentYear; yearToAdd++) {
        const age = yearToAdd - birthDate.getFullYear();
        const anciennete = yearToAdd - hireYear;
        
        // Ne pas créer d'entrée si l'employé n'était pas encore embauché ou si l'âge est invalide
        if (age < 16 || age > 80) continue;
        
        const employeeData = {
          noms: formData.NOMS.trim(),
          sexe: formData.SEXE,
          nationalite: formData.NATIONALITE.trim(),
          date_naissance: formData.DATE_NAISSANCE,
          date_embauche: formData.DATE_EMBAUCHE,
          date_fin_contrat: formData.DATE_FIN_CONTRAT || null,
          annee_naissance: birthDate.getFullYear(),
          annee_embauche: hireYear,
          age: age,
          anciennete: anciennete,
          tranche_age: this.calculateAgeGroup(age),
          tranche_anciennete: this.calculateTenureGroup(anciennete),
          poste: formData.POSTE.trim(),
          personne_contacter: formData.PERSONNE_CONTACTER.trim(),
          affectation: formData.AFFECTATION.trim(),
          salaire: formData.SALAIRE.trim(),
          year: yearToAdd
        };
        
        employeeDataList.push(employeeData);
      }

      if (employeeDataList.length === 0) {
        return { success: false, errors: { NOMS: 'Aucune année valide pour créer l\'employé' } };
      }

      // Insérer toutes les entrées en une seule requête
      const { data, error } = await supabase
        .from('employees')
        .insert(employeeDataList)
        .select()
        .order('year', { ascending: true });

      if (error) {
        console.error('Erreur Supabase création:', error);
        return { success: false, errors: { NOMS: `Erreur lors de la création: ${error.message}` } };
      }

      // Retourner l'entrée de l'année demandée ou la dernière créée
      const employeeForRequestedYear = data.find(emp => emp.year === year) || data[data.length - 1];
      return { success: true, employee: this.fromSupabaseFormat(employeeForRequestedYear) };
    } catch (error) {
      console.error('Erreur createEmployee:', error);
      return { success: false, errors: { NOMS: 'Erreur lors de la création de l\'employé' } };
    }
  }

  /**
   * ✅ METTRE À JOUR UN EMPLOYÉ
   */
  static async updateEmployee(id: string, formData: EmployeeFormData): Promise<{ success: boolean; employee?: Employee; errors?: EmployeeValidationErrors }> {
    try {
      // Validation
      const errors = this.validateEmployeeData(formData);
      if (Object.keys(errors).length > 0) {
        return { success: false, errors };
      }

      // Calcul des champs dérivés
      const birthDate = new Date(formData.DATE_NAISSANCE);
      const hireDate = new Date(formData.DATE_EMBAUCHE);
      const currentDate = new Date();

      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const anciennete = currentDate.getFullYear() - hireDate.getFullYear();

      // Préparation des données pour Supabase
      const employeeData = {
        noms: formData.NOMS.trim(),
        sexe: formData.SEXE,
        nationalite: formData.NATIONALITE.trim(),
        date_naissance: formData.DATE_NAISSANCE,
        date_embauche: formData.DATE_EMBAUCHE,
        date_fin_contrat: formData.DATE_FIN_CONTRAT || null,
        annee_naissance: birthDate.getFullYear(),
        annee_embauche: hireDate.getFullYear(),
        age: age,
        anciennete: anciennete,
        tranche_age: this.calculateAgeGroup(age),
        tranche_anciennete: this.calculateTenureGroup(anciennete),
        poste: formData.POSTE.trim(),
        personne_contacter: formData.PERSONNE_CONTACTER.trim(),
        affectation: formData.AFFECTATION.trim(),
        salaire: formData.SALAIRE.trim(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erreur Supabase mise à jour:', error);
        return { success: false, errors: { NOMS: `Erreur lors de la mise à jour: ${error.message}` } };
      }

      return { success: true, employee: this.fromSupabaseFormat(data) };
    } catch (error) {
      console.error('Erreur updateEmployee:', error);
      return { success: false, errors: { NOMS: 'Erreur lors de la mise à jour de l\'employé' } };
    }
  }

  /**
   * ✅ SUPPRIMER UN EMPLOYÉ
   */
  static async deleteEmployee(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur Supabase suppression:', error);
        return { success: false, message: `Erreur lors de la suppression: ${error.message}` };
      }

      return { success: true, message: 'Employé supprimé avec succès' };
    } catch (error) {
      console.error('Erreur deleteEmployee:', error);
      return { success: false, message: 'Erreur lors de la suppression de l\'employé' };
    }
  }

  /**
   * ✅ RECHERCHE D'EMPLOYÉS
   */
  static async searchEmployees(query: string, year?: number): Promise<Employee[]> {
    try {
      let supabaseQuery = supabase
        .from('employees')
        .select('*');

      if (year) {
        supabaseQuery = supabaseQuery.eq('year', year);
      }

      if (query.trim()) {
        const searchTerm = `%${query.toLowerCase()}%`;
        supabaseQuery = supabaseQuery.or(
          `noms.ilike.${searchTerm},poste.ilike.${searchTerm},nationalite.ilike.${searchTerm},affectation.ilike.${searchTerm}`
        );
      }

      const { data, error } = await supabaseQuery.order('noms', { ascending: true });

      if (error) {
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }

      return data ? data.map(emp => this.fromSupabaseFormat(emp)) : [];
    } catch (error) {
      console.error('Erreur searchEmployees:', error);
      throw error;
    }
  }

  /**
   * ✅ STATISTIQUES DES CONTRATS
   */
  static async getContractStats(year?: number): Promise<{
    total: number;
    permanent: number;
    temporary: number;
    expired: number;
    expiringSoon: number;
  }> {
    try {
      let query = supabase.from('employees').select('date_fin_contrat');
      
      if (year) {
        query = query.eq('year', year);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Erreur lors du calcul des statistiques: ${error.message}`);
      }

      const currentDate = new Date();
      const futureDate = new Date();
      futureDate.setDate(currentDate.getDate() + 30);

      const total = data?.length || 0;
      const permanent = data?.filter(emp => !emp.date_fin_contrat).length || 0;
      const temporary = data?.filter(emp => emp.date_fin_contrat).length || 0;
      const expired = data?.filter(emp => 
        emp.date_fin_contrat && new Date(emp.date_fin_contrat) < currentDate
      ).length || 0;
      const expiringSoon = data?.filter(emp => 
        emp.date_fin_contrat && 
        new Date(emp.date_fin_contrat) >= currentDate && 
        new Date(emp.date_fin_contrat) <= futureDate
      ).length || 0;

      return {
        total,
        permanent,
        temporary,
        expired,
        expiringSoon
      };
    } catch (error) {
      console.error('Erreur getContractStats:', error);
      throw error;
    }
  }

  /**
   * ✅ MIGRATION DES DONNÉES EXISTANTES
   */
  static async migrateExistingData(employees: Employee[]): Promise<{ success: boolean; message: string; migrated: number }> {
    try {
      console.log(`Début de la migration de ${employees.length} employés...`);
      
      // Vérifier si des données existent déjà
      const { data: existingData, error: checkError } = await supabase
        .from('employees')
        .select('id')
        .limit(1);

      if (checkError) {
        throw new Error(`Erreur lors de la vérification: ${checkError.message}`);
      }

      if (existingData && existingData.length > 0) {
        return { 
          success: false, 
          message: 'Des données existent déjà dans Supabase. Migration annulée pour éviter les doublons.', 
          migrated: 0 
        };
      }

      // Préparer les données pour l'insertion
      const employeesData = employees.map(emp => this.toSupabaseFormat(emp));

      // Insérer par lots de 100 pour éviter les timeouts
      const batchSize = 100;
      let migrated = 0;

      for (let i = 0; i < employeesData.length; i += batchSize) {
        const batch = employeesData.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('employees')
          .insert(batch);

        if (error) {
          console.error(`Erreur lors de l'insertion du lot ${i / batchSize + 1}:`, error);
          throw new Error(`Erreur lors de la migration: ${error.message}`);
        }

        migrated += batch.length;
        console.log(`Migré ${migrated}/${employees.length} employés...`);
      }

      return { 
        success: true, 
        message: `Migration réussie: ${migrated} employés migrés vers Supabase`, 
        migrated 
      };
    } catch (error) {
      console.error('Erreur migration:', error);
      return { 
        success: false, 
        message: `Erreur lors de la migration: ${error.message}`, 
        migrated: 0 
      };
    }
  }

  /**
   * ✅ VALIDATION DES DONNÉES EMPLOYÉ
   */
  private static validateEmployeeData(data: EmployeeFormData): EmployeeValidationErrors {
    const errors: EmployeeValidationErrors = {};

    // Validation du nom
    if (!data.NOMS || data.NOMS.trim().length < 2) {
      errors.NOMS = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation de la nationalité
    if (!data.NATIONALITE || data.NATIONALITE.trim().length < 2) {
      errors.NATIONALITE = 'La nationalité est requise';
    }

    // Validation des dates
    const birthDate = new Date(data.DATE_NAISSANCE);
    const hireDate = new Date(data.DATE_EMBAUCHE);
    const currentDate = new Date();

    if (!data.DATE_NAISSANCE || isNaN(birthDate.getTime())) {
      errors.DATE_NAISSANCE = 'Date de naissance invalide';
    } else {
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      if (age < 16 || age > 80) {
        errors.DATE_NAISSANCE = 'L\'âge doit être entre 16 et 80 ans';
      }
    }

    if (!data.DATE_EMBAUCHE || isNaN(hireDate.getTime())) {
      errors.DATE_EMBAUCHE = 'Date d\'embauche invalide';
    } else if (hireDate > currentDate) {
      errors.DATE_EMBAUCHE = 'La date d\'embauche ne peut pas être dans le futur';
    } else if (birthDate && hireDate < birthDate) {
      errors.DATE_EMBAUCHE = 'La date d\'embauche ne peut pas être antérieure à la naissance';
    }

    // Validation de la date de fin de contrat
    if (data.DATE_FIN_CONTRAT) {
      const endDate = new Date(data.DATE_FIN_CONTRAT);
      if (isNaN(endDate.getTime())) {
        errors.DATE_FIN_CONTRAT = 'Date de fin de contrat invalide';
      } else if (endDate <= hireDate) {
        errors.DATE_FIN_CONTRAT = 'La date de fin doit être postérieure à la date d\'embauche';
      }
    }

    // Validation du poste
    if (!data.POSTE || data.POSTE.trim().length < 2) {
      errors.POSTE = 'Le poste est requis';
    }

    // Validation du salaire
    if (!data.SALAIRE || data.SALAIRE.trim().length === 0) {
      errors.SALAIRE = 'Le salaire est requis';
    } else {
      const salary = parseFloat(data.SALAIRE);
      if (isNaN(salary) || salary < 0) {
        errors.SALAIRE = 'Le salaire doit être un nombre positif';
      }
    }

    return errors;
  }

  /**
   * ✅ CALCUL DE LA TRANCHE D'ÂGE
   */
  private static calculateAgeGroup(age: number): string {
    if (age <= 30) return '21 - 30';
    if (age <= 35) return '31 - 35';
    if (age <= 40) return '36 - 40';
    if (age <= 45) return '41 - 45';
    if (age <= 50) return '46 - 50';
    if (age <= 55) return '51 - 55';
    if (age <= 60) return '56 - 60';
    return '> 60';
  }

  /**
   * ✅ CALCUL DE LA TRANCHE D'ANCIENNETÉ
   */
  private static calculateTenureGroup(tenure: number): string {
    if (tenure <= 5) return '0 - 5';
    if (tenure <= 10) return '6 - 10';
    if (tenure <= 15) return '11 - 15';
    if (tenure <= 20) return '16 - 20';
    return '21+';
  }
}