import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
// import { changePassword, messageClear } from '../../store/Reducers/authReducer';
import { changePassword, messageClear } from '../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';  // react-icons/bs

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, errorMessage, successMessage, userInfo, token } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Toast & Redirect
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      // Clear form & redirect
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [errorMessage, successMessage, dispatch, navigate]);

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.oldPassword.trim()) newErrors.oldPassword = 'Old password is required';
    if (!formData.newPassword.trim()) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Minimum 8 characters required';
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword))
      newErrors.newPassword = 'Must contain uppercase, lowercase & number';
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.confirmPassword !== formData.newPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!userInfo || !token) {
      toast.error('Please login first');
      return navigate('/login');
    }

    setSubmitting(true);
    dispatch(changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword
    }));
    setSubmitting(false);
  };

  const getPasswordStrength = () => {
    const pwd = formData.newPassword;
    if (pwd.length < 8) return 'weak';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) return 'strong';
    return 'medium';
  };

  const strength = getPasswordStrength();

  return (
    <div className='min-h-[80vh] bg-gray-100 flex items-center justify-center py-2 px-4'>
      <div className='max-w-md w-full bg-white rounded-lg shadow-md p-8'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6 text-center'>Change Password</h2>
        <form onSubmit={handleSubmit}>
          {/* Old Password */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Old Password *</label>
            <div className='relative'>
              <input
                type={showPasswords.old ? 'text' : 'password'}
                name='oldPassword'
                value={formData.oldPassword}
                onChange={handleInputChange}
                placeholder='Enter your old password'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12 ${
                  errors.oldPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loader}
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('old')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPasswords.old ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>
            {errors.oldPassword && <p className='text-red-500 text-xs mt-1'>{errors.oldPassword}</p>}
          </div>

          {/* New Password */}
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>New Password *</label>
            <div className='relative'>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name='newPassword'
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder='Enter new password'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12 ${
                  errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loader}
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('new')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPasswords.new ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className='text-red-500 text-xs mt-1'>{errors.newPassword}</p>}
            {/* Strength Indicator */}
            <div className='mt-2'>
              <div className={`h-2 bg-gray-200 rounded-full overflow-hidden`}>
                <div 
                  className={`h-full transition-all duration-300 ${
                    strength === 'strong' ? 'bg-green-500 w-full' : 
                    strength === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                  }`}
                ></div>
              </div>
              <p className='text-xs mt-1 capitalize'>{strength} password</p>
            </div>
          </div>

          {/* Confirm Password */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password *</label>
            <div className='relative'>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder='Confirm new password'
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-12 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loader}
              />
              <button
                type='button'
                onClick={() => togglePasswordVisibility('confirm')}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPasswords.confirm ? <BsEyeSlash size={20} /> : <BsEye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword}</p>}
          </div>

          <button
            type='submit'
            disabled={loader || submitting}
            className='w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center'
          >
            {loader ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        <p className='text-xs text-gray-500 mt-4 text-center'>
          After changing, you'll be logged out for security.
        </p>
      </div>
    </div>
  );
};

export default ChangePassword;