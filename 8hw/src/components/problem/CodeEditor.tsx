import React, { useState, useEffect, useRef } from 'react';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/prism';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';

interface CodeEditorProps {
  problemId: string;
}

type ProgrammingLanguage = 'javascript' | 'python' | 'java';

interface LanguageTemplate {
  defaultCode: string;
  syntax: string;
}

const languageTemplates: Record<ProgrammingLanguage, LanguageTemplate> = {
  javascript: {
    defaultCode: '// Введите ваше решение здесь\n\nfunction solution(input) {\n  // Ваш код\n  return;\n}',
    syntax: 'javascript'
  },
  python: {
    defaultCode: '# Введите ваше решение здесь\n\ndef solution(input):\n    # Ваш код\n    pass',
    syntax: 'python'
  },
  java: {
    defaultCode: '// Введите ваше решение здесь\n\npublic class Solution {\n    public static void main(String[] args) {\n        // Ваш код\n    }\n}',
    syntax: 'java'
  }
};

const CodeEditor: React.FC<CodeEditorProps> = ({ problemId }) => {
  // Получаем сохраненный язык и код из localStorage или используем значения по умолчанию
  const [language, setLanguage] = useState<ProgrammingLanguage>(() => {
    const savedLanguage = localStorage.getItem(`code-language-${problemId}`);
    return (savedLanguage as ProgrammingLanguage) || 'javascript';
  });
  
  const [code, setCode] = useState<string>(() => {
    const savedCode = localStorage.getItem(`code-${problemId}-${language}`);
    return savedCode || languageTemplates[language].defaultCode;
  });
  
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [editorHeight, setEditorHeight] = useState<number>(() => {
    const savedHeight = localStorage.getItem(`editor-height-${problemId}`);
    return savedHeight ? parseInt(savedHeight, 10) : 300; // Высота по умолчанию 300px
  });
  
  const codeRef = useRef<HTMLPreElement>(null);
  const resizeStartYRef = useRef<number | null>(null);
  const initialHeightRef = useRef<number>(editorHeight);

  // Сохраняем выбранный язык в localStorage при его изменении
  useEffect(() => {
    localStorage.setItem(`code-language-${problemId}`, language);
    
    // Проверяем, есть ли сохраненный код для этого языка
    const savedCode = localStorage.getItem(`code-${problemId}-${language}`);
    if (!savedCode) {
      // Если нет, устанавливаем шаблон по умолчанию
      setCode(languageTemplates[language].defaultCode);
    } else {
      // Если есть, используем сохраненный код
      setCode(savedCode);
    }
  }, [language, problemId]);
  
  useEffect(() => {
    // Подсветка синтаксиса при изменении кода или языка
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    // Сохраняем код в localStorage
    localStorage.setItem(`code-${problemId}-${language}`, newCode);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    try {
      // Симуляция выполнения кода с учетом выбранного языка
      setTimeout(() => {
        try {
          // Простая симуляция выполнения кода с разными результатами для разных языков
          let result = '';
          
          switch (language) {
            case 'javascript':
              result = 'Результат выполнения JavaScript:\n> console.log("Hello, World!")\nHello, World!\n\n> Время выполнения: 42ms';
              break;
            case 'python':
              result = 'Результат выполнения Python:\n>>> print("Hello, World!")\nHello, World!\n\n>>> Время выполнения: 38ms';
              break;
            case 'java':
              result = 'Результат выполнения Java:\nHello, World!\n\nВремя выполнения: 156ms';
              break;
            default:
              result = 'Результат выполнения:\nHello, World!';
          }
          
          setOutput(result);
        } catch (error) {
          setOutput(`Ошибка выполнения: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setIsRunning(false);
        }
      }, 1500);
    } catch (error) {
      setOutput(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
      setIsRunning(false);
    }
  };
  
  const submitSolution = async () => {
    setIsSubmitting(true);
    setOutput('');
    
    try {
      // Симуляция отправки решения с разными результатами
      setTimeout(() => {
        try {
          // Симуляция проверки решения с 80% вероятностью успеха
          const isSuccess = Math.random() > 0.2;
          
          if (isSuccess) {
            setOutput(
              'Решение принято!\n' +
              '✅ Тест 1: Пройден\n' +
              '✅ Тест 2: Пройден\n' +
              '✅ Тест 3: Пройден\n\n' +
              'Все тесты пройдены успешно.\n' +
              `Язык: ${language}\n` +
              'Время выполнения: 78ms\n' +
              'Использовано памяти: 5.2MB'
            );
          } else {
            // Симуляция ошибки в одном из тестов
            setOutput(
              'Решение не принято.\n' +
              '✅ Тест 1: Пройден\n' +
              '❌ Тест 2: Не пройден\n' +
              '  Ожидаемый результат: [1, 2, 3]\n' +
              '  Полученный результат: [1, 3, 2]\n' +
              '✅ Тест 3: Пройден\n\n' +
              'Исправьте ошибки и попробуйте снова.'
            );
          }
        } catch (error) {
          setOutput(`Ошибка при проверке решения: ${error instanceof Error ? error.message : String(error)}`);
        } finally {
          setIsSubmitting(false);
        }
      }, 2000);
    } catch (error) {
      setOutput(`Ошибка: ${error instanceof Error ? error.message : String(error)}`);
      setIsSubmitting(false);
    }
  };

  const clearOutput = () => {
    setOutput('');
  };
  
  // Обработчики для изменения размера редактора
  const handleResizeStart = (e: React.MouseEvent) => {
    resizeStartYRef.current = e.clientY;
    initialHeightRef.current = editorHeight;
    
    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (resizeStartYRef.current !== null) {
        const deltaY = moveEvent.clientY - resizeStartYRef.current;
        const newHeight = Math.max(100, initialHeightRef.current + deltaY); // Минимальная высота 100px
        setEditorHeight(newHeight);
      }
    };
    
    const handleResizeEnd = () => {
      resizeStartYRef.current = null;
      // Сохраняем высоту в localStorage
      localStorage.setItem(`editor-height-${problemId}`, editorHeight.toString());
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md">
      <div className="flex justify-between items-center p-4 bg-gray-100">
        <div className="flex items-center space-x-4">
          <div className="font-medium">Язык:</div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as ProgrammingLanguage)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>
        <div className="space-x-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className={`px-4 py-2 rounded-md ${isRunning ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            {isRunning ? 'Выполнение...' : 'Запустить'}
          </button>
          <button
            onClick={submitSolution}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${isSubmitting ? 'bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить'}
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative mb-4">
          <pre ref={codeRef} className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none p-4 m-0">
            <code className={`language-${languageTemplates[language].syntax}`}>{code}</code>
          </pre>
          <textarea
            value={code}
            onChange={handleCodeChange}
            style={{ height: `${editorHeight}px` }}
            className="w-full p-4 font-mono text-sm bg-transparent text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10 caret-white"
            spellCheck="false"
            placeholder={`Введите ваш код на ${language}...`}
          />
          <div 
            className="h-2 w-full bg-gray-700 cursor-ns-resize hover:bg-gray-600 transition-colors"
            onMouseDown={handleResizeStart}
            title="Изменить размер редактора"
          />
        </div>
        
        <div className="bg-gray-800 rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-700 text-white">
            <div className="font-medium">Вывод</div>
            {output && (
              <button 
                onClick={clearOutput}
                className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded text-gray-200"
              >
                Очистить
              </button>
            )}
          </div>
          <div className="p-4 min-h-[100px] max-h-64 overflow-auto">
            {output ? (
              <pre className="whitespace-pre-wrap text-white font-mono text-sm">
                {output}
              </pre>
            ) : (
              <div className="text-gray-400 italic text-sm">Здесь будет отображаться результат выполнения кода</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;