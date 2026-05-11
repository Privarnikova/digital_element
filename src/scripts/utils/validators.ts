
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isEmptyString = (value: string): boolean => value.trim().length === 0;


/**
 * Имя: только буквы (латиница и кириллица), пробелы, дефис.
 */
export const NAME_PATTERN = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,60}$/;

/**
 * Поддерживает международный формат, локальный российский формат и форматы с разделителями.
 */
export const PHONE_PATTERN = /^[+]?[\d\s\-()]{7,20}$/;
