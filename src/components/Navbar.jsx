import React from "react";
import Breadcrump from "./Breadcrump";
const Navbar = () => {
  return (
    <div className="flex items-start justify-between p-4 bg-gradient-to-r from-green-800 to-green-600 text-white shadow">
      <Breadcrump />
    </div>
  );
};

export default Navbar;
