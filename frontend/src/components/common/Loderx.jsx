import { motion } from "framer-motion";

const Loaderx = () => {
  return (
    // <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
    //   {/* <motion.div
    //     className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
    //     animate={{ rotate: 360 }}
    //     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
    //   />
    //   <span className="ml-4 text-lg font-semibold text-blue-600">Loading...</span> */}




    // </div>\
    

     <div className="flex flex-col items-center justify-center h-screen bg-white">
      <img 
        src="/images/Book.gif"  // public folder me ho to aise
        alt="Loading..."
        className="w-32 h-32"
      />
      <br/>

       <img 
        src="/images/Circles-menu-3.gif"  // public folder me ho to aise
        alt="Loading..."
        className="w-20  "
      />
    </div>



  );
};

export default Loaderx;
