import { NavLink, useLocation } from "react-router";
import logo from "/src/assets/logo.svg";

const Header = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="py-2 px-4 flex justify-between items-center border border-gray-300">
      <NavLink to="/">
        <img
          className="w-full max-h-[38px] object-center"
          src={logo}
          height={100}
          alt="logo"
        />
      </NavLink>

      {pathname !== "/start-chat" && (
        <nav className="space-x-4">
          <NavLink
            className="px-4 py-[10px] bg-gradient-to-tr text-white font-semibold rounded-full from-blue-700 via-cyan-300 to-fuchsia-300 text-[16px] capitalize"
            to="/start-chat"
          >
            mulai chat
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default Header;
