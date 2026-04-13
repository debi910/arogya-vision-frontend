import { useNavigate } from "react-router-dom"
import { Heart, Users, Stethoscope, Calendar, Shield, ArrowRight } from "lucide-react"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="w-8 h-8 text-teal-600" />
          <h1 className="text-2xl font-bold text-teal-600">Arogya Vision</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-teal-600 font-medium border-2 border-teal-600 rounded-lg hover:bg-teal-50 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-slate-900 leading-tight mb-6">
              Healthcare Management
              <span className="text-teal-600"> Simplified</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Manage your clinic efficiently with our comprehensive healthcare management system. 
              Streamline patient records, appointments, and consultations in one unified platform.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/register")}
                className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-300 to-blue-300 rounded-3xl opacity-20 blur-2xl"></div>
            <div className="relative bg-gradient-to-br from-teal-400 to-blue-500 rounded-3xl p-12 text-white shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-3 bg-white/20 rounded-lg p-4 backdrop-blur">
                  <Stethoscope className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Patient Consultations</p>
                    <p className="font-bold">2,450+ this month</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/20 rounded-lg p-4 backdrop-blur">
                  <Users className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Active Patients</p>
                    <p className="font-bold">5,230+ registered</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/20 rounded-lg p-4 backdrop-blur">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <p className="text-sm opacity-90">Appointments</p>
                    <p className="font-bold">125+ daily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Powerful Features for Modern Healthcare
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need to manage your clinic efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Patient Management</h3>
              <p className="text-slate-600">
                Maintain comprehensive patient records with medical history, contact information, and symptoms tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Appointment Scheduling</h3>
              <p className="text-slate-600">
                Seamlessly schedule and manage appointments with automatic reminders and conflict detection.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Digital Consultations</h3>
              <p className="text-slate-600">
                Record consultations, manage prescriptions, and maintain detailed clinical notes for each patient.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure & HIPAA Compliant</h3>
              <p className="text-slate-600">
                Enterprise-grade encryption and data protection to keep patient information safe and secure.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Powered Assistance</h3>
              <p className="text-slate-600">
                Get intelligent medicine suggestions based on symptoms using advanced AI technology.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 border-2 border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Role Support</h3>
              <p className="text-slate-600">
                Role-based access for admins, doctors, and receptionists with tailored dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Clinic?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of healthcare professionals who trust Arogya Vision
          </p>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-white text-teal-600 font-bold rounded-lg hover:bg-opacity-90 transition text-lg"
          >
            Start Your Free Trial Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2 text-lg font-semibold">Arogya Vision</p>
          <p className="text-slate-400">© 2026 All rights reserved. Your trusted healthcare management solution.</p>
        </div>
      </footer>
    </div>
  )
}
