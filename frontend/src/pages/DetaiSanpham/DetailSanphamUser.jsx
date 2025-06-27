import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";



import DetailSanpham from './DetailSanpham';

const DetailSanphamUser = () => {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        
        
        <DetailSanpham/>
        
        {/* <BackToTop/> */}
      </main>
      <Footer />
    </div>
    </>
  );
};

export default DetailSanphamUser;