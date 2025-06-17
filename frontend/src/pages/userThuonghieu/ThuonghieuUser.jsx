import React from "react";
import Header from "../../components/header";
import Footer from "../../components/Footer";
import ViewBrand from "./ViewThuonghieu";




const Thuonghieuhome=()=>{
    return(
        <>
         <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        
       <ViewBrand/> 
       
        
       
      </main>
      <Footer />
    </div>
        
        </>
    );
};
export default Thuonghieuhome;