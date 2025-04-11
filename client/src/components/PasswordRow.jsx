import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa6";
import { FaEye } from "react-icons/fa6";
const PasswordRow = ({ defaultValue, onChange, required = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);
  return (
    <div className='form-row'>
      <label htmlFor='password' className='form-label'>
        Password
      </label>
      <div className='password-row'>
        <input
          type={showPassword ? "text" : "password"}
          name='password'
          className='form-input'
          defaultValue={defaultValue || ""}
          onChange={onChange}
          required={required}
        />
        <span onClick={togglePassword} className='eye'>
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </span>
      </div>
    </div>
  );
};

export default PasswordRow;
