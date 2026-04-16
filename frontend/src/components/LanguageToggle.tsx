import { PL, GB } from "country-flag-icons/react/3x2";
import { useDispatch } from "react-redux";
import { setLanguage } from "@/store/uiSlice";
import i18n from "@/i18n/i18n";

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const setLanguageHandler = (locale: string) => {
    dispatch(setLanguage(locale));
    void i18n.changeLanguage(locale === "pl" ? "pl" : "en");
  };

  return (
    <ul className="flex items-center gap-2">
      <li>
        <PL
          title="PL"
          className="w-4 transition duration-200 hover:scale-120"
          onClick={() => setLanguageHandler("pl")}
        />
      </li>
      <li>
        <GB
          title="GB"
          className="w-4 transition duration-200 hover:scale-120"
          onClick={() => setLanguageHandler("en")}
        />
      </li>
    </ul>
  );
};

export default LanguageToggle;
