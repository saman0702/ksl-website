import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Plus,
  ArrowRight,
  Home,
  Package,
  Copy
} from 'lucide-react';
import { Button, Modal, Badge } from './ui';
import { cn } from '../utils/cn';

const PaymentRedirect = ({ 
  isOpen, 
  onClose, 
  paymentStatus, 
  expeditionData, 
  onNewExpedition,
  onViewExpeditions,
  onGoToDashboard 
}) => {
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  // Configuration des statuts
  const statusConfig = {
    success: {
      icon: CheckCircle,
      title: '🎉 Paiement réussi !',
      message: 'Votre expédition a été créée avec succès !',
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    pending: {
      icon: Clock,
      title: '⏳ Paiement en cours',
      message: 'Votre paiement est en cours de traitement.',
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    failed: {
      icon: AlertCircle,
      title: '❌ Paiement échoué',
      message: 'Le paiement n\'a pas pu être traité.',
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900/20',
      textColor: 'text-red-600 dark:text-red-400'
    }
  };

  const currentStatus = statusConfig[paymentStatus] || statusConfig.failed;
  const StatusIcon = currentStatus.icon;

  // Compte à rebours automatique
  useEffect(() => {
    if (isOpen && paymentStatus === 'success') {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onGoToDashboard?.();
            return 0; 
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, paymentStatus, onGoToDashboard]);

  const copyTrackingNumber = (trackingNumber) => {
    navigator.clipboard.writeText(trackingNumber);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="max-w-2xl">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className={cn('w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4', currentStatus.bgColor)}>
            <StatusIcon className={cn('w-12 h-12', currentStatus.textColor)} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStatus.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {currentStatus.message}
          </p>
        </div>

        {/* Détails de l'expédition si succès */}
        {paymentStatus === 'success' && expeditionData && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              📦 Détails de votre expédition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">N° Commande:</span>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-mono font-bold">{expeditionData.order_number || `KSL${expeditionData.id}`}</p>
                  <button
                    onClick={() => copyTrackingNumber(expeditionData.order_number || `KSL${expeditionData.id}`)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                <p className="font-bold">{expeditionData.montant ? `${parseFloat(expeditionData.montant).toLocaleString('fr-FR')} FCFA` : 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Compte à rebours */}
        {paymentStatus === 'success' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Redirection automatique dans
            </p>
            <div className="text-3xl font-bold text-blue-600">
              {redirectCountdown} seconde{redirectCountdown > 1 ? 's' : ''}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {paymentStatus === 'success' && (
            <Button
              onClick={onNewExpedition}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle expédition
            </Button>
          )}
          
          <Button
            onClick={onGoToDashboard}
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Accueil
          </Button>
          
          <Button
            onClick={onClose}
            variant="outline"
          >
            Rester ici
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentRedirect;
