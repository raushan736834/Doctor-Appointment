const Shimmer = () => {
  return (
    <div className="mx-20 max-w-7xl px-4 py-6 my-5 sm:px-6 lg:px-8 bg-gray-100 rounded-lg flex flex-wrap justify-evenly">
      {/* <h1>Shimmer  is loading!1</h1> */}
      {Array(10)
        .fill("")
        .map((e, index) => (
          <div key={index} className="bg-gray-200 m-4 rounded-xl w-48 h-52"></div>
        ))}
    </div>
  );
};

export default Shimmer;
