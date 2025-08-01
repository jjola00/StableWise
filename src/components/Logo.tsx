import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      <img
        src="/StableWise_Logo.png"
        alt="StableWise logo"
        className="h-8 md:h-10 w-auto"
      />
    </Link>
  );
};