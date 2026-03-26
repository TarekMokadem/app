import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '../components/ui/button';

const PolitiqueConfidentialite = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              ShareMatos
            </span>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Politique de confidentialité
        </h1>

        <p className="text-gray-600 mb-8">
          Dernière mise à jour : <strong>[À REMPLIR - Date]</strong>
        </p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Responsable du traitement</h2>
            <p>
              <strong>[À REMPLIR]</strong> – Indiquez la raison sociale et les coordonnées du responsable du traitement des données.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Données collectées</h2>
            <p>
              Lors de votre inscription à la liste d'attente, nous collectons : prénom, adresse email, ville et type d'utilisation souhaité (louer / proposer / les deux).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Finalité du traitement</h2>
            <p>
              Ces données sont utilisées uniquement pour vous contacter lors du lancement du service ShareMatos et vous informer des actualités du projet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Base légale</h2>
            <p>
              Le traitement repose sur votre consentement, donné lors de l'inscription au formulaire.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Durée de conservation</h2>
            <p>
              Vos données sont conservées jusqu'à votre demande de suppression ou jusqu'à 3 ans après le dernier contact, conformément aux recommandations de la CNIL.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Vos droits (RGPD)</h2>
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez également vous opposer au traitement ou demander sa limitation. Pour exercer ces droits : <a href="mailto:contact@sharematos.fr" className="text-emerald-600 hover:underline">contact@sharematos.fr</a>. Vous pouvez également introduire une réclamation auprès de la CNIL.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Cookies</h2>
            <p>
              Ce site utilise des cookies techniques nécessaires à son fonctionnement. <strong>[À REMPLIR]</strong> – Si vous ajoutez des cookies analytics (Google Analytics, Plausible), décrivez-les ici.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">8. Contact</h2>
            <p>
              Pour toute question : <a href="mailto:contact@sharematos.fr" className="text-emerald-600 hover:underline">contact@sharematos.fr</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link to="/">
            <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              ← Retour à l'accueil
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default PolitiqueConfidentialite;
