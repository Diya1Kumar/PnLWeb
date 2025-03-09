import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, PieChart, TrendingUp, Building2, DollarSign, LineChart } from 'lucide-react';

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Understand Your Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400">
              With Smart Financial Analysis
            </span>
          </h1>
          
          <p className="text-gray-300 text-xl mb-12 leading-relaxed">
          This is your own personal growth record—transform your business data into actionable insights. Track profits, analyze expenses, and make informed decisions with our comprehensive P&L analysis tools, tailored just for you.
          </p>

       

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
            {[
              { icon: Building2, value: '10,000+', label: 'Businesses' },
              { icon: DollarSign, value: '$2.5B+', label: 'Analyzed Monthly' },
              { icon: LineChart, value: '99.9%', label: 'Accuracy' }
            ].map((stat, index) => (
              <div key={index} className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for Your Business
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to analyze, track, and optimize your business finances in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calculator className="w-8 h-8 mb-4 mx-auto text-blue-400" />,
              title: "Smart P&L Tracking",
              description: "Automated profit & loss statements with real-time calculations and forecasting"
            },
            {
              icon: <PieChart className="w-8 h-8 mb-4 mx-auto text-purple-400" />,
              title: "Expense Analytics",
              description: "Advanced expense categorization and optimization recommendations"
            },
            {
              icon: <TrendingUp className="w-8 h-8 mb-4 mx-auto text-green-400" />,
              title: "Growth Intelligence",
              description: "Data-driven insights for revenue trends and growth opportunities"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50
                        transform hover:scale-105 transition-all duration-300
                        hover:bg-gray-800/70 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 p-12 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/5"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using PnLAnalyser to make smarter financial decisions.
            </p>
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                        transition-all duration-300 transform hover:scale-105
                        inline-flex items-center gap-2"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}