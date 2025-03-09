import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface data {
    control: any;
    title: string;
    icon: any;
}

const ButtonComponent = (info: data) => {
  return (
    <>
      <button
        className="cursor-pointer text-gray-800 w-8 h-8 hover:bg-[#34169E] hover:text-white rounded"
        onClick={info.control}
        title={info.title}
      >
        <FontAwesomeIcon icon={info.icon} fontSize={16} />
      </button>
    </>
  );
};

export default ButtonComponent;
