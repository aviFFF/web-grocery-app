// pages/privacy.js
import Head from "next/head";
import Image from "next/image";

export default function Privacy() {
  return (
    <div>
      <Head>
        <title>Privacy Policy - BuzzAt</title>
        <meta
          name="description"
          content="Learn how BuzzAt protects your privacy and ensures the security of your data."
        />
      </Head>
      <main className="bg-gray-50 min-h-screen py-10 px-6 sm:px-16">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
          <Image
            src="/newblogo.png"
            width={100}
            height={100}
            alt="Terms and Conditions"
            className="mx-auto"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Privacy Policy
          </h1>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Data Collection Transparency
            </h2>
            <p className="text-gray-600 mb-2">
              BuzzAt clearly outlines what data it collects from its users. This
              typically includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>
                <strong>Personal Information:</strong> Name, phone number,
                email, and address.
              </li>
              <li>
                <strong>Payment Details:</strong> Credit card information,
                billing details, and other payment-related data.
              </li>
              <li>
                <strong>Usage Information:</strong> Browsing activity on the
                platform, location data for deliveries, and interaction with app
                features.
              </li>
              <li>
                <strong>Transactional Data:</strong> Order history, product
                preferences, and delivery details.
              </li>
            </ul>
            <p className="text-gray-600 mt-2">
              Users are informed about the purpose of each data collection, with
              clear consent obtained before any data is stored or processed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Purpose of Data Collection
            </h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>
                Order Fulfilment: To deliver products and facilitate smooth
                transactions.
              </li>
              <li>
                User Support: To address customer inquiries, complaints, or
                order issues.
              </li>
              <li>
                Personalization: To offer recommendations based on user
                preferences.
              </li>
              <li>
                Improving Services: To analyze usage patterns and optimize the
                app’s performance.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Data Security Measures
            </h2>
            <p className="text-gray-600 mb-2">
              BuzzAt prioritizes the security of user data by implementing
              multiple layers of protection, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>
                Encryption: Industry-standard encryption protocols (SSL/TLS) for
                secure transmission.
              </li>
              <li>
                Access Control: Limited access to sensitive data for authorized
                personnel only.
              </li>
              <li>
                Regular Audits: Security audits to identify and address
                potential vulnerabilities.
              </li>
              <li>
                Data Minimization: Collecting only the minimum necessary
                personal data.
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Third-Party Data Sharing
            </h2>
            <p className="text-gray-600 mb-2">
              BuzzAt may share user data with third parties for specific
              purposes, including:
            </p>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Payment Processors: To handle transactions securely.</li>
              <li>Delivery Partners: To ensure correct delivery of goods.</li>
              <li>
                Service Providers: For technical support, data analytics, or
                marketing services.
              </li>
              <li>
                Legal Compliance: As required by law or valid legal requests.
              </li>
            </ul>
            <p className="text-gray-600 mt-2">
              All third-party vendors comply with privacy and security
              standards, and data sharing occurs with user consent or legal
              obligation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              User Control and Rights
            </h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>
                Access to Data: Users can view, update, or delete their personal
                information at any time.
              </li>
              <li>
                Account Deletion: Users can request account deletion, ensuring
                compliance with data protection regulations.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Continuous Improvement
            </h2>
            <p className="text-gray-600">
              BuzzAt continuously evaluates and improves its privacy policies
              and security measures to adapt to new challenges and regulations,
              ensuring user data protection.
            </p>
          </section>

          <footer className="mt-10 text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} BuzzAt. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}
