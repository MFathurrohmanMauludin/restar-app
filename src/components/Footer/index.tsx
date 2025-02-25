import { useLocation } from "react-router";

const Footer = () => {
  const location = useLocation();
  const { pathname } = location;

  return <>{pathname !== "/start-chat" && <>Footer</>}</>;
};

export default Footer;
