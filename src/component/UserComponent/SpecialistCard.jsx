import React from "react";

const SpecialistCard = ({ specialist, specialistOf, description, image }) => {
  return (
    <div className="h-[18rem] flex items-center justify-center p-4">
      <style jsx>{`
        .card-container {
          perspective: 1000px;
        }
        .card {
          transform-style: preserve-3d;
        }
        .card-container:hover .card {
          transform: rotateY(180deg);
        }
        .card-front,
        .card-back {
          backface-visibility: hidden;
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      <div className="group card-container w-60 h-60">
        <div className="card relative w-full h-full transition-transform duration-700">
          {/* Front Side */}
          <div className="card-front absolute inset-0 w-full h-full bg-gray-200 rounded-2xl shadow-2xl flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <img
                src={image}
                alt={specialist}
                className="w-36 h-36 rounded-full object-cover border-4 border-blue-400 shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 text-center">
              {specialist}
            </h2>
          </div>

          {/* Back Side */}
          <div className="card-back absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl flex flex-col justify-center p-8 text-white">
            <div className="text-center">
              <div className="">
                <h3 className="text-xl font-bold text-blue-400">
                  Specialist in {specialistOf}
                </h3>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialistCard;
