import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface data {
    control: any;
    title: string;
    icon: any;
    property: string;
}

const ButtonComponent = (info: data) => {
  return (
    <>
      <button
        className={info.property}
        onClick={info.control}
        title={info.title}
      >
        <FontAwesomeIcon icon={info.icon} fontSize={16} />
      </button>
    </>
  );
};

export default ButtonComponent;
