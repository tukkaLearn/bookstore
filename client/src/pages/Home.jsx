import { useCallback, useMemo, useState } from "react";
import Error from "../components/Error";
import Loader from "../components/Loader";
import ProductCard from "../components/ProductCard";
import { useCart } from "../features/cart/useCart";
import useDebounce from "../hooks/useDebounce";
import useFetch from "../hooks/useFetch";
import "./Home.css";
const Home = () => {
  const { data, loading, error } = useFetch("/books");

  const { addToCart } = useCart();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    return data.filter((product) => {
      const matchTitle = product.book_name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      return matchTitle;
    });
  }, [data, debouncedSearch]);

  const handleSearch = useCallback((e) => setSearch(e.target.value), []);

  if (loading) return <Loader />;
  if (error) return <Error message={error} />;
  if (!data) return null;

  return (
    <div>
      <h1>Grab your favorite </h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search books..."
          value={search}
          onChange={handleSearch}
          name="search"
        />

        <p className="results">{filteredProducts.length} results found</p>
      </div>
      <div className="flex">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.book_id}
            product={product}
            onAdd={() => addToCart(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
