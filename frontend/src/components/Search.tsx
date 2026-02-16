import dictionary, { type ObjectDict } from "@/dictionaries/dictionary";
import { Input } from "./ui/input";
import type { RootState } from "@/store/store";
import { useAppSelector } from "@/store/hook";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { useSearchParams, useSubmit } from "react-router-dom";
import FilterContextProvider from "./StateContext";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const submit = useSubmit();
  const { search_text, search_textPL } = dictionary.search as ObjectDict;
  const { language } = useAppSelector((state: RootState) => state.ui);

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
            placeholder={language === "en" ? search_text : search_textPL}
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
