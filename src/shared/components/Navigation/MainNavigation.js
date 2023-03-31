import React, { useState } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
import "./MainNavigation.css";

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  return (
    <React.Fragment>
      {drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />}
      <SideDrawer show={drawerIsOpen} onClick={() => setDrawerIsOpen(false)}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      <MainHeader>
        <div className="main-navigation__title">
          <Link to="/">
            <img src="/logo.png" alt="" />
            <h1>Wanderpics</h1>
          </Link>
        </div>

        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>

        <button
          className="main-navigation__menu-btn"
          onClick={() => setDrawerIsOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
