const SpecialistCard = ({ specialist, image}) => {
  return (
    <div className="bg-gray-50 m-2 hover:bg-gray-300 rounded-xl">
      <img src={image} className="w-52 m-2 max-h-36 rounded-xl"/>
      <h2 className="text-[14px] p-3 text-center  font-medium">{specialist}</h2>
    </div>
  );
};

export default SpecialistCard;
