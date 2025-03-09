const SpecialistCard = ({ text, image, id }) => {
  return (
    <div className="bg-gray-50 m-4  hover:bg-gray-300 rounded-xl">
      <img src={image} className="w-48 m-2 rounded-xl"/>
      <h2 className="text-[14px] p-3 text-center font-medium">{text}</h2>
    </div>
  );
};

export default SpecialistCard;
