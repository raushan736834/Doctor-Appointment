import React from "react";
import {useLocation} from "react-router-dom";
import { AlertCircle, Clock, Upload } from "lucide-react";

const AfterReviewStep = () => {
  const location = useLocation();
  const {doctor} = location.state;

  const handleResubmit = () => {
    // Handle document resubmission
    alert("Document upload form would open here");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-indigo-900">
            HeyDoctor
          </h1>
          <p className="text-sm text-gray-600">
            Healthcare Professional Access
          </p>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Welcome Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome, {doctor?.fullname}
            </h2>
            <p className="text-gray-600">{doctor?.email}</p>
          </div>

          {/* PENDING_VERIFICATION Status */}
          {doctor?.accountStatus === "PENDING" && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                    Profile Under Review
                  </h3>
                  <p className="text-yellow-800 mb-3">
                    Your profile is under review. You will be notified once
                    approved.
                  </p>
                  <div className="text-sm text-yellow-700">
                    <p className="mb-1">
                      <strong>Submitted:</strong> {doctor.submittedDate}
                    </p>
                    <p>
                      <strong>Expected review time:</strong> 2-3 business days
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">
                  What happens next?
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>
                      Our verification team is reviewing your credentials
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>
                      You'll receive an email notification once the review is
                      complete
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>
                      If additional information is needed, we'll contact you
                      directly
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* REJECTED Status */}
          {doctor?.accountStatus === "REJECTED" && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Verification Not Approved
                  </h3>
                  <p className="text-red-800 mb-4">
                    Unfortunately, we were unable to verify your profile with
                    the information provided.
                  </p>
                  <div className="bg-white p-4 rounded border border-red-200">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      Reason for rejection:
                    </p>
                    <p className="text-sm text-gray-700">
                      {doctor.rejectionReason}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleResubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 
                px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                Resubmit Documents
              </button>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Need help?</h4>
                <p className="text-blue-800 text-sm mb-3">
                  If you have questions about the rejection or need assistance
                  with resubmission, please contact our support team.
                </p>
                <div className="flex gap-4 text-sm">
                  <a
                    href="mailto:support@mediconnect.com"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Email Support
                  </a>
                  <span className="text-gray-400">|</span>
                  <a
                    href="tel:1-800-123-4567"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Call: 1-800-123-4567
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default AfterReviewStep;
