import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Section - Contact Details */}
          <div className="p-8 md:p-12 bg-gray-800 text-white">
            <h1 className="text-3xl font-bold mb-4">Get in Touch</h1>
            <p className="mb-6 text-gray-300">
              We'd love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out.
            </p>
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold">Email</h2>
                <p className="text-gray-400">buzzatstore@gmail.com</p>
              </div>
              <div>
                <h2 className="font-semibold">Phone</h2>
                <p className="text-gray-400">+91 9451481758</p>
              </div>
              <div>
                <h2 className="font-semibold">Address</h2>
                <p className="text-gray-400">IIM Road, Maharshi Nagar, Lucknow, Uttar Pradesh, India</p>
              </div>
            </div>
          </div>

          {/* Right Section - Image Tile */}
          <div className="relative">
            <img
              src="/buzzat-logo.png"
              alt="Contact Us"
              className="object-cover w-full h-full"
            />
            <div className="absolute bottom-0 left-0 bg-gray-800 bg-opacity-75 text-white p-4">
              <h3 className="text-lg font-semibold">We’re Here to Help</h3>
              <p className="text-sm">
                Your convenience and satisfaction are our top priorities. Reach out to us anytime!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Us a Message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600">Full Name</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-600">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600">Subject</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your subject"
              />
            </div>
            <div>
              <label className="block text-gray-600">Message</label>
              <textarea
                rows="5"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
