import { useDispatch as _useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/stores';

const useDispatch = (): AppDispatch => _useDispatch();

export default useDispatch;