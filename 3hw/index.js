const fs = require('fs');
const { Transform, pipeline } = require('stream');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node index.js <input_file>');
  process.exit(1);
}

const inputFile = process.argv[2];
const outputFile = path.join(__dirname, 'output.json');

// Трансформ поток для разбивки на слова и фильтрации
class WordExtractStream extends Transform {
  constructor(options) {
    super({ ...options, readableObjectMode: true });
    this._lastChunk = '';
  }
  _transform(chunk, encoding, callback) {
    let data = this._lastChunk + chunk.toString();
    // Оставим только буквы и пробелы, заменим все остальное на пробел
    data = data.replace(/[^a-zA-Zа-яА-ЯёЁ0-9\s]/g, ' ');
    const words = data.split(/\s+/);
    // Последнее слово может быть неполным, сохраним его
    this._lastChunk = words.pop();
    for (const word of words) {
      if (word) this.push(word.toLowerCase());
    }
    callback();
  }
  _flush(callback) {
    if (this._lastChunk) {
      this.push(this._lastChunk.toLowerCase());
    }
    callback();
  }
}

// Трансформ поток для подсчета слов
class WordCountStream extends Transform {
  constructor(options) {
    super({ ...options, writableObjectMode: true });
    this.wordCounts = {};
  }
  _transform(word, encoding, callback) {
    this.wordCounts[word] = (this.wordCounts[word] || 0) + 1;
    callback();
  }
  _flush(callback) {
    // Сортируем слова по алфавиту
    const sortedWords = Object.keys(this.wordCounts).sort();
    // Формируем вектор
    const vector = sortedWords.map(word => this.wordCounts[word]);
    // Передаем вектор дальше
    this.push(JSON.stringify(vector));
    callback();
  }
}

pipeline(
  fs.createReadStream(inputFile),
  new WordExtractStream(),
  new WordCountStream(),
  fs.createWriteStream(outputFile),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Indexing complete. Output written to', outputFile);
    }
  }
); 