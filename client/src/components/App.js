import React from 'react'
import { hot } from "react-hot-loader/root"
import { BrowserRouter, Route } from "react-router-dom"

import "../assets/scss/main.scss"

import NavBar from "./NavBar"

const App = props => {
  return (
    <BrowserRouter>
      <Route path="/" component={NavBar} />
    </BrowserRouter>
  )
}

export default hot(App)