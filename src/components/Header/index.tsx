import { NavLink } from "react-router";

const Header = () => {
  return(
    <div className="p-2 flex justify-between items-center border border-gray-300">
          <NavLink to="/">
            <img className="w-full max-h-[38px] object-center" src="https://1000logos.net/wp-content/uploads/2016/11/Facebook-Logo-2019.png" height={100} alt="logo" />
          </NavLink>

        <nav className="space-x-4">
            <NavLink className="px-4 py-2 bg-gradient-to-tr text-white font-semibold rounded-full from-blue-700 via-cyan-300 to-fuchsia-300 text-[16px] capitalize" to="/start-chat">mulai chat</NavLink>
        </nav>
    </div>
  );
};

export default Header;
