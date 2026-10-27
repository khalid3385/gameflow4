type FormCard = {
  width: string;
  height: string;
  nickname: string;
  children: React.ReactNode;
};

const FormCard = ({ children = null, width = "", height = "" }: FormCard) => {
  return (
    <div
      className={`
   border border-neutral-200
  bg-white p-6 rounded-lg flex flex-col gap-2 ${width} ${height}`}
    >
      {children}
    </div>
  );
};

export default FormCard;
