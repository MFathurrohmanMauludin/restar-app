import { useLocation } from "react-router";

const Footer = () => {
  const location = useLocation();
  const { pathname } = location;

  console.log(pathname);
  

  return <>{pathname !== "/start-chat" && <>Footer</>}</>;
};

export default Footer;
