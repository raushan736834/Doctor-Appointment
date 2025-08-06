import { useState, useRef } from "react";
import {
  Lock,
  Shield,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Globe,
  Monitor,
  MapPin,
} from "lucide-react";
import api from "../../hooks/useAxios";
import { useToast } from "@chakra-ui/react";
// Using React hooks for form handling instead of Formik

const PASSWORD_CHANGE = "/auth/change-password";

const SecurityPassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const toast = useToast();

  // Mock data for recent login activity
  const recentActivity = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Mumbai, India",
      time: "2 hours ago",
      status: "current",
      ip: "192.168.1.1",
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Delhi, India",
      time: "1 day ago",
      status: "success",
      ip: "192.168.1.2",
    },
    {
      id: 3,
      device: "Chrome on Android",
      location: "Bangalore, India",
      time: "3 days ago",
      status: "success",
      ip: "192.168.1.3",
    },
  ];

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (password) => {
    const errors = {};
    if (!password.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    if (!password.newPassword) {
      errors.newPassword = "New password is required";
    } else if (password.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        password.newPassword
      )
    ) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, number and special character";
    }
    if (!password.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (password.newPassword !== password.confirmPassword) {
      errors.confirmPassword = "Passwords must match";
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    const errors = validatePassword(passwordForm);
    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      try {
        console.log("Password change values:", passwordForm);

        // Simulate API call
        const response = await api.put(PASSWORD_CHANGE, {
          oldPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        });
        console.log(response)
        if(response.status === 200){
          toast({
          position: "bottom-right",
          title: "Password Changed successfully!",
          status: "success",
          duration: 1000,
          isClosable: true,
          containerStyle: { marginTop: 20, marginRight: 5},
        });
        }
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (err) {
        setErrMsg("Failed to update password. Please try again.");
        errRef.current?.focus();
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    return strength;
  };

  const getStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Fair";
      case 4:
        return "Strong";
      case 5:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto py-2">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 sm:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Security & Password
            </h1>
            <p className="text-purple-100 mt-2">
              Manage your account security and password settings
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Error Message */}
            {errMsg && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm" ref={errRef}>
                  {errMsg}
                </p>
              </div>
            )}

            {/* Change Password Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Lock className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "currentPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          handlePasswordChange("newPassword", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordForm.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                                getPasswordStrength(passwordForm.newPassword)
                              )}`}
                              style={{
                                width: `${
                                  (getPasswordStrength(
                                    passwordForm.newPassword
                                  ) /
                                    5) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {getStrengthText(
                              getPasswordStrength(passwordForm.newPassword)
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          handlePasswordChange(
                            "confirmPassword",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Password Requirements:
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li className="flex items-center gap-2">
                      {passwordForm.newPassword.length >= 8 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      At least 8 characters
                    </li>
                    <li className="flex items-center gap-2">
                      {/[A-Z]/.test(passwordForm.newPassword) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      One uppercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      {/[a-z]/.test(passwordForm.newPassword) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      One lowercase letter
                    </li>
                    <li className="flex items-center gap-2">
                      {/\d/.test(passwordForm.newPassword) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      One number
                    </li>
                    <li className="flex items-center gap-2">
                      {/[@$!%*?&]/.test(passwordForm.newPassword) ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Two-Factor Authentication Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Two-Factor Authentication
                </h2>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {twoFactorEnabled ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {twoFactorEnabled
                        ? "2FA is Enabled"
                        : "Enable Two-Factor Authentication"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {twoFactorEnabled
                        ? "Your account is protected with two-factor authentication. You'll need your authenticator app to sign in."
                        : "Add an extra layer of security to your account by requiring a verification code from your mobile device."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          twoFactorEnabled
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        <Smartphone className="h-4 w-4" />
                        {twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                      </button>
                      {twoFactorEnabled && (
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all">
                          <Key className="h-4 w-4" />
                          View Backup Codes
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Preferences Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Security Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Email Notifications
                      </h4>
                      <p className="text-sm text-gray-600">
                        Receive security alerts via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium text-gray-800">
                        Login Alerts
                      </h4>
                      <p className="text-sm text-gray-600">
                        Get notified of new login attempts
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginAlerts}
                      onChange={(e) => setLoginAlerts(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Recent Login Activity Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
                <Clock className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Recent Login Activity
                </h2>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <Monitor className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {activity.device}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>{activity.location}</span>
                          <span>•</span>
                          <span>{activity.ip}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        {activity.status === "current" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Current Session
                          </span>
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                  View All Login Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPassword;
