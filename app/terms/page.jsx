import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto py-12 px-6 lg:px-16">
        <h1 className="text-4xl font-bold text-center mb-6">Terms and Conditions</h1>
        <p className="text-lg leading-relaxed text-center mb-12">
          Welcome to BuzzAt! By using our services, you agree to abide by the terms and conditions outlined below. Please read them carefully to ensure you understand your rights and responsibilities.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">About BuzzAt</h2>
          <p className="text-lg leading-relaxed">
            <strong>BuzzAt</strong> is a cutting-edge on-demand delivery service designed to bring your essentials and everyday items right to your doorstep in record time. We prioritize convenience and customer satisfaction, ensuring you never have to wait long for what you need.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Services</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">1. Fast & Fresh Grocery Delivery</h3>
              <p className="text-lg leading-relaxed">
                BuzzAt offers a wide selection of groceries, including fresh produce, dairy products, snacks, and pantry staples. With just a tap on your phone, you can order and receive your groceries in minutes.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">2. Daily Essentials at Your Doorstep</h3>
              <p className="text-lg leading-relaxed">
                We deliver everything from toiletries and cleaning products to pet supplies and personal care items. BuzzAt ensures you never run out of the essentials you need.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">3. Instant Delivery Service</h3>
              <p className="text-lg leading-relaxed">
                Our ultra-fast delivery service ensures you get what you need when you need it. With BuzzAt, delays are a thing of the past.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Ensure all information provided during registration is accurate and up-to-date.</li>
            <li>Use our services responsibly and comply with all applicable laws and regulations.</li>
            <li>Respect our delivery personnel and ensure a safe environment for them to deliver your items.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Why Choose BuzzAt?</h2>
          <p className="text-lg leading-relaxed">
            Our mission is to make your life easier by delivering quality products at lightning speed. With BuzzAt, you can count on:
          </p>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>Unmatched convenience for all your daily needs.</li>
            <li>Reliable and efficient delivery services 24/7.</li>
            <li>High-quality products sourced from trusted suppliers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
          <p className="text-lg leading-relaxed">
            If you have any questions about our terms and conditions, feel free to reach out to us through our website or customer support channels. We’re here to help you every step of the way.
          </p>
          <p className='font-bold'>Email:-</p>buzzatstore@gmail.com
        </section>

        <p className="text-lg leading-relaxed text-center mt-12">
          By using BuzzAt’s services, you agree to our terms and conditions and understand that our goal is to provide you with the best possible experience. Thank you for choosing BuzzAt!
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
