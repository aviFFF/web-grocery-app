// pages/vendor-registration.js
import Head from 'next/head';

export default function VendorRegistration() {
  return (
    <>
      <Head>
        <title>Vendor Registration</title>
        <meta name="description" content="Partner with us by filling out the Google Form with your details." />
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg py-20 w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Become a Partner Vendor</h1>
          <p className="text-gray-600 mb-6">
            Fill out the form below to share your details with us, and we will get in touch with you.
          </p>
          <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfYribVXxkzDE-niK_KTkMzRJSnscWo-xv50a4W7l7P3YGWSg/viewform?embedded=true" className='w-full' height="2000">Loading…</iframe>

        </div>
      </main>
    </>
  );
}