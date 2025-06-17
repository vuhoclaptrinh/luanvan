import React from "react";
import Header from "../../components/header";
import Footer from "../../components/Footer";

import ViewDM from "./ViewDM";


const Dannhmuchome=()=>{
    return(
        <>
         <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        
       <ViewDM/> 
       
        
       
      </main>
      <Footer />
    </div>
        
        </>
    );
};
export default Dannhmuchome;