import Image from 'next/image';
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="container mx-auto py-12 px-6 lg:px-16">
                <Image src="/newblogo.png" width={100} height={100} alt="Terms and Conditions" className="mx-auto" />
        <h1 className="text-4xl font-bold text-center mb-6">About BuzzAt</h1>
        <p className="text-lg leading-relaxed mb-12">
          <strong>BuzzAt</strong> is revolutionizing on-demand delivery, bringing your everyday essentials straight to your doorstep with unmatched speed and convenience. In today’s fast-paced world, we understand the value of your time, and with BuzzAt, waiting for what you need is a thing of the past.
        </p>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">What We Deliver</h2>
          <p className="text-lg leading-relaxed">
            BuzzAt specializes in lightning-fast delivery of groceries, food, and daily essentials. With our efficient logistics and expansive network, your order can arrive in as little as <strong>10 minutes</strong>. We prioritize speed, reliability, and customer satisfaction, making us the ultimate choice for those who refuse to compromise on convenience.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Our Services</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-semibold">Fast & Fresh Grocery Delivery</h3>
              <p className="text-lg leading-relaxed">
                Need groceries in a flash? BuzzAt has you covered! From fresh produce and dairy to snacks and pantry staples, we provide a wide range of high-quality groceries delivered straight to your home. Stock up for the week with just a tap on your phone and have it all in minutes.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Daily Essentials at Your Doorstep</h3>
              <p className="text-lg leading-relaxed">
                Never run out of the essentials again. BuzzAt delivers everything from toiletries and cleaning products to personal care items and pet supplies. Whether it’s household or beauty care, we ensure the fastest and easiest way to restock your necessities.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Instant Delivery Service</h3>
              <p className="text-lg leading-relaxed">
                We know that when you need something, you need it now. BuzzAt’s instant delivery service ensures your items arrive quickly, no matter the time or location. With our streamlined logistics and partnerships with local stores, your needs are met without delay.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Why Choose BuzzAt?</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li><strong>Speed:</strong> Experience ultra-fast deliveries—our orders are on time, every time.</li>
            <li><strong>Convenience:</strong> A few taps on your phone is all it takes to place an order.</li>
            <li><strong>Quality:</strong> Fresh produce and top-notch products are at the core of what we deliver.</li>
            <li><strong>Reliability:</strong> Trust us to meet your needs, whenever you need them.</li>
            <li><strong>24/7 Availability:</strong> Early mornings or late nights, BuzzAt is always ready to serve you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal list-inside space-y-2 text-lg">
            <li><strong>Browse:</strong> Open the BuzzAt app or website and explore our vast selection of products.</li>
            <li><strong>Order:</strong> Add items to your cart, proceed to checkout, and place your order.</li>
            <li><strong>Deliver:</strong> Relax while our delivery team brings your order right to your door.</li>
            <li><strong>Enjoy:</strong> Receive your items promptly and savor the convenience of BuzzAt.</li>
          </ol>
        </section>

        <p className="text-lg leading-relaxed text-center mt-12">
          BuzzAt combines cutting-edge technology with a customer-first approach to redefine convenience. We’re here to save you time, so you can focus on what truly matters. Whether you’re planning ahead or need something urgently, <strong>BuzzAt</strong> is your go-to solution for on-demand delivery.
        </p>
      </div>
    </div>
  );
};

export default About;
