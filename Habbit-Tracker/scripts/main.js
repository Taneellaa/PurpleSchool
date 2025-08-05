'use strict';

//Переменные, используемые в глобальном контексте
let habbits = [];
let globalActiveHabbitId = null;
const HABBIT_KEY = 'habbits';
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    pageTitle: document.querySelector('.title'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
  content: {
    habbitsList: document.querySelector('.habbits__list'),
  },
  form: {
    formElement: document.querySelector('.habbit__form'),
    input: document.querySelector('.habbit__input'),
  },
};

const loadData = () => {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitsArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitsArray)) {
    habbits = habbitsArray;
  }
};

const saveData = () => {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
};

// Исправленная функция добавления привычки
const addHabbit = (event) => {
  event.preventDefault();
  const form = event.target;
  const data = new FormData(form);
  const comment = data.get('comment').trim();

  if (!comment) {
    alert('Введите комментарий');
    return;
  }

  // Находим активную привычку
  const activeHabbit = habbits.find(
    (habbit) => habbit.id === globalActiveHabbitId
  );
  if (activeHabbit) {
    activeHabbit.days.push({ comment: comment });
    saveData();
    rereneder(globalActiveHabbitId);
    form.reset(); // Очищаем форму
  }
};

const rerenderMenu = (activeHabbit) => {
  // Очищаем меню перед рендером
  page.menu.innerHTML = '';

  for (const habbit of habbits) {
    const element = document.createElement('button');
    element.setAttribute('menu-habbit-id', habbit.id);
    element.classList.add('menu__item');
    element.addEventListener('click', () => rereneder(habbit.id));
    element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}">`;

    if (activeHabbit.id === habbit.id) {
      element.classList.add('menu__item__active');
    }

    page.menu.appendChild(element);
  }
};

const rerenderHead = (activeHabbit) => {
  page.header.pageTitle.textContent = activeHabbit.name;

  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.textContent = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
};

const rerenderContent = (activeHabbit) => {
  page.content.habbitsList.innerHTML = '';

  for (const index in activeHabbit.days) {
    const habbitElement = document.createElement('li');
    habbitElement.classList.add('habbit');
    habbitElement.innerHTML = `
      <div class="habbit__day">День ${Number(index) + 1}</div>
      <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
      <button class="habbit__delete" onclick="deleteDay(${
        activeHabbit.id
      }, ${index})">
        <img src="./images/delete.svg" alt="Удалить день ${Number(index) + 1}">
      </button>
    `;
    page.content.habbitsList.appendChild(habbitElement);
  }

  const formElement = document.createElement('li');
  formElement.classList.add('habbit');
  formElement.innerHTML = `
    <div class="habbit__day">День ${activeHabbit.days.length + 1}</div>
    <form class="habbit__form">
      <input class="habbit__input input_icon" type="text" placeholder="Комментарий" name="comment">
      <img class="input__icon" src="./images/comment.svg" alt="Иконка комментария">
      <button class="habbit__save" type="submit">Готово</button>
    </form>
  `;

  // Добавляем обработчик события для новой формы
  const form = formElement.querySelector('.habbit__form');
  form.addEventListener('submit', addHabbit);

  page.content.habbitsList.appendChild(formElement);
};

// Исправленная функция удаления дня
const deleteDay = (habbitId, dayIndex) => {
  const habbit = habbits.find((h) => h.id === habbitId);
  if (habbit) {
    habbit.days.splice(dayIndex, 1);
    saveData();
    rereneder(habbitId);
  }
};

// Исправленная функция удаления привычки
const deleteHabbit = (habbitId) => {
  const index = habbits.findIndex((item) => item.id === habbitId);
  if (index !== -1) {
    habbits.splice(index, 1);
    saveData();

    if (habbits.length > 0) {
      rereneder(habbits[0].id);
    } else {
      page.header.pageTitle.textContent = '';
      page.header.progressPercent.textContent = '0%';
      page.header.progressCoverBar.style.width = '0%';
      page.content.habbitsList.innerHTML = '';
      page.menu.innerHTML = '';
    }
  }
};

const rereneder = (activeHabbitId) => {
  globalActiveHabbitId = activeHabbitId; 
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);

  if (!activeHabbit) {
    return;
  }

  rerenderHead(activeHabbit);
  rerenderMenu(activeHabbit);
  rerenderContent(activeHabbit);
};

// Инициализация
(() => {
  loadData();
  if (habbits.length > 0) {
    rereneder(habbits[0].id);
  }
})();
