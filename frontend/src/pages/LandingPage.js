// src/pages/LandingPage.js

import React from 'react';

function LandingPage() {
  const features = [
    {
      image: "/images/feature.svg",
      title: "Server Management",
      description: "Full control over roles, commands, and server settings.",
    },
    {
      image: "/images/analytics.svg",
      title: "Real-time Analytics",
      description: "Track server growth, engagement, and performance metrics.",
    },
    {
      image: "/images/premium.svg",
      title: "Premium Features",
      description: "Unlock advanced moderation, custom commands, and more.",
    },
    {
      image: "/images/commands.svg",
      title: "Custom Commands",
      description: "Create custom commands for specific server needs.",
    },
    {
      image: "/images/moderation.svg",
      title: "Automated Moderation",
      description: "Keep your community safe with advanced moderation tools.",
    },
    {
      image: "/images/games.svg",
      title: "Interactive Games",
      description: "Engage your members with fun and interactive games.",
    },
  ];

  const subscriptions = [
    {
      title: "Free",
      price: "$0",
      features: ["Basic Commands", "Limited Analytics", "Community Support"],
    },
    {
      title: "Community",
      price: "$10",
      features: ["All Free Features", "Advanced Commands", "Priority Support"],
    },
    {
      title: "Enterprise",
      price: "$50",
      features: ["All Community Features", "Custom Features", "Dedicated Support"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-base-200">


      {/* Hero Section */}

      <header className="hero-section relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://i.redd.it/u7lvwa4e8i9b1.gif')" }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div> {/* Adjusted opacity */}
        <div className="flex items-center justify-center h-full relative z-10"> {/* Added relative and z-10 */}
          <div className="text-center px-4">
            <h1 className="main-heading text-7xl font-extrabold text-white drop-shadow-lg">Athena Nexus</h1>
            <p className="hero-subheading text-white text-2xl mt-4">The Ultimate Discord Bot for Gaming Communities</p>
            <div className="cta-buttons mt-10 flex justify-center space-x-6">
              <a href="/signup" className="btn btn-primary btn-lg text-lg px-6 py-3">Get Started</a>
              <a href="https://discord.com/oauth2/authorize" className="btn btn-secondary btn-lg text-lg px-6 py-3">Add to Discord</a>
            </div>
          </div>
        </div>
      </header>


      {/* Features Section with Z-Pattern */}
      <section className="features-section py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Key Features</h2>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center mb-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
            >
              <div className="lg:w-1/2 w-full">
                <img src={feature.image} alt={feature.title} className="rounded-lg shadow-lg w-90 h-auto" />
              </div>
              <div className="lg:w-1/2 w-full lg:px-12 px-0 mt-8 lg:mt-0">
                <h3 className="text-3xl font-semibold text-primary mb-4">{feature.title}</h3>
                <p className="text-lg text-base-content">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section bg-primary text-primary-content py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Level Up Your Server?</h2>
          <p className="mb-8 text-xl">Join thousands of communities using Athena Nexus to power their gaming servers.</p>
          <a href="/signup" className="btn btn-secondary btn-lg">Get Started</a>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="subscriptions-section py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptions.map((plan, index) => (
              <div key={index} className="card bg-base-100 border-2 border-primary p-8 rounded-lg shadow-xl hover:shadow-2xl transition-shadow">
                <div className="card-body text-center">
                  <h3 className="text-3xl font-semibold mb-4 text-primary">{plan.title}</h3>
                  <p className="text-2xl font-bold mb-4 text-base-content">{plan.price} / month</p>
                  <ul className="list-disc list-inside mb-6 text-left text-base-content">
                    {plan.features.map((feature, i) => (
                      <li key={i}>{feature}</li>
                    ))}
                  </ul>
                  <a href="/signup" className="btn btn-primary btn-lg">Get Started</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section bg-base-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-primary text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Testimonial 1"
                className="testimonial-image mx-auto mb-4 rounded-full border-2 border-blue-500"
              />
              <p className="testimonial-text italic text-lg text-base-content">“Athena Nexus is a game-changer for managing our gaming community!”</p>
              <p className="testimonial-author mt-2 font-semibold text-base-content">— Guild Leader</p>
            </div>
            <div className="card bg-base-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Testimonial 2"
                className="testimonial-image mx-auto mb-4 rounded-full border-2 border-blue-400"
              />
              <p className="testimonial-text italic text-lg text-base-content">“I love the real-time stats and premium features. Highly recommend!”</p>
              <p className="testimonial-author mt-2 font-semibold text-base-content">— Esports Manager</p>
            </div>
            <div className="card bg-base-200 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
              <img
                src="https://via.placeholder.com/80"
                alt="Testimonial 3"
                className="testimonial-image mx-auto mb-4 rounded-full border-2 border-blue-600"
              />
              <p className="testimonial-text italic text-lg text-base-content">“Our server has never been easier to manage!”</p>
              <p className="testimonial-author mt-2 font-semibold text-base-content">— Community Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
