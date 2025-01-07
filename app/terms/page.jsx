import Image from "next/image";
import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 md:p-10">
        <Image src="/newblogo.png" width={100} height={100} alt="Terms and Conditions" className="mx-auto" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Terms and Conditions
        </h1>
        <p className="text-gray-600 mb-4 text-center">
          Effective Date: <span className="font-medium">01-01-2025</span>
        </p>
        <p className="text-gray-700 mb-6 text-justify">
          Welcome to <strong>BUZZAt</strong>! These terms and conditions govern your use of the BUZZAt platform, including our website, mobile application, and any services provided through the platform (collectively, the "Services"). By accessing or using the Services, you agree to comply with these Terms and Conditions. If you do not agree with these terms, please do not use the Services.
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">1. Introduction</h2>
            <p className="text-gray-700">
              BUZZAt is a hyperlocal quick commerce platform designed to deliver groceries, daily essentials, and other goods to your doorstep in the shortest time possible. We aim to provide a fast, reliable, and seamless shopping experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">2. Services Provided</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Online ordering of groceries, food, and other daily essentials.</li>
              <li>Quick delivery services to your location.</li>
              <li>Payment options for your purchases via digital means.</li>
              <li>Customer support for order inquiries, delivery issues, etc.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">3. Eligibility</h2>
            <p className="text-gray-700">
              You must be at least 18 years old to use the Services. By using our platform, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into a contract.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">4. Account Registration</h2>
            <p className="text-gray-700">
              To access certain features of our platform, you may be required to register for an account. When you create an account, you agree to provide accurate, complete, and up-to-date information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">5. Order Placement</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>Product Availability:</strong> All orders placed are subject to product availability and location-based inventory.</li>
              <li><strong>Order Acceptance:</strong> We reserve the right to cancel or refuse an order for reasons such as product unavailability, payment issues, or location restrictions.</li>
              <li><strong>Pricing and Offers:</strong> Prices are subject to change. Errors may occur, and we will inform you before proceeding.</li>
              <li><strong>Payment:</strong> Payments must be made via the methods provided. By completing payment, you confirm the transaction is authorized.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">6. Delivery</h2>
            <p className="text-gray-700">
              We aim to deliver your orders promptly. Delivery times may vary due to location, traffic, or other conditions. Fees may apply.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">7. Returns and Refunds</h2>
            <p className="text-gray-700">
              If unsatisfied with a product, contact support within 24 hours of delivery. Refunds or replacements may apply after review.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">8. Prohibited Uses</h2>
            <p className="text-gray-700">
              You agree not to use the platform for unlawful activities, posting offensive content, or interfering with the platform’s functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">9. Privacy Policy</h2>
            <p className="text-gray-700">
              Your data is protected under our Privacy Policy. Please review it for more details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">10. Contact Us</h2>
            <p className="text-gray-700">
              For any questions or concerns, reach us at:  
              <span className="block">Email: buzzatstore@gmail.com</span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
