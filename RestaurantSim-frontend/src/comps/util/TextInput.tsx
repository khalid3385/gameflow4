import { useState } from "react";

type FormCard = {
  labelContent: string;
  errorContent: string;
  className?: string;
};

const TextInput = ({
  labelContent,
  errorContent,

  className,
  ...rest
}: FormCard) => {
  const [value, setValue] = useState<string>();
  let final_class =
    (className || " ") +
    ` h-13 border border-1 border-neutral-300   peer autofill:shadow-[inset_0_0_0px_1000px_#ffffff] px-3
    ${errorContent && "border-red-400! bg-red-1000! outline-red-400"} `;

  if (!final_class.includes("py") && !final_class.includes("p-"))
    final_class += " py-2";
  if (!final_class.includes("rounded")) final_class += " rounded-md ";

  return (
    <div className="flex flex-col relative group mt-2">
      <input
        {...rest}
        onChange={(e) => setValue(e.target.value)}
        placeholder=" "
        className={final_class}
      />
      {labelContent && (
        <label
          className={`pointer-events-none mb-1 
          absolute rounded px-1 bg-white 
          ${value ? "left-2 -top-2.25 text-[smaller] " : "top-3.25 left-3 peer-not-focus:opacity-60 "}
          
          peer-focus:-top-2.25 peer-focus:left-2  peer-focus:text-[smaller] 
          ${errorContent ? `peer-focus:text-red-400 ${value && "text-red-400"}` : " peer-focus:text-blue-700"} 
          transition-[top,left,font-size] duration-150`}
        >
          {labelContent}
        </label>
      )}
      {errorContent?.trim() && (
      <ErrorMessage errorContent={errorContent} />
      )}
    </div>
  );
};

export const ErrorMessage = ({ errorContent }: { errorContent: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* <div className="rounded-full bg-red-200 text-red-400  w-3.5 h-3.5 flex items-center justify-center">
            <p className="text-[0.6rem] font-medium">!</p>
          </div> */}
      <p className="text-red-400 mt-0.5 text-[smaller]">{errorContent}</p>
      <p>&nbsp;</p>
    </div>
  );
};

export default TextInput;

// old
// type FormCard = {
//   labelContent: string;
//   errorContent: string;
//   className?: string;
//   placeHolder?: string;

// };

// const TextInput = ({ labelContent, errorContent, className,  ...rest }: FormCard) => {
//   let final_class =
//     (className || " ") +
//     ` h-11 border border-1 border-neutral-300
//     ${errorContent && "border-red-400! bg-red-100! outline-red-400"}`;

//   if (!final_class.includes("px") && !final_class.includes("p-"))
//     final_class += " px-3";
//   if (!final_class.includes("py") && !final_class.includes("p-"))
//     final_class += " py-1.5";
//   if (!final_class.includes("rounded")) final_class += " rounded-md ";

//   return (
//     <div className="flex flex-col">
//       {labelContent && (
//         <label className="mb-1 opacity-80 text-[smaller]">{labelContent}</label>
//       )}
//       <input {...rest} className={final_class} />
//       {errorContent && (
//         <ErrorMessage errorContent={errorContent}/>
//       )}
//     </div>
//   );
// };

// export const ErrorMessage = ({errorContent}: {errorContent: string}) => {
//   return (
//     <div className="flex items-center gap-1.5">
//           {/* <div className="rounded-full bg-red-200 text-red-400  w-3.5 h-3.5 flex items-center justify-center">
//             <p className="text-[0.6rem] font-medium">!</p>
//           </div> */}
//           <p className="text-red-400 mt-0.5 text-[smaller]">{errorContent}</p>
//         </div>
//   );
// }

// export default TextInput;
