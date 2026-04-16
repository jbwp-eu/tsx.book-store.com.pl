import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { useSearchParams, useSubmit } from "react-router-dom";
import FilterContextProvider from "./StateContext";
import { useTranslation } from "react-i18next";

const Search = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const submit = useSubmit();

  const { isFilter, setIsFilter } = useContext(FilterContextProvider.Context);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value);
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = Object.fromEntries([...searchParams]);
    const newParams = { ...params, search };
    if (!isFilter) {
      setIsFilter(true);
    }
    submit(newParams);
    setSearch("");
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="flex space-x-2">
          <Input
            placeholder={t("search.search_text")}
            type="text"
            value={search}
            onChange={handleSearchChange}
            className="w-19 xs:w-30  md:w-auto bg-info"
          />
          <Button type="submit">
            <SearchIcon />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Search;
