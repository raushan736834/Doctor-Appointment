import React, { useState } from 'react';
import { ChevronUp, ArrowRight } from 'lucide-react';

export default function FAQPage() {
  const [openQuestion, setOpenQuestion] = useState();

  const faqData = [
    {
      id: 0,
      question: "Can I find the nearest clinic or clinic to my home?",
      answer: "Yes, you can find the nearest doctor's office, clinic or clinic that is a member of this system by searching in the doctors or clinics section and specifying your desired area."
    },
    {
      id: 1,
      question: "Is it possible to cancel the appointment?",
      answer: "Yes, you can cancel your appointment through your account dashboard or by contacting our customer service. Please note that cancellation policies may vary depending on the timing of your request."
    },
    {
      id: 2,
      question: "Are all doctors members of HeyDoctor?",
      answer: "Our platform includes a wide network of qualified healthcare professionals. All doctors on our platform are verified and licensed practitioners who meet our quality standards."
    },
    {
      id: 3,
      question: "Do I have to pay an amount at the time of appointment?",
      answer: "Payment policies may vary depending on the type of service and healthcare provider. Some services may require advance payment while others allow payment after the consultation. Details will be provided during the booking process."
    }
  ];

  const toggleQuestion = (questionId) => {
    setOpenQuestion(openQuestion === questionId ? -1 : questionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-white via-gray-100 to-white py-12 px-6" id='faq'>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Got Questions?</h1>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqData.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleQuestion(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-gray-800 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openQuestion === faq.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ArrowRight className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>

              {/* Answer Content */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openQuestion === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed mt-3">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help Section */}
        {/* <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 font-medium">
            Contact Support
          </button>
        </div> */}
      </div>
    </div>
  );
}