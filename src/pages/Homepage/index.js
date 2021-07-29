import React from "react";
import Directory from "../../components/Diretory";
import ProductsHome from "../../components/ProductsHome";
import "./style.scss";

function Homepage(props) {
  return (
    <section className="homepage">
      <Directory />
      <ProductsHome />
    </section>
  );
}

export default Homepage;
