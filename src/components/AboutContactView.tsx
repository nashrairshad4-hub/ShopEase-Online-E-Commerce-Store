import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ShieldCheck,
  Truck,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';

export const AboutContactView: React.FC<{ type: 'about' | 'contact' }> = ({ type }) => {
  const { notify } = useShop();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify('success', 'Thank you! Your message has been received. Our team will contact you shortly.');
    setContactName('');
    setContactEmail('');
    setContactSubject('');
    setContactMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  if (type === 'about') {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Our Mission & Story
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About ShopEase Online Store
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Founded with a passion for intentional design and durable craftsmanship, ShopEase brings
            together handpicked consumer electronics, sustainable apparel, and home essentials.
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Carbon-Neutral Shipping</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We package every parcel using 100% recycled biodegradable boxes and offset shipping
              carbon on every order over $50.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Vetted Quality Standards</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every gadget and garment is tested for durability, ethical sourcing, and adherence to
              international safety standards.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Customer-First Service</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enjoy 30 days of risk-free returns, direct phone support, and comprehensive warranties
              with instant resolutions.
            </p>
          </div>
        </div>

        {/* Customer Guarantee Banner */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <h3 className="text-lg font-bold">100% Authentic & Satisfaction Guaranteed</h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
            We take pride in transparent pricing, verified manufacturer authenticity on every item,
            and dedicated client concierge support to guarantee a smooth and joyful shopping experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900">Contact ShopEase Support</h1>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
          Have an inquiry about an order, tracking, or bulk corporate gifting? We are here to help
          24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          <h3 className="font-bold text-lg">Contact Information</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Fill out the form and our support team will reply within 2 hours during business days.
          </p>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>+1 (800) 555-EASE</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>support@shopease.com</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>742 Evergreen Terrace, Springfield, IL 62704</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400">
            Operating Hours: Monday – Saturday, 8am – 10pm EST
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          {submitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
              <p className="text-xs">We have received your message and will respond right away.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="Order Inquiry / Product Question"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we assist you today?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
