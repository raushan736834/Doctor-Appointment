const Shimmer = () => {
  return (
    <div className="mx-20 max-w-7xl px-4 py-6 my-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg flex flex-wrap justify-evenly">
      {Array(12)
        .fill("")
        .map((e, index) => (
          <div
            key={index}
            className="bg-gray-400 m-4 rounded-xl w-48 h-52 transition-all duration-700 blink-shimmer"
            style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.07)" }}
          ></div>
        ))}
    </div>
  );
};

export default Shimmer;
