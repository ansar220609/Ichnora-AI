# ICHNORA AI — Next-Gen FinTech Anti-Fraud System

![System Status](https://img.shields.io/badge/System-Active-00f2fe?style=for-the-badge)
![ML Engine](https://img.shields.io/badge/ML-Logistic_Regression_%2B_Log--Odds-blueviolet?style=for-the-badge)
![XAI Driven](https://img.shields.io/badge/XAI-Explainable_AI-success?style=for-the-badge)
![Demo](https://img.shields.io/badge/Live-GitHub_Pages-ff007f?style=for-the-badge)

**ICHNORA AI** — высокопроизводительная антифрод-платформа нового поколения, объединяющая сверхбыстрый ML-скоринг транзакций в реальном времени и технологии Explainable AI (XAI) для полной прозрачности решений перед офицерами безопасности.

 **[Запустить Live Demo (GitHub Pages)](https://ansar220609.github.io/Ichnora-AI/)**

---

##  Ключевые Возможности & Технологический Стек

- **High-Speed ML Scoring:** Логистическая регрессия, обученная на **100 000+ синтетических транзакций**, с математически точным интерпретированием факторов через **Log-Odds**.
- **Explainable AI (XAI):** Моментальная расшифровка триггеров риска без эффекта «чёрного ящика» — с детальным разбором аномалий, смен IP и геолокационных отклонений.
- **Интерактивная карта и Графы:** Полный оффлайн-визуализатор связей (Graph Analysis) и гео-карта с поддержкой всех **249 ISO-кодов стран и территорий**.
- **Real-Time Live Simulator:** Моделирование векторов атак (Социальная инженерия, Взлом аккаунта, Компрометация устройств, Клиент в поездке) за миллисекунды.
- **Обработка данных:** Полнофункциональный импорт/экспорт CSV-файлов, гибкий аудит операций, поиск по параметрам и кастомные фильтры.

---

##  Архитектура Проекта

Платформа спроектирована по принципу максимальной автономности и высокой скорости развертывания:

```text
├── index.html          # Главный интерфейс дашборда
├── app.js              # Бизнес-логика, контроллеры и рендеринг UI
├── core.js             # Математический движок ML-скоринга и Log-Odds анализа
├── app.css             # Темная кибер-безопасная тема UI/UX
├── world.js            # Геомодуль и оффлайн-карта мира
│
├── frontend/           # React/Vite заготовка (Модуль расширения v2)
└── backend/            # FastAPI микросервис (REST API заготовка)
```


##  Инструкция по запуску

1. Клонируйте репозиторий:
   ```bash
   git clone [https://github.com/ansar220609/Ichnora-AI.git](https://github.com/ansar220609/Ichnora-AI.git)
   cd Ichnora-AI
   ```

2. Запуск локального сервера (VS Code / Live Server)
Если вы используете расширение Live Server в VS Code:

   Нажмите правой кнопкой мыши по index.html в корне проекта.

   Выберите «Open with Live Server».

3. Запуск React/Vite версии (/frontend)
Если вы хотите запустить React-заготовку интерфейса:
```bash
cd frontend
npm install
npm run dev
```

4. Запуск FastAPI Backend (/backend)
Для запуска REST API сервера обработки транзакций:
```bash
cd backend
pip install fastapi uvicorn pydantic
uvicorn main:app --reload
```

5.Запуск автоматических тестов
```bash
npm install
npm test
```
