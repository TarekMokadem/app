import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Button } from '../components/ui/button';

const MentionsLegales = () => {
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
          Mentions légales
        </h1>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Éditeur du site</h2>
            <p>
              <strong>[À REMPLIR]</strong> – Indiquez la raison sociale, forme juridique, capital social, siège social et numéro SIRET de votre entreprise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Hébergeur</h2>
            <p>
              <strong>[À REMPLIR]</strong> – Indiquez le nom, l'adresse et les coordonnées de votre hébergeur.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Directeur de la publication</h2>
            <p>
              <strong>[À REMPLIR]</strong> – Indiquez le nom du responsable de la publication.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Contact</h2>
            <p>
              Email : <a href="mailto:contact@sharematos.fr" className="text-emerald-600 hover:underline">contact@sharematos.fr</a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (textes, images, logos, etc.) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.
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

export default MentionsLegales;
