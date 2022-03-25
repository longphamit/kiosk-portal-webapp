import { useSelector as _useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppState } from '../redux/stores';


const useSelector: TypedUseSelectorHook<AppState> = _useSelector;

export default useSelector;