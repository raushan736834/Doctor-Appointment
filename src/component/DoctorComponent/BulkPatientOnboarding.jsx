import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useApiService } from "../../hooks/useAuthWithAxios";


const BulkPatientOnboarding = () => {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const api = useApiService();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some data before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const parsedData = JSON.parse(inputText);
      const response = await api.post(
        "/api/public/onboarding/bulk",
        parsedData
      );

      toast({
        title: "Success",
        description: "Bulk onboarding data submitted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

      setInputText("");
      console.log("Bulk onboarding response:", response.data);
    } catch (error) {
      console.error("Bulk onboarding error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          "Failed to submit bulk onboarding data.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Patients — Bulk Onboarding
      </h1>
      <p className="text-gray-500 mb-8">
        Enter patient data below and submit to onboard patients in bulk.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="bulkInput"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Patient Data
          </label>
          <textarea
            id="bulkInput"
            rows={8}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter patient onboarding data here..."
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent resize-y transition"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full md:w-auto px-8 py-3 rounded-lg font-semibold text-white transition duration-300 ease-in-out ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-800 hover:bg-gray-900"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default BulkPatientOnboarding;
