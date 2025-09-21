import { useState, useRef, useEffect } from 'react';
import styles from './App.module.css';
import { PASSWORD_STRENGTH, USER_FORM } from './constants';
import { sendFormData } from './api';
import { validateEmailOnBlur,
	validatePasswordOnBlur,
	validatePasswordRepeatOnBlur } from './utils/blur/blur';
import { validatePassword,
	validateRepeatPassword,
	calculatePasswordStrength } from './utils/validate/validate.js';

export const App = () => {
	const [formData, setFormData] = useState( USER_FORM );
	const [errorEmail, setEmailError] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);
	const [errorRepeatPassword, setErrorRepeatPassword] = useState(null);
	const [passwordStrength, setPasswordStrength] = useState( PASSWORD_STRENGTH );
	const [lastChangedField, setLastChangedField] = useState ('');

	const submitButtonRef = useRef(null);

	const onSubmit = (event) => {
		event.preventDefault();
		if (isFormValid) sendFormData(formData);
	};

	const isFormValid = () => {
    if (!formData.email || !formData.password || !formData.repeatPassword) return false;
    if (errorEmail || errorPassword || errorRepeatPassword) return false;
    if (formData.password !== formData.repeatPassword) return false;
    return true;
	}

  	useEffect(() => {
  	const allFieldsFilled = formData.email && formData.password && formData.repeatPassword;
  	const noErrors = !errorEmail && !errorPassword && !errorRepeatPassword;
  	const passwordsMatch = formData.password === formData.repeatPassword;

  	if (allFieldsFilled && noErrors && passwordsMatch &&
      lastChangedField === 'repeatPassword' &&
      submitButtonRef.current) {
    const timer = setTimeout(() => {
      submitButtonRef.current.focus();
    }, 100);

    return () => clearTimeout(timer);
  	}
	}, [formData, errorEmail, errorPassword, errorRepeatPassword, lastChangedField]);

	const onEmailChange = ({ target }) => {
		const newValue = target.value;
		setFormData({...formData, email:newValue});
		setLastChangedField('email');

		let newEmailError = null;

		setEmailError(newEmailError);
	}

	const onPasswordChange = ({ target }) => {
		const newValue = target.value;
		setFormData(prev => ({...prev, password:newValue}));
		setErrorPassword(validatePassword( newValue ));

		setLastChangedField('password');

		let newPasswordError = null;

		setErrorPassword(newPasswordError);

		const strength = calculatePasswordStrength( newValue );
    	setPasswordStrength({
  			width: strength.width,
  			class: styles[strength.classType] || '',
			});
	}

	const onRepeatPasswordChange = ({ target }) => {
		const newValue = target.value;
		setFormData(prev => ({...prev, repeatPassword: newValue}));
		setErrorRepeatPassword(validateRepeatPassword(formData.password, newValue));
		setLastChangedField('repeatPassword');
	}

	const onEmailBlur = ({ target }) => {
  		setEmailError(validateEmailOnBlur(target.value));
	};

	const onPasswordBlur = ({ target }) => {
  		setErrorPassword(validatePasswordOnBlur(target.value));
	};

	const onPasswordRepeatBlur = ({ target }) => {
  		setErrorRepeatPassword(validatePasswordRepeatOnBlur(target.value, formData.password));
	};

	return (
		<div className={styles.formContainer}>
			<form onSubmit={onSubmit} className={styles.formGroup}>
				{errorEmail && <div className={styles.formError}>{errorEmail}</div>}
				<input className={styles.formInput}
				label="Email"
				type="email"
				name="email"
				placeholder="Введите почту"
				value={formData.email}
				onChange={onEmailChange}
				onBlur={onEmailBlur}
				/>
				{errorPassword && <div className={styles.formError}>{errorPassword}</div>}
				<input className={styles.formInput}
				label="Password"
				type="password"
				name="password"
				placeholder="Введите пароль"
				value={formData.password}
				onChange={onPasswordChange}
				onBlur={onPasswordBlur}
				/>
				{errorRepeatPassword && <div className={styles.formError}>{errorRepeatPassword}</div>}

				{formData.password  && (
          		<div className={styles.passwordStrength}>
              		<div
                		className={`${styles.strengthFill} ${passwordStrength.class}`}
                		style={{ width: `${passwordStrength.width}%` }}
              		/>
          		</div>
        		)}

				<input className={styles.formInput}
				label="Repeat password"
				type="password"
				name="repeatPassword"
				placeholder="Подтвердите пароль"
				value={formData.repeatPassword}
				onChange={onRepeatPasswordChange}
				onBlur={onPasswordRepeatBlur}
				/>
				<button ref={submitButtonRef}
				className={styles.submitButton}
				type="submit"
				disabled={!isFormValid()}>Зарегистрироваться</button>
			</form>
		</div>
	);
};
