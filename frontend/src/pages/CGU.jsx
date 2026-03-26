import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '../components/ui/button';

const CGU = () => {
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
          Conditions Générales d'Utilisation
        </h1>

        <p className="text-gray-600 mb-8">
          Dernière mise à jour : <strong>[À REMPLIR - Date]</strong>
        </p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Objet</h2>
            <p>
              Les présentes CGU régissent l'utilisation du site ShareMatos et de la liste d'attente de préinscription. En vous inscrivant, vous acceptez ces conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Inscription à la liste d'attente</h2>
            <p>
              L'inscription à la liste d'attente est gratuite. Les données collectées (prénom, email, ville, type d'utilisation) sont utilisées uniquement pour vous contacter lors du lancement du service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Données personnelles</h2>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Consultez notre{' '}
              <Link to="/politique-confidentialite" className="text-emerald-600 hover:underline">Politique de confidentialité</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Limitation de responsabilité</h2>
            <p>
              ShareMatos s'efforce de maintenir le site accessible. En phase de pré-lancement, le service n'est pas encore opérationnel. L'inscription à la liste d'attente ne garantit pas l'accès prioritaire au service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Droit applicable</h2>
            <p>
              Les présentes CGU sont régies par le droit français. Tout litige sera soumis aux tribunaux compétents.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Contact</h2>
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

export default CGU;
