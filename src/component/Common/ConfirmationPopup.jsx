import { FiAlertTriangle, FiX } from "react-icons/fi";

const ConfirmationPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // default, warning, danger
  icon: CustomIcon
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'warning':
        return {
          iconColor: 'text-yellow-500',
          confirmButton: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90',
          borderColor: 'border-yellow-200'
        };
      case 'danger':
        return {
          iconColor: 'text-red-500',
          confirmButton: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90',
          borderColor: 'border-red-200'
        };
      default:
        return {
          iconColor: 'text-blue-500',
          confirmButton: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90',
          borderColor: 'border-gray-200'
        };
    }
  };

  const styles = getTypeStyles();
  const IconComponent = CustomIcon || <FiAlertTriangle />;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border ${styles.borderColor}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <IconComponent className={`w-6 h-6 ${styles.iconColor}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
        </div>
        <div className="flex justify-end space-x-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${styles.confirmButton}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationPopup;