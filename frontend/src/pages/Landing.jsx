import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Search, Handshake, Package, Lock, Users, Sprout, DollarSign, Mail, MapPin, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const [formData, setFormData] = useState({
    prenom: '',
    email: '',
    ville: '',
    userType: {
      louer: false,
      proposer: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.prenom || !formData.email || !formData.ville) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    if (!formData.userType.louer && !formData.userType.proposer) {
      toast.error('Veuillez sélectionner au moins une option');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/waitlist`, formData);
      setSubmitted(true);
      toast.success('Merci ! Vous êtes inscrit(e) à la liste d\'attente');
      setFormData({
        prenom: '',
        email: '',
        ville: '',
        userType: { louer: false, proposer: false }
      });
    } catch (error) {
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              ShareMatos
            </span>
          </div>
          <Button 
            variant="outline" 
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
          >
            Rejoindre la liste d'attente
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(16, 185, 129, 0.95), rgba(59, 130, 246, 0.85)), url('https://images.unsplash.com/photo-1767389193137-77d6f9b8b56a')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Louez les outils dont vous avez besoin, près de chez vous.
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
              Perceuse, tondeuse, matériel de bricolage… Gagnez de l'argent ou économisez en partageant entre voisins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-50 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Rejoindre la liste d'attente
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-6 transition-all duration-300"
                onClick={() => document.getElementById('waitlist-form').scrollIntoView({ behavior: 'smooth' })}
              >
                Je veux louer un objet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Comment ça marche ?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Louez un outil en 3 étapes simples
          </p>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Trouvez un outil près de chez vous</h3>
                <p className="text-gray-600 leading-relaxed">
                  Recherchez l'outil dont vous avez besoin parmi des milliers d'offres disponibles dans votre quartier.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Handshake className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Réservez facilement</h3>
                <p className="text-gray-600 leading-relaxed">
                  Contactez le propriétaire et réservez l'outil pour la durée dont vous avez besoin, en toute simplicité.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Récupérez et utilisez</h3>
                <p className="text-gray-600 leading-relaxed">
                  Récupérez votre outil chez votre voisin, utilisez-le et rendez-le. Simple, économique et écologique !
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ShareMatos */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            Pourquoi ShareMatos ?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            Une solution qui profite à tous
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Lock className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Plus économique</h3>
              <p className="text-gray-600">
                Économisez jusqu'à 80% par rapport à l'achat d'outils neufs
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Entre voisins</h3>
              <p className="text-gray-600">
                Créez du lien avec votre communauté locale et entraidez-vous
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Sprout className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Écologique</h3>
              <p className="text-gray-600">
                Réduisez votre empreinte carbone en favorisant le partage
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-6 mb-4 mx-auto w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Gagnez de l'argent</h3>
              <p className="text-gray-600">
                Rentabilisez vos objets inutilisés en les proposant à la location
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form */}
      <section id="waitlist-form" className="py-20 bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Rejoignez l'aventure ShareMatos
            </h2>
            <p className="text-center text-gray-600 text-lg mb-10">
              Inscrivez-vous dès maintenant à notre liste d'attente
            </p>
            
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle2 className="h-20 w-20 text-emerald-600 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Merci !</h3>
                <p className="text-xl text-gray-600">Vous êtes maintenant sur la liste d'attente. Nous vous contacterons très bientôt !</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-2" />
                    Prénom *
                  </label>
                  <Input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Votre prénom"
                    className="h-12 text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-2" />
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="votre.email@exemple.com"
                    className="h-12 text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline h-4 w-4 mr-2" />
                    Ville *
                  </label>
                  <Input
                    type="text"
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    placeholder="Lille"
                    className="h-12 text-base"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Vous êtes : *
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Checkbox
                        id="louer"
                        checked={formData.userType.louer}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, userType: { ...formData.userType, louer: checked } })
                        }
                        className="h-5 w-5"
                      />
                      <label htmlFor="louer" className="text-base cursor-pointer flex-1">
                        Je veux louer
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Checkbox
                        id="proposer"
                        checked={formData.userType.proposer}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, userType: { ...formData.userType, proposer: checked } })
                        }
                        className="h-5 w-5"
                      />
                      <label htmlFor="proposer" className="text-base cursor-pointer flex-1">
                        Je veux proposer mes objets
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Checkbox
                        id="both"
                        checked={formData.userType.louer && formData.userType.proposer}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, userType: { louer: checked, proposer: checked } })
                        }
                        className="h-5 w-5"
                      />
                      <label htmlFor="both" className="text-base cursor-pointer flex-1 font-semibold">
                        Les deux
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={loading}
                >
                  {loading ? 'Inscription en cours...' : 'Je rejoins le projet'}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </Button>
                
                <p className="text-center text-sm text-gray-500 mt-4">
                  🚀 Lancement prochainement à Lille et alentours
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              127+
            </p>
            <p className="text-xl text-gray-600">
              Personnes déjà intéressées par ShareMatos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1576558656222-ba66febe3dec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHw0fHxwb3J0cmFpdCUyMGhlYWRzaG90fGVufDB8fHx8MTc3MTM0MTQxM3ww&ixlib=rb-4.1.0&q=85"
                  alt="Marc"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Marc D.</h4>
                  <p className="text-sm text-gray-600">Propriétaire, Lille</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "Mes outils dormaient au garage. Maintenant, je gagne 150€ par mois en les prêtant à mes voisins. Une super idée !"
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1589729482945-ca6f3a235f7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGhlYWRzaG90fGVufDB8fHx8MTc3MTM0MTQxM3ww&ixlib=rb-4.1.0&q=85"
                  alt="Sophie"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Sophie L.</h4>
                  <p className="text-sm text-gray-600">Locataire, Roubaix</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                "J'avais besoin d'une perceuse pour un week-end. Au lieu de dépenser 100€, j'ai payé 10€. Pratique et économique !"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="h-8 w-8 text-emerald-400" />
                <span className="text-2xl font-bold">ShareMatos</span>
              </div>
              <p className="text-gray-400">
                La plateforme de location d'outils entre voisins
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Liens utiles</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-200">Mentions légales</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-200">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition-colors duration-200">CGU</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:contact@sharematos.fr" className="hover:text-emerald-400 transition-colors duration-200">contact@sharematos.fr</a></li>
                <li className="flex space-x-4 mt-4">
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-200">Facebook</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-200">Instagram</a>
                  <a href="#" className="hover:text-emerald-400 transition-colors duration-200">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShareMatos. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
