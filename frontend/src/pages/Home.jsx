import React from "react";
import Footer from "../components/Footer";
import Header from "../components/header";
import HeroSection from "../components/Section";
import FeaturedCategories from "../components/CategoryList";
import ProductGrid from "../components/Products";
import Spdexuat from "../components/Spdexuat";

const HomePage = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <HeroSection />
          <p></p>
          <Spdexuat />
          <p></p>
          <ProductGrid />
          <p></p>
          <FeaturedCategories />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
