import { useState, useRef, useEffect } from 'react';
import styles from './App.module.css';
import { USER_FORM } from './constants';

const sendFormData = (formData, target) => {
	console.log(formData);
	console.log(target.value);
};

export const App = () => {
	const [formData, setFormData] = useState( USER_FORM );
	const [errorEmail, setEmailError] = useState(null);
	const [errorPassword, setErrorPassword] = useState(null);
	const [errorRepeatPassword, setErrorRepeatPassword] = useState(null);
	const [passwordStrength, setPasswordStrength] = useState({ width: 0, text: '', class: '' })

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
	const isValid = formData.email &&
    formData.password &&
    formData.repeatPassword &&
    !errorEmail &&
    !errorPassword &&
    !errorRepeatPassword &&
    formData.password === formData.repeatPassword;

    if (isValid && submitButtonRef.current) {
      const timer = setTimeout(() => {
        submitButtonRef.current.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  	}, [formData, errorEmail, errorPassword, errorRepeatPassword]);

	const onEmailChange = ({ target }) => {
		setFormData({...formData, email:target.value});

		let newEmailError = null;

		if (target.value.length > 20) newEmailError = 'Email слишком длинный';
  		else if (target.value.indexOf('..') !== -1) newEmailError = 'Email содержит две точки подряд';

		setEmailError(newEmailError);
	}

	const onPasswordChange = ({ target }) => {
		const newValue = target.value;
		setFormData({...formData, password:newValue});

		let newPasswordError = null;
		if (!newValue) newPasswordError = 'Пароль обязателен для заполнения';
		else if (newValue.length < 8) newPasswordError = 'Пароль слишком короткий';

		setErrorPassword(newPasswordError);

		const strength = calculatePasswordStrength( newValue );
    	setPasswordStrength(strength);
	}

	const calculatePasswordStrength = (password) => {
    if (!password) return { width: 0, text: '', class: '' };

    let strength = 0;

    if (password.length >= 8) strength += 2;
    else if (password.length >= 6) strength += 1;

    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 2;

    if (strength <= 2) {
      return { width: 33, text: 'Слабый', class: styles.strengthWeak };
    } else if (strength <= 5) {
      return { width: 66, text: 'Средний', class: styles.strengthMedium };
    } else {
      return { width: 100, text: 'Сильный', class: styles.strengthStrong };
    }
  	};

	const onRepeatPasswordChange = ({ target }) => {
		const newValue = target.value;
		setFormData(prev => ({...prev, repeatPassword: newValue}));
	}

	const onEmailBlur = ({ target }) => {
		const newValue = target.value;

		if (!newValue) setEmailError('Email обязателен для заполнения');
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(target.value)) setEmailError('Введите корректный email адрес');
	}

	const onPasswordBlur = ({ target }) => {
		if (target.value.length < 3) setErrorPassword('Неверный пароль. Должно быть не менее 8 символов');
	};

	const onPasswordRepeatBlur = ({ target }) => {
		const newValue = target.value;

		if (newValue !== formData.password) setErrorRepeatPassword('Пароли не совпадают');
		else setErrorRepeatPassword(null);
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
				disabled={!isFormValid()}>Зарегестрироваться</button>
			</form>
		</div>
	);
};
