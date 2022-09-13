import { useContext } from 'react';
import { rootStoreContext } from '@/stores';

const useStores = () => useContext(rootStoreContext);

export default useStores;
