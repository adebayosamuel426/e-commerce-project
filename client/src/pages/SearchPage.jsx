import { SearchNavbar, SearchProducts } from "../components";
import { useOutletContext } from "react-router-dom";
const SearchPage = () => {
  const { getSearchProducts } = useOutletContext();
  return (
    <>
      <SearchNavbar />
      <SearchProducts getSearchProducts={getSearchProducts} />
    </>
  );
};

export default SearchPage;
