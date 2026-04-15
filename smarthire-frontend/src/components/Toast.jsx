import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../redux/uiSlice';
import './Toast.css';

const Toast = () => {
  const { toast } = useSelector(state => state.ui);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div className={`toast-container animate-slide-up ${toast.type}`}>
      <div className="toast-content glass">
        {toast.type === 'success' ? '✅' : '⚠️'}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
