import React,{ useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { changePassword, messageClear } from '../../store/Reducers/authReducer';
import { useNavigate } from 'react-router-dom';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { FiCamera } from 'react-icons/fi';
import api from '../../api/api'; // আপনার কেস-সেন্সিটিভ ফোল্ডার অনুযায়ী

const PROFILE_UPDATE_URL = '/customer/profile-update';
const ME_URL = '/customer/me';

// Profile Edit Form Component with memo
const ProfileEditForm = React.memo(({ 
  profile, 
  profileInput, 
  onAvatar, 
  avatarPreview, 
  serverUser, 
  userInfo, 
  saveProfile, 
  profileLoading, 
  resetProfile, 
  setIsEditing, 
  formatDateTime 
}) => (
  <>
    {/* Avatar + Joined */}
    <div className='flex items-center gap-4 mb-5'>
      <div className='relative w-20 h-20'>
        <img
          src={avatarPreview || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(profile?.name || 'User')}
          alt="avatar"
          className='w-20 h-20 rounded-full object-cover border'
        />
        <label
          htmlFor='avatar'
          className='absolute bottom-0 right-0 p-2 bg-teal-600 rounded-full text-white hover:bg-teal-700 cursor-pointer shadow'
          title='Change photo'
        >
          <FiCamera size={16} />
        </label>
        <input id='avatar' type='file' accept='image/*' className='hidden' onChange={onAvatar} />
      </div>
      <div>
        <div className='text-sm text-gray-600'>Email</div>
        <div className='font-medium'>{serverUser?.email || userInfo?.email || '-'}</div>
        <div className='text-xs text-gray-400'>
          Joined: {formatDateTime(serverUser?.createdAt)}
        </div>
      </div>
    </div>

    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <Field label="Full Name">
        <input 
          name='name' 
          value={profile.name} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='Your name' 
        />
      </Field>
      <Field label="Phone">
        <input 
          name='phone' 
          value={profile.phone} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='Phone number' 
        />
      </Field>

      <Field label="Gender">
        <select 
          name='gender' 
          value={profile.gender} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field label="Date of Birth">
        <input 
          type='date' 
          name='dob' 
          value={profile.dob} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500' 
        />
      </Field>

      <Field label="Address" full>
        <input 
          name='address' 
          value={profile.address} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='Street address' 
        />
      </Field>

      <Field label="District">
        <input 
          name='province' 
          value={profile.province} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='District' 
        />
      </Field>
      <Field label="City">
        <input 
          name='city' 
          value={profile.city} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='City' 
        />
      </Field>
      <Field label="Area">
        <input 
          name='area' 
          value={profile.area} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='Area' 
        />
      </Field>
      <Field label="Postal Code">
        <input 
          name='postalCode' 
          value={profile.postalCode} 
          onChange={profileInput}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500'
          placeholder='Postal code' 
        />
      </Field>
    </div>

    <div className='flex items-center gap-3 mt-5'>
      <button 
        onClick={saveProfile} 
        disabled={profileLoading}
        className='px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:bg-teal-400 cursor-pointer'
      >
        {profileLoading ? 'Saving...' : 'Save Profile'}
      </button>
      <button 
        type='button' 
        onClick={() => { resetProfile(); setIsEditing(false); }}
        className='px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 cursor-pointer'
      >
        Cancel
      </button>
    </div>
  </>
));

ProfileEditForm.displayName = 'ProfileEditForm';

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, errorMessage, successMessage, userInfo, token } = useSelector(state => state.auth);

  // server user (joined date / latest image etc.)
  const [serverUser, setServerUser] = useState(null);
  const [fetchingMe, setFetchingMe] = useState(false);

  // profile edit state
  const [isEditing, setIsEditing] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    province: '',
    city: '',
    area: '',
    postalCode: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form state
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // format helper
  const formatDateTime = (d) => (d ? new Date(d).toLocaleString() : '-');

  // fetch server user details (for joined date, latest data)
  const fetchMe = async () => {
    if (!token) return;
    try {
      setFetchingMe(true);
      const { data } = await api.get(ME_URL, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.user) {
        const u = data.user;
        setServerUser(u);
        // profile form prefill from server
        setProfile({
          name: u.name || '',
          phone: u.phone || '',
          gender: u.gender || '',
          dob: u.dob ? String(u.dob).slice(0, 10) : '',
          address: u.address || '',
          province: u.province || '',
          city: u.city || '',
          area: u.area || '',
          postalCode: u.postalCode || ''
        });
        setAvatarPreview(u.image || u.avatar || '');
      }
    } catch (e) {
      // fallback to userInfo
      setServerUser(null);
    } finally {
      setFetchingMe(false);
    }
  };

  // on mount / token change fetch me
  useEffect(() => {
    if (token) fetchMe();
  }, [token]);

  // fallback prefill from userInfo (if server missing)
  useEffect(() => {
    if (!userInfo) return;
    if (!serverUser) {
      setProfile((prev) => ({
        ...prev,
        name: userInfo?.name || '',
        // বাকিগুলো থাকলে ওভাররাইড হবে না
      }));
      setAvatarPreview(userInfo?.image || userInfo?.avatar || '');
    }
  }, [userInfo, serverUser]);

  // Password change toasts
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => navigate('/login'), 2000);
    }
  }, [errorMessage, successMessage, dispatch, navigate]);

  // password validation
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

  // password handlers
  const handlePwInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

  // strength
  const getPasswordStrength = () => {
    const pwd = formData.newPassword;
    if (!pwd || pwd.length < 8) return 'weak';
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) return 'strong';
    return 'medium';
  };
  const strength = getPasswordStrength();

  // Profile edit handlers
  const profileInput = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  const onAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };
  const resetProfile = () => {
    if (serverUser) {
      const u = serverUser;
      setProfile({
        name: u.name || '',
        phone: u.phone || '',
        gender: u.gender || '',
        dob: u.dob ? String(u.dob).slice(0, 10) : '',
        address: u.address || '',
        province: u.province || '',
        city: u.city || '',
        area: u.area || '',
        postalCode: u.postalCode || ''
      });
      setAvatarPreview(u.image || u.avatar || '');
      setAvatarFile(null);
    } else if (userInfo) {
      setProfile(prev => ({ ...prev, name: userInfo?.name || '' }));
      setAvatarPreview(userInfo?.image || userInfo?.avatar || '');
      setAvatarFile(null);
    }
  };

  const saveProfile = async () => {
    if (!token) {
      toast.error('Please login first');
      return navigate('/login');
    }
    try {
      setProfileLoading(true);
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => {
        if (v !== undefined && v !== null && String(v).trim() !== '') {
          fd.append(k, v);
        }
      });
      if (avatarFile) fd.append('image', avatarFile);

      const { data } = await api.put(PROFILE_UPDATE_URL, fd, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data?.error) throw new Error(data.error);
      toast.success(data?.message || 'Profile updated');

      // Update local serverUser so joined date/fields reflect
      if (data?.user) {
        setServerUser(data.user);
      } else {
        // fallback re-fetch if needed
        await fetchMe();
      }

      setAvatarFile(null);
      setIsEditing(false); // go back to view mode
    } catch (e) {
      toast.error(e?.message || 'Profile update failed');
    } finally {
      setProfileLoading(false);
    }
  };

  // View block for profile (read-only)
  const ProfileView = () => {
    const u = serverUser || {}; // fallback
    return (
      <div className="space-y-4">
        <div className='flex items-center gap-4'>
          <img
            src={avatarPreview || 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(profile?.name || 'User')}
            alt="avatar"
            className='w-20 h-20 rounded-full object-cover border'
          />
          <div>
            <div className='text-sm text-gray-600'>Email</div>
            <div className='font-medium'>{u.email || userInfo?.email || '-'}</div>
            <div className='text-xs text-gray-400'>
              Joined: {formatDateTime(u.createdAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Info label="Full Name" value={u.name || profile.name || '-'} />
          <Info label="Phone" value={u.phone || profile.phone || '-'} />
          <Info label="Gender" value={u.gender || profile.gender || '-'} />
          <Info label="Date of Birth" value={u.dob ? String(u.dob).slice(0,10) : (profile.dob || '-')} />
          <Info label="Address" value={u.address || profile.address || '-'} className="md:col-span-2" />
          <Info label="District" value={u.province || profile.province || '-'} />
          <Info label="City" value={u.city || profile.city || '-'} />
          <Info label="Area" value={u.area || profile.area || '-'} />
          <Info label="Postal Code" value={u.postalCode || profile.postalCode || '-'} />
        </div>

        <div>
          <button
            onClick={() => setIsEditing(true)}
            className='px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer'
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className='min-h-[80vh] bg-gray-100 py-4 px-4'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 text-center md:text-left'>
          My Profile
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Profile card */}
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-lg font-semibold text-gray-800'>User Profile</h3>
              {/* small toggle */}
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className='text-sm text-teal-700 hover:underline cursor-pointer'>
                  Edit
                </button>
              ) : null}
            </div>

            {fetchingMe ? (
              <div className='text-sm text-gray-500'>Loading...</div>
            ) : (
              <>
                {!isEditing ? (
                  <ProfileView />
                ) : (
                  <ProfileEditForm
                    profile={profile}
                    profileInput={profileInput}
                    onAvatar={onAvatar}
                    avatarPreview={avatarPreview}
                    serverUser={serverUser}
                    userInfo={userInfo}
                    saveProfile={saveProfile}
                    profileLoading={profileLoading}
                    resetProfile={resetProfile}
                    setIsEditing={setIsEditing}
                    formatDateTime={formatDateTime}
                  />
                )}
              </>
            )}
          </div>

          {/* Change Password card */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4 text-center '>Change Password</h3>
            <form onSubmit={handleSubmit}>
              {/* Old Password */}
              <div className='mb-4'>
                <label htmlFor="oldPassword" className='block text-sm font-medium text-gray-700 mb-2'>Old Password *</label>
                <div className='relative'>
                  <input
                    type={showPasswords.old ? 'text' : 'password'}
                    name='oldPassword'
                    id='oldPassword'
                    value={formData.oldPassword}
                    onChange={handlePwInputChange}
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
                <label htmlFor="newPassword" className='block text-sm font-medium text-gray-700 mb-2'>New Password *</label>
                <div className='relative'>
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name='newPassword'
                    id='newPassword'
                    value={formData.newPassword}
                    onChange={handlePwInputChange}
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
                  <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                    <div 
                      className={`h-full transition-all duration-300 ${
                        strength === 'strong' ? 'bg-green-500 w-full' : 
                        strength === 'medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'
                      }`}
                    />
                  </div>
                  <p className='text-xs mt-1 capitalize'>{strength} password</p>
                </div>
              </div>

              {/* Confirm Password */}
              <div className='mb-6'>
                <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-2'>Confirm New Password *</label>
                <div className='relative'>
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name='confirmPassword'
                    id='confirmPassword'
                    value={formData.confirmPassword}
                    onChange={handlePwInputChange}
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
                className='w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center cursor-pointer'
              >
                {loader ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <p className='text-xs text-gray-500 mt-4 text-center'>
              After changing, you'll be logged out for security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// small components for tidy UI
const Field = ({ label, children, full }) => (
  <div className={full ? 'md:col-span-2' : ''}>
    <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
    {children}
  </div>
);

const Info = ({ label, value, className = '' }) => (
  <div className={className}>
    <div className='text-xs text-gray-500'>{label}</div>
    <div className='font-medium text-gray-800 break-words'>{value || '-'}</div>
  </div>
);

export default ChangePassword;