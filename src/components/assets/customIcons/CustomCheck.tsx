import { FC, SVGProps } from "react";

export const CustomCheck: FC<SVGProps<SVGSVGElement>> = ({ ...props }) => {
  return (
    <svg
      width="10"
      height="7"
      viewBox="0 0 10 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.5 1L3.74264 5.74264L1.5 3.5"
        stroke="#0B4159"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
