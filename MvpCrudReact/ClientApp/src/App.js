import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import Customer from "./components/MvpCrud/Customer";
import Product from "./components/MvpCrud/Product";
import Store from "./components/MvpCrud/Store";
import Sales from "./components/MvpCrud/Sales";
import "./custom.css";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Customer} />

        <Route path="/product" component={Product} />

        <Route path="/store" component={Store} />

        <Route path="/sales" component={Sales} />
      </Layout>
    );
  }
}
