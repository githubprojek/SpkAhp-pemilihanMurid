import React from "react";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrump = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="flex items-center gap-1 text-sm font-semibold capitalize">
      <Link to="/">Admin Panel</Link>
      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <React.Fragment key={routeTo}>
            <ChevronRight size={15} />
            <Link to={routeTo}>{pathname.charAt(0).toUpperCase() + pathname.slice(1)}</Link>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Breadcrump;
