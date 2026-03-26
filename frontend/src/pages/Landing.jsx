import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Search, Handshake, Package, Lock, Users, Sprout, DollarSign, Mail, MapPin, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { isFirebaseWaitlistEnabled } from '../lib/firebase';
import {
  fetchWaitlistCountFromFirestore,
  submitWaitlistToFirestore,
} from '../lib/waitlistFirestore';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '';

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
  const [waitlistCount, setWaitlistCount] = useState(null);
  const [waitlistCountReady, setWaitlistCountReady] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      if (isFirebaseWaitlistEnabled()) {
        const n = await fetchWaitlistCountFromFirestore();
        setWaitlistCount(n);
        setWaitlistCountReady(true);
        return;
      }
      if (!API) {
        setWaitlistCount(0);
        setWaitlistCountReady(true);
        return;
      }
      try {
        const res = await axios.get(`${API}/waitlist/count`, { timeout: 5000 });
        setWaitlistCount(res.data?.count ?? 0);
      } catch {
        setWaitlistCount(0);
      } finally {
        setWaitlistCountReady(true);
      }
    };
    fetchCount();
  }, []);

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
      if (isFirebaseWaitlistEnabled()) {
        await submitWaitlistToFirestore(formData);
      } else {
        if (!API) {
          toast.error('Configuration serveur manquante.');
          return;
        }
        await axios.post(`${API}/waitlist`, formData);
      }
      setSubmitted(true);
      toast.success('Merci ! Vous êtes inscrit(e) à la liste d\'attente');
      if (isFirebaseWaitlistEnabled()) {
        const n = await fetchWaitlistCountFromFirestore();
        setWaitlistCount(n);
      } else {
        const countRes = await axios.get(`${API}/waitlist/count`);
        setWaitlistCount(countRes.data?.count ?? 0);
      }
      setFormData({
        prenom: '',
        email: '',
        ville: '',
        userType: { louer: false, proposer: false }
      });
    } catch (error) {
      if (error.code === 'duplicate-email' || error.message === 'duplicate-email') {
        toast.error('Cet email est déjà inscrit');
        return;
      }
      const msg = error.response?.data?.detail;
      const isArray = Array.isArray(msg);
      const errorMsg = isArray && msg[0]?.msg ? msg[0].msg : (typeof msg === 'string' ? msg : null);
      toast.error(errorMsg || 'Une erreur est survenue. Veuillez réessayer.');
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

      {/* Attentes (projet en lancement — pas encore de retours d’usage réels) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              {!waitlistCountReady
                ? '...'
                : waitlistCount === null && isFirebaseWaitlistEnabled()
                  ? 'Liste ouverte'
                  : waitlistCount === 0
                    ? '0'
                    : `${waitlistCount}+`}
            </p>
            <p className="text-xl text-gray-600">
              {!waitlistCountReady
                ? 'Chargement...'
                : waitlistCount === null && isFirebaseWaitlistEnabled()
                  ? 'Rejoignez les premiers inscrits — connexion ou configuration à vérifier.'
                  : waitlistCount === 0
                    ? 'Soyez parmi les premiers à rejoindre ShareMatos !'
                    : 'Personnes déjà intéressées par ShareMatos'}
            </p>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
            Pourquoi ils sont intéressés
          </h3>
          <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto text-sm sm:text-base">
            La plateforme n&apos;existe pas encore : ce sont des voix de la liste d&apos;attente qui expliquent ce qu&apos;elles attendent du projet.
          </p>
          
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
                &laquo; Mes outils dorment au garage. Ça serait intéressant de gagner un peu d&apos;argent tous les mois en les prêtant à mes voisins. Une super idée ! &raquo;
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-start space-x-4 mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=256&q=80"
                  alt="Antoine, étudiant"
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Antoine R.</h4>
                  <p className="text-sm text-gray-600">Étudiant, Villeneuve-d&apos;Ascq</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed italic">
                &laquo; Je bricole de temps en temps mais je n&apos;ai ni le budget ni la place pour tout acheter. Pouvoir louer une perceuse ou une visseuse près de chez moi, ce serait exactement ce qu&apos;il me faut. &raquo;
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
                <li><Link to="/mentions-legales" className="hover:text-emerald-400 transition-colors duration-200">Mentions légales</Link></li>
                <li><Link to="/politique-confidentialite" className="hover:text-emerald-400 transition-colors duration-200">Politique de confidentialité</Link></li>
                <li><Link to="/cgu" className="hover:text-emerald-400 transition-colors duration-200">CGU</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:contact@sharematos.fr" className="hover:text-emerald-400 transition-colors duration-200">contact@sharematos.fr</a></li>
                <li className="flex space-x-4 mt-4">
                  <a href="https://facebook.com/sharematos" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-200">Facebook</a>
                  <a href="https://instagram.com/sharematos" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-200">Instagram</a>
                  <a href="https://linkedin.com/company/sharematos" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-200">LinkedIn</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShareMatos. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
