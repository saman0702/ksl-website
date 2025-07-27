import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Stepper = ({ steps, currentStep, className = '' }) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Étape */}
              <div className="flex flex-col items-center flex-1">
                {/* Cercle de l'étape */}
                <div
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    {
                      'bg-ksl-red border-ksl-red text-white': isActive,
                      'bg-green-500 border-green-500 text-white': isCompleted,
                      'bg-white border-gray-300 text-gray-500 dark:bg-dark-bg-secondary dark:border-gray-600 dark:text-gray-400': !isActive && !isCompleted
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </div>

                {/* Titre et description */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      {
                        'text-ksl-red': isActive,
                        'text-green-600 dark:text-green-400': isCompleted,
                        'text-gray-500 dark:text-gray-400': !isActive && !isCompleted
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-0.5 transition-colors duration-300',
                      {
                        'bg-green-500': stepNumber < currentStep,
                        'bg-ksl-red': stepNumber === currentStep,
                        'bg-gray-300 dark:bg-gray-600': stepNumber > currentStep
                      }
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Version compacte pour mobile
export const StepperCompact = ({ steps, currentStep, className = '' }) => {
  const currentStepData = steps[currentStep - 1];
  
  return (
    <div className={cn('w-full', className)}>
      {/* Barre de progression */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
        <div
          className="bg-ksl-red h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        />
      </div>

      {/* Informations de l'étape actuelle */}
      <div className="text-center">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Étape {currentStep} sur {steps.length}
        </p>
        <p className="text-lg font-semibold text-ksl-red">
          {currentStepData?.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {currentStepData?.description}
        </p>
      </div>
    </div>
  );
};

// Version avec navigation clickable
export const StepperNavigable = ({ 
  steps, 
  currentStep, 
  onStepClick, 
  canNavigateToStep,
  className = '' 
}) => {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          const isLast = index === steps.length - 1;
          const canNavigate = canNavigateToStep ? canNavigateToStep(stepNumber) : true;

          return (
            <React.Fragment key={step.id}>
              {/* Étape */}
              <div className="flex flex-col items-center flex-1">
                {/* Cercle de l'étape */}
                <button
                  onClick={() => canNavigate && onStepClick && onStepClick(stepNumber)}
                  disabled={!canNavigate}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300',
                    {
                      'bg-ksl-red border-ksl-red text-white': isActive,
                      'bg-green-500 border-green-500 text-white': isCompleted,
                      'bg-white border-gray-300 text-gray-500 dark:bg-dark-bg-secondary dark:border-gray-600 dark:text-gray-400': !isActive && !isCompleted,
                      'hover:border-ksl-red hover:bg-ksl-red/10 cursor-pointer': canNavigate && onStepClick && !isActive,
                      'cursor-not-allowed opacity-50': !canNavigate
                    }
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNumber}</span>
                  )}
                </button>

                {/* Titre et description */}
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      {
                        'text-ksl-red': isActive,
                        'text-green-600 dark:text-green-400': isCompleted,
                        'text-gray-500 dark:text-gray-400': !isActive && !isCompleted
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Ligne de connexion */}
              {!isLast && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      'h-0.5 transition-colors duration-300',
                      {
                        'bg-green-500': stepNumber < currentStep,
                        'bg-ksl-red': stepNumber === currentStep,
                        'bg-gray-300 dark:bg-gray-600': stepNumber > currentStep
                      }
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper; 