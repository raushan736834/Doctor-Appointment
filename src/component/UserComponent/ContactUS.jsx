import React, { useState } from 'react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-5 flex items-center justify-center">
      <div className="max-w-6xl w-full bg-white/90 backdrop-blur rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white text-center py-16 relative overflow-hidden">
          <h1 className="text-4xl font-bold mb-4 relative z-10">Get In Touch</h1>
          <p className="text-lg opacity-90 relative z-10">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-10 bg-white">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 relative after:absolute after:bottom-[-10px] after:left-0 after:w-16 after:h-1 after:bg-gradient-to-r after:from-indigo-500 after:to-purple-600 after:rounded"></h2>

            {success && (
              <div className="bg-green-500 text-white text-center py-4 rounded-xl mb-6 font-semibold animate-fade-in">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white bg-gray-50 transition"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white bg-gray-50 transition"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-2 font-semibold text-gray-700">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white bg-gray-50 transition"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white bg-gray-50 transition resize-y"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition relative overflow-hidden"
              >
                Send Message
              </button>
            </form>
          </div>

          <div className="p-10 bg-gradient-to-br from-pink-400 to-pink-600 text-white relative overflow-hidden space-y-8">
            <h2 className="text-3xl font-bold relative z-10">Contact Info</h2>

            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">📧</div>
              <div>
                <h3 className="font-semibold text-lg">Email</h3>
                <p className="text-sm opacity-90">hello@company.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">📞</div>
              <div>
                <h3 className="font-semibold text-lg">Phone</h3>
                <p className="text-sm opacity-90">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">📍</div>
              <div>
                <h3 className="font-semibold text-lg">Address</h3>
                <p className="text-sm opacity-90">123 Business Street, Suite 100, City, State 12345</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">🕒</div>
              <div>
                <h3 className="font-semibold text-lg">Business Hours</h3>
                <p className="text-sm opacity-90">Mon - Fri, 9:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
