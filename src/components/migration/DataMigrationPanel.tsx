import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useSupabaseAppContext } from '../../context/SupabaseAppContext';
import { Database, Upload, CheckCircle, AlertTriangle, Loader, Truck } from 'lucide-react';

const DataMigrationPanel: React.FC = () => {
  const { employees: localEmployees } = useAppContext();
  const { migrateData, employees: supabaseEmployees } = useSupabaseAppContext();
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [migrationResult, setMigrationResult] = useState<{ message: string; migrated: number } | null>(null);

  const handleMigration = async () => {
    if (localEmployees.length === 0) {
      setMigrationStatus('error');
      setMigrationResult({ message: 'Aucune donnée locale à migrer', migrated: 0 });
      return;
    }

    setMigrationStatus('migrating');
    
    try {
      const result = await migrateData(localEmployees);
      
      if (result.success) {
        setMigrationStatus('success');
        setMigrationResult({ message: result.message, migrated: result.migrated });
      } else {
        setMigrationStatus('error');
        setMigrationResult({ message: result.message, migrated: result.migrated });
      }
    } catch (error) {
      setMigrationStatus('error');
      setMigrationResult({ 
        message: 'Erreur inattendue lors de la migration', 
        migrated: 0 
      });
    }
  };

  const resetMigration = () => {
    setMigrationStatus('idle');
    setMigrationResult(null);
  };

  return (
    <div className="card bg-base-100 shadow-xl border-2 border-primary/20">
      <div className="card-header bg-gradient-to-r from-primary to-secondary text-primary-content p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-full">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">JUTRANS SARL - Migration Supabase</h2>
            <p className="opacity-90">Migration des données employés vers Supabase</p>
          </div>
        </div>
      </div>

      <div className="card-body p-6">
        {/* Statut actuel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="stat bg-base-200 rounded-lg p-4">
            <div className="stat-figure text-primary">
              <Database className="w-8 h-8" />
            </div>
            <div className="stat-title">Données locales</div>
            <div className="stat-value text-primary">{localEmployees.length}</div>
            <div className="stat-desc">Employés en mémoire</div>
          </div>

          <div className="stat bg-base-200 rounded-lg p-4">
            <div className="stat-figure text-secondary">
              <Upload className="w-8 h-8" />
            </div>
            <div className="stat-title">Données Supabase</div>
            <div className="stat-value text-secondary">{supabaseEmployees.length}</div>
            <div className="stat-desc">Employés en base</div>
          </div>
        </div>

        {/* Interface de migration */}
        {migrationStatus === 'idle' && (
          <div className="text-center space-y-4">
            <div className="alert alert-info">
              <Database className="w-5 h-5" />
              <div>
                <h3 className="font-bold">Migration des données JUTRANS</h3>
                <div className="text-sm">
                  Cette opération va transférer {localEmployees.length} employés vers Supabase.
                  {supabaseEmployees.length > 0 && (
                    <div className="text-warning mt-1">
                      ⚠️ Attention: {supabaseEmployees.length} employés existent déjà dans Supabase
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={handleMigration}
              className="btn btn-primary btn-lg gap-2"
              disabled={localEmployees.length === 0}
            >
              <Upload className="w-5 h-5" />
              Migrer vers Supabase
            </button>
          </div>
        )}

        {migrationStatus === 'migrating' && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader className="w-12 h-12 animate-spin text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Migration en cours...</h3>
            <p className="text-base-content/70">
              Transfert des données vers Supabase. Veuillez patienter.
            </p>
            <progress className="progress progress-primary w-full"></progress>
          </div>
        )}

        {migrationStatus === 'success' && migrationResult && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="w-12 h-12 text-success" />
            </div>
            <div className="alert alert-success">
              <CheckCircle className="w-5 h-5" />
              <div>
                <h3 className="font-bold">Migration réussie !</h3>
                <div className="text-sm">{migrationResult.message}</div>
              </div>
            </div>
            <div className="stats stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Employés migrés</div>
                <div className="stat-value text-success">{migrationResult.migrated}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Total en base</div>
                <div className="stat-value text-primary">{supabaseEmployees.length}</div>
              </div>
            </div>
            <button
              onClick={resetMigration}
              className="btn btn-outline"
            >
              Fermer
            </button>
          </div>
        )}

        {migrationStatus === 'error' && migrationResult && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AlertTriangle className="w-12 h-12 text-error" />
            </div>
            <div className="alert alert-error">
              <AlertTriangle className="w-5 h-5" />
              <div>
                <h3 className="font-bold">Erreur de migration</h3>
                <div className="text-sm">{migrationResult.message}</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetMigration}
                className="btn btn-outline"
              >
                Fermer
              </button>
              <button
                onClick={handleMigration}
                className="btn btn-error"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-base-200 rounded-lg">
          <h4 className="font-semibold mb-2">Instructions:</h4>
          <ul className="text-sm space-y-1 text-base-content/80">
            <li>• Assurez-vous d'avoir configuré Supabase correctement</li>
            <li>• La migration créera une copie de toutes les données locales</li>
            <li>• Les données existantes en base ne seront pas écrasées</li>
            <li>• Cette opération peut prendre quelques minutes selon le volume</li>
            <li>• Une fois migrées, les données seront synchronisées avec Supabase</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DataMigrationPanel;