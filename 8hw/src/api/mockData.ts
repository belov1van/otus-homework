import { Problem, User, Tag, Category } from '../types';

// Мок-данные для задач
export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Сумма двух чисел',
    description: 'Напишите функцию, которая принимает два числа и возвращает их сумму.',
    difficulty: 'easy',
    tags: ['Математика', 'Алгоритмы'],
    examples: [
      {
        input: '2, 3',
        output: '5',
        explanation: '2 + 3 = 5'
      },
      {
        input: '-1, 5',
        output: '4',
        explanation: '-1 + 5 = 4'
      }
    ]
  },
  {
    id: '2',
    title: 'Палиндром',
    description: 'Напишите функцию, которая проверяет, является ли строка палиндромом. Палиндром — это строка, которая читается одинаково слева направо и справа налево.',
    difficulty: 'medium',
    tags: ['Строки', 'Алгоритмы'],
    examples: [
      {
        input: '"radar"',
        output: 'true',
        explanation: '"radar" читается одинаково в обоих направлениях'
      },
      {
        input: '"hello"',
        output: 'false',
        explanation: '"hello" не читается одинаково в обоих направлениях'
      }
    ]
  },
  {
    id: '3',
    title: 'Поиск в отсортированном массиве',
    description: 'Реализуйте бинарный поиск в отсортированном массиве. Функция должна возвращать индекс элемента или -1, если элемент не найден.',
    difficulty: 'hard',
    tags: ['Массивы', 'Бинарный поиск', 'Алгоритмы'],
    examples: [
      {
        input: '[1, 2, 3, 4, 5], 3',
        output: '2',
        explanation: 'Элемент 3 находится на позиции с индексом 2'
      },
      {
        input: '[1, 2, 3, 4, 5], 6',
        output: '-1',
        explanation: 'Элемент 6 отсутствует в массиве'
      }
    ]
  }
];

// Мок-данные для пользователей
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'ivan_petrov',
    email: 'ivan@example.com',
    rating: 1500,
    solvedProblems: ['1', '2']
  },
  {
    id: '2',
    username: 'elena_smirnova',
    email: 'elena@example.com',
    rating: 1800,
    solvedProblems: ['1', '2', '3']
  },
  {
    id: '3',
    username: 'alex_ivanov',
    email: 'alex@example.com',
    rating: 1200,
    solvedProblems: ['1']
  }
];

// Мок-данные для тегов
export const mockTags: Tag[] = [
  { id: '1', name: 'Алгоритмы' },
  { id: '2', name: 'Строки' },
  { id: '3', name: 'Массивы' },
  { id: '4', name: 'Математика' },
  { id: '5', name: 'Бинарный поиск' },
  { id: '6', name: 'Динамическое программирование' },
  { id: '7', name: 'Графы' }
];

// Мок-данные для категорий
export const mockCategories: Category[] = [
  { id: '1', name: 'Базовые алгоритмы', problems: ['1', '2'] },
  { id: '2', name: 'Структуры данных', problems: ['3'] },
  { id: '3', name: 'Продвинутые алгоритмы', problems: [] }
];