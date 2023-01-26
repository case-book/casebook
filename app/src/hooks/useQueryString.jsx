import { useLocation, useSearchParams } from 'react-router-dom';
import queryString from 'query-string';

const useQueryString = () => {
  const { search } = useLocation();
  const [, setSearchParams] = useSearchParams();
  const query = queryString.parse(search);

  const setQuery = (value, replace = false) => {
    const obj = {};
    Object.keys(value || {}).forEach(key => {
      obj[key] = value[key] || '';
    });

    if (replace) {
      setSearchParams(obj);
    } else {
      setSearchParams({ ...query, ...obj });
    }
  };

  return { query, setQuery };
};

export default useQueryString;
