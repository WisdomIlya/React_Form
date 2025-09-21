import { PASSWORD_STRENGTH } from '../../constants';

export const validateEmail = (email) => {
	if (!email) return 'Email обязателен для заполнения';
	if (email.length > 20) return 'Email слишком длинный';
	if (email.indexOf('..') !== -1) return 'Email содержит две точки подряд';

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) return 'Введите корректный email адрес';

	return null;
};

export const validatePassword = (password) => {
	if (!password) return 'Пароль обязателен для заполнения';
	if (password.length < 8) return 'Пароль слишком короткий';
	return null;
};

export const validateRepeatPassword = (password, repeatPassword) => {
	if (!repeatPassword) return 'Подтверждение пароля обязательно';
	if (password !== repeatPassword) return 'Пароли не совпадают';
	return null;
};

export const calculatePasswordStrength = (password) => {
	if (!password) return { PASSWORD_STRENGTH };

	let strength = 0;

	if (password.length >= 8) strength += 2;
	else if (password.length >= 6) strength += 1;

	if (/[a-z]/.test(password)) strength += 1;
	if (/[A-Z]/.test(password)) strength += 1;
	if (/\d/.test(password)) strength += 1;
	if (/[^a-zA-Z\d]/.test(password)) strength += 2;

	if (strength <= 2) {
		return { width: 33, classType: 'strengthWeak' };
	} else if (strength <= 5) {
		return { width: 66, classType: 'strengthMedium' };
	} else {
		return { width: 100, classType: 'strengthStrong' };
	}
};
