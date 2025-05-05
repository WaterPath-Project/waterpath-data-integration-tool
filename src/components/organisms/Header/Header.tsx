import { useTranslation } from "react-i18next";
import { HeaderLogo } from "./HeaderLogo";

/**
 * A React functional component that renders the header section of the application.
 *
 * @function Header
 * @returns {JSX.Element} The header layout with a translated title, subtitle, and logo.
 */
export function Header() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col-reverse items-start md:flex-row md:justify-between md:items-end mb-16 mx-4 ">
      <div className="flex flex-col">
        <span className="font-outfit text-wpGreen-900 font-extrabold text-xl">
          {t("header.subtitle")}
        </span>
        <span className="font-inter text-wpBlue font-extralight text-[7.5rem] leading-none tracking-tight -ml-[10px]">
          {t("header.title")}
        </span>
      </div>
      <div>
        <HeaderLogo />
      </div>
    </div>
  );
}
