import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Mail, Shield, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

function PaymentForm({ routine, plan, onBack }) {
  const { dispatch } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: ''
  });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Add user to context
      const newUser = {
        id: Date.now(),
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: routine.gender,
        frequency: parseInt(routine.frequency),
        objective: routine.objective,
        plan: plan.id,
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Add sale to context
      const newSale = {
        id: Date.now(),
        userEmail: formData.email,
        plan: plan.id,
        amount: plan.price,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      };

      dispatch({ type: 'ADD_USER', payload: newUser });
      dispatch({ type: 'ADD_SALE', payload: newSale });

      setProcessing(false);
      setSuccess(true);
    }, 3000);
  };

  if (success) {
    return (
      <section className="max-w-2xl mx-auto text-center">
        <div className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#CBFF00]/30">
          <CheckCircle className="h-16 w-16 text-[#CBFF00] mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Payment Successful!</h2>
          <p className="text-[#787878] mb-6">
            Your {plan.name} has been activated and your personalized routine is being prepared.
          </p>
          
          <div className="bg-[#F8FE9F]/10 border border-[#F8FE9F]/20 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-[#F8FE9F] mb-3">What happens next?</h3>
            <ul className="text-left space-y-2 text-[#787878]">
              <li>• Your routine PDF will be sent to {formData.email} within 5 minutes</li>
              <li>• You'll receive YouTube links with exercise demonstrations</li>
              {plan.id === 'premium' && (
                <li>• Matías will contact you within 24 hours for personalized guidance</li>
              )}
              <li>• Check your spam folder if you don't see the email</li>
            </ul>
          </div>

          {plan.id === 'premium' && (
            <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-xl p-4 mb-6">
              <p className="text-[#CBFF00] font-semibold">
                Premium Support: Contact Matías directly at +1 (555) 123-4567
              </p>
            </div>
          )}

          <button
            onClick={() => window.location.href = '/'}
            className="bg-[#CBFF00] hover:bg-[#DBFE52] text-[#2D2D2D] font-semibold py-3 px-8 rounded-xl transition-colors"
          >
            Back to Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-[#787878] hover:text-[#CBFF00] mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to plan selection</span>
      </button>

      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">
          Complete Your Order
        </h2>
        <div className="bg-[#2D2D2D] rounded-xl p-4 inline-block border border-[#787878]/20">
          <span className="text-[#787878]">{plan.name} - </span>
          <span className="text-2xl font-bold text-[#CBFF00]">${plan.price}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#2D2D2D] rounded-2xl p-8 border border-[#787878]/20">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#787878] mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#787878]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl pl-12 pr-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full bg-[#202020] border border-[#787878]/30 rounded-xl px-4 py-4 text-white focus:border-[#CBFF00] focus:outline-none transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="bg-[#787878]/10 border border-[#787878]/20 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-[#CBFF00]" />
              <h3 className="font-semibold">Payment Information</h3>
            </div>
            <div className="bg-[#CBFF00]/10 border border-[#CBFF00]/20 rounded-lg p-4">
              <p className="text-[#CBFF00] text-sm font-medium">
                🔄 This is a demo version. In production, Stripe payment integration would be implemented here.
              </p>
            </div>
          </div>

          <div className="bg-[#F8FE9F]/10 border border-[#F8FE9F]/20 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="h-5 w-5 text-[#F8FE9F]" />
              <span className="font-semibold text-[#F8FE9F]">Secure & Automated</span>
            </div>
            <ul className="text-sm text-[#787878] space-y-1">
              <li>• SSL encrypted payment processing</li>
              <li>• Instant email delivery after payment</li>
              <li>• 30-day money-back guarantee</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-[#CBFF00] hover:bg-[#DBFE52] disabled:bg-[#787878] text-[#2D2D2D] font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#CBFF00]/30 disabled:transform-none disabled:cursor-not-allowed"
          >
            {processing ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#2D2D2D] border-t-transparent"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Complete Order - $${plan.price}`
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default PaymentForm;