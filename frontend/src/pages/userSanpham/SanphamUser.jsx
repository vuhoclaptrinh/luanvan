
import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

import HeroSection from "../../components/Section";
//import FeaturedCategories from "../components/CategoryList";
//import ProductGrid from "../../components/Products";
//import Newsletter from "../components/News";
import BackToTop from "../../components/Backtotop";
import ViewSP from "./ViewSP";

const SanphamUser = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        
        
        <ViewSP />
        
        {/* <BackToTop/> */}
      </main>
      <Footer />
    </div>
    </>
  );
};

export default SanphamUser;
