export const validateEmailOnBlur = (emailValue) => {
	const newValue = emailValue;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!newValue) return('Email обязателен для заполнения');
	else if (!emailRegex.test(newValue)) return 'Введите корректный email адрес';
};

export const validatePasswordOnBlur = ( passwordValue ) => {
	if (passwordValue.length < 3)
		return 'Неверный пароль. Должно быть не менее 8 символов';
};

export const validatePasswordRepeatOnBlur = ( repeatPasswordValue , password ) => {
	const newValue = repeatPasswordValue;

	if (newValue !== password) return 'Пароли не совпадают';
	else return null;
};
