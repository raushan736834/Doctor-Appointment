import ServiceCard from "./ServiceCard";
import dp1 from "../../../assets/img/dp2.png"
import dp2 from "../../../assets/img/dp3.png"

const ExampleUsage = () => {
  // Centralised service data
  const services = [
    {
      title: "Medical services at home",
      description:
        "Receive medical services to do a variety of tests at your home",
      gradientColors: "from-sky-300 via-blue-300 to-blue-400",
      imageSrc : dp1
    },
    {
      title: "Free Consultation at first visit",
      description:
        "From initial diagonis to nutrition and healthy lifestyle.",
      gradientColors: "from-green-300 via-green-400 to-green-500",
      imageSrc : dp2
    },
  ];

  return (
    <div className="flex justify-center bg-gradient-to-r from-white via-gray-100 to-white p-4 md:p-6">
      <div className=" max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="flex justify-center">
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;
