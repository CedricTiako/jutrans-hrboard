import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Employee, EmployeeFormData, EmployeeValidationErrors } from '../../types/hr';
import { SupabaseEmployeeService } from '../../services/supabaseEmployeeService';
import { X, Save, User, Calendar, Briefcase, MapPin, DollarSign, AlertTriangle, CheckCircle, Truck, Database } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  year: number;
  onSave: (employee: Employee) => void;
  mode: 'create' | 'edit' | 'view';
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employee,
  year,
  onSave,
  mode
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EmployeeFormData>({
    NOMS: '',
    SEXE: 'M',
    NATIONALITE: '',
    DATE_NAISSANCE: '',
    DATE_EMBAUCHE: '',
    DATE_FIN_CONTRAT: null,
    POSTE: '',
    PERSONNE_CONTACTER: '',
    AFFECTATION: '',
    SALAIRE: ''
  });

  const [errors, setErrors] = useState<EmployeeValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Initialiser le formulaire avec les données de l'employé
  useEffect(() => {
    if (employee && (mode === 'edit' || mode === 'view')) {
      setFormData({
        NOMS: employee.NOMS,
        SEXE: employee.SEXE,
        NATIONALITE: employee.NATIONALITE,
        DATE_NAISSANCE: employee.DATE_NAISSANCE,
        DATE_EMBAUCHE: employee.DATE_EMBAUCHE,
        DATE_FIN_CONTRAT: employee.DATE_FIN_CONTRAT,
        POSTE: employee.POSTE,
        PERSONNE_CONTACTER: employee.PERSONNE_CONTACTER,
        AFFECTATION: employee.AFFECTATION,
        SALAIRE: employee.SALAIRE
      });
    } else if (mode === 'create') {
      setFormData({
        NOMS: '',
        SEXE: 'M',
        NATIONALITE: '',
        DATE_NAISSANCE: '',
        DATE_EMBAUCHE: '',
        DATE_FIN_CONTRAT: null,
        POSTE: '',
        PERSONNE_CONTACTER: '',
        AFFECTATION: '',
        SALAIRE: ''
      });
    }
    setErrors({});
    setSubmitSuccess(false);
  }, [employee, mode, isOpen]);

  const handleInputChange = (field: keyof EmployeeFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setIsSubmitting(true);
    setErrors({});

    try {
      let result;
      
      if (mode === 'create') {
        result = await SupabaseEmployeeService.createEmployee(formData, year);
      } else {
        // Convertir l'ID numérique en UUID pour Supabase
        const id = employee!.ID.toString();
        result = await SupabaseEmployeeService.updateEmployee(id, formData);
      }

      if (result.success && result.employee) {
        setSubmitSuccess(true);
        onSave(result.employee);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setErrors({ NOMS: 'Erreur lors de la sauvegarde' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isContractExpired = employee && employee.DATE_FIN_CONTRAT && new Date(employee.DATE_FIN_CONTRAT) < new Date();

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {mode === 'create' ? t('employees.crud.newEmployee') : 
                 mode === 'edit' ? t('employees.crud.editEmployee') : t('employees.crud.viewEmployee')}
              </h3>
              <p className="text-sm text-base-content/70">JUTRANS SARL - Gestion RH Supabase</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isContractExpired && (
              <div className="badge badge-error gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t('contracts.expired')}
              </div>
            )}
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message de succès */}
        {submitSuccess && (
          <div className="alert alert-success mb-4">
            <CheckCircle className="w-5 h-5" />
            <span>
              {mode === 'create' ? t('employees.crud.createSuccess') : t('employees.crud.updateSuccess')}
            </span>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations personnelles */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('employees.form.personalInfo')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.fullName')} *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.NOMS}
                    onChange={(e) => handleInputChange('NOMS', e.target.value)}
                    className={`input input-bordered ${errors.NOMS ? 'input-error' : ''}`}
                    placeholder={t('employees.form.fullName')}
                    disabled={mode === 'view'}
                    required
                  />
                  {errors.NOMS && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.NOMS}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.gender')} *</span>
                  </label>
                  <select
                    value={formData.SEXE}
                    onChange={(e) => handleInputChange('SEXE', e.target.value)}
                    className={`select select-bordered ${errors.SEXE ? 'select-error' : ''}`}
                    disabled={mode === 'view'}
                    required
                  >
                    <option value="M">{t('gender.male')}</option>
                    <option value="F">{t('gender.female')}</option>
                  </select>
                  {errors.SEXE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.SEXE}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.nationality')} *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.NATIONALITE}
                    onChange={(e) => handleInputChange('NATIONALITE', e.target.value)}
                    className={`input input-bordered ${errors.NATIONALITE ? 'input-error' : ''}`}
                    placeholder={t('employees.form.nationality')}
                    disabled={mode === 'view'}
                    required
                  />
                  {errors.NATIONALITE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.NATIONALITE}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.birthDate')} *</span>
                  </label>
                  <input
                    type="date"
                    value={formData.DATE_NAISSANCE}
                    onChange={(e) => handleInputChange('DATE_NAISSANCE', e.target.value)}
                    className={`input input-bordered ${errors.DATE_NAISSANCE ? 'input-error' : ''}`}
                    disabled={mode === 'view'}
                    required
                  />
                  {errors.DATE_NAISSANCE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.DATE_NAISSANCE}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations contractuelles */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('employees.form.contractInfo')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.hireDate')} *</span>
                  </label>
                  <input
                    type="date"
                    value={formData.DATE_EMBAUCHE}
                    onChange={(e) => handleInputChange('DATE_EMBAUCHE', e.target.value)}
                    className={`input input-bordered ${errors.DATE_EMBAUCHE ? 'input-error' : ''}`}
                    disabled={mode === 'view'}
                    required
                  />
                  {errors.DATE_EMBAUCHE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.DATE_EMBAUCHE}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.endDate')}</span>
                    <span className="label-text-alt">{t('employees.form.endDateOptional')}</span>
                  </label>
                  <input
                    type="date"
                    value={formData.DATE_FIN_CONTRAT || ''}
                    onChange={(e) => handleInputChange('DATE_FIN_CONTRAT', e.target.value || null)}
                    className={`input input-bordered ${errors.DATE_FIN_CONTRAT ? 'input-error' : ''} ${
                      formData.DATE_FIN_CONTRAT && new Date(formData.DATE_FIN_CONTRAT) < new Date() ? 'input-error' : ''
                    }`}
                    disabled={mode === 'view'}
                  />
                  {errors.DATE_FIN_CONTRAT && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.DATE_FIN_CONTRAT}</span>
                    </label>
                  )}
                  {formData.DATE_FIN_CONTRAT && new Date(formData.DATE_FIN_CONTRAT) < new Date() && (
                    <label className="label">
                      <span className="label-text-alt text-error">⚠️ {t('contracts.expired')}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.salary')} *</span>
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      value={formData.SALAIRE}
                      onChange={(e) => handleInputChange('SALAIRE', e.target.value)}
                      className={`input input-bordered flex-1 ${errors.SALAIRE ? 'input-error' : ''}`}
                      placeholder={t('employees.form.salary')}
                      disabled={mode === 'view'}
                      min="0"
                      required
                    />
                    <span className="bg-base-200 px-3 flex items-center text-sm">€</span>
                  </div>
                  {errors.SALAIRE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.SALAIRE}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.contractType')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`badge ${formData.DATE_FIN_CONTRAT ? 'badge-warning' : 'badge-success'}`}>
                      {formData.DATE_FIN_CONTRAT ? t('contracts.temporary') : t('contracts.permanent')}
                    </div>
                    {formData.DATE_FIN_CONTRAT && new Date(formData.DATE_FIN_CONTRAT) < new Date() && (
                      <div className="badge badge-error gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {t('contracts.expired')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {t('employees.form.professionalInfo')}
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.position')} *</span>
                  </label>
                  <input
                    type="text"
                    value={formData.POSTE}
                    onChange={(e) => handleInputChange('POSTE', e.target.value)}
                    className={`input input-bordered ${errors.POSTE ? 'input-error' : ''}`}
                    placeholder={t('employees.form.position')}
                    disabled={mode === 'view'}
                    required
                  />
                  {errors.POSTE && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.POSTE}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.affectation')}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.AFFECTATION}
                    onChange={(e) => handleInputChange('AFFECTATION', e.target.value)}
                    className={`input input-bordered ${errors.AFFECTATION ? 'input-error' : ''}`}
                    placeholder={t('employees.form.affectation')}
                    disabled={mode === 'view'}
                  />
                  {errors.AFFECTATION && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.AFFECTATION}</span>
                    </label>
                  )}
                </div>

                <div className="form-control md:col-span-2">
                  <label className="label">
                    <span className="label-text font-medium">{t('employees.form.contactPerson')}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.PERSONNE_CONTACTER}
                    onChange={(e) => handleInputChange('PERSONNE_CONTACTER', e.target.value)}
                    className={`input input-bordered ${errors.PERSONNE_CONTACTER ? 'input-error' : ''}`}
                    placeholder={t('employees.form.contactPerson')}
                    disabled={mode === 'view'}
                  />
                  {errors.PERSONNE_CONTACTER && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.PERSONNE_CONTACTER}</span>
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations calculées (mode view/edit) */}
          {employee && (mode === 'view' || mode === 'edit') && (
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body p-4">
                <h4 className="card-title text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('employees.form.calculatedInfo')}
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">{t('employees.table.age')}</div>
                    <div className="stat-value text-lg">{employee.AGE}</div>
                    <div className="stat-desc text-xs">{t('common.year')}s</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">{t('employees.table.tenure')}</div>
                    <div className="stat-value text-lg">{employee.ANCIENNETE}</div>
                    <div className="stat-desc text-xs">{t('common.year')}s</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">{t('employees.form.ageGroup')}</div>
                    <div className="stat-value text-sm">{employee.TRANCHE_AGE}</div>
                  </div>
                  
                  <div className="stat bg-base-100 rounded-lg p-3">
                    <div className="stat-title text-xs">{t('employees.form.tenureGroup')}</div>
                    <div className="stat-value text-sm">{employee.TRANCHE_ANCIENNETE}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              {mode === 'view' ? t('common.close') : t('common.cancel')}
            </button>
            
            {mode !== 'view' && (
              <button
                type="submit"
                className="btn btn-primary gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {mode === 'create' ? t('common.create') : t('common.save')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;