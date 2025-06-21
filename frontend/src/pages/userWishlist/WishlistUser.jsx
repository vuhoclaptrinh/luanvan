import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

import Wishlist from "./Wishlist";

const WishlistUser = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Wishlist />
        </main>
        <Footer />
      </div>
    </>
  );
}   
export default WishlistUser;    