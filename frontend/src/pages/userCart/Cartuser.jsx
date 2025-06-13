import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";


import Cart from "./cart";

const Cartuser = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        
        
        <Cart/>
        
        {/* <BackToTop/> */}
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Cartuser;