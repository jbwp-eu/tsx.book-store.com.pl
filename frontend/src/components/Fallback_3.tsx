import loader from "../assets/loader.gif";

const Fallback = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full opacity-20">
      <img src={loader} alt="Loading ..." width="150" height="150" />
    </div>
  );
};

export default Fallback;
