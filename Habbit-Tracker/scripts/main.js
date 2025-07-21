'use strict';

//Переменные, используемые в глобальном контексте
let habbits = [];
const HABBIT_KEY = 'habbits';
const page = {
  menu: document.querySelector('.menu__list'),
  header: {
    pageTitle: document.querySelector('.title'),
    progressPercent: document.querySelector('.progress__percent'),
    progressCoverBar: document.querySelector('.progress__cover-bar'),
  },
};

//utils
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

// Функции рендера, взаимодействия с DOM
const rerenderMenu = (activeHabbit) => {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelectorAll(
      `[menu-habbit-id="${habbit.id}"]`
    );
    if (existed.length === 0) {
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('menu__item');
      element.addEventListener('click', () => rereneder(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}">`;
      page.menu.appendChild(element);
      if (activeHabbit.id === habbit.id) {
        element.classList.add('menu__item__active');
      }
      continue;
    }

    if (activeHabbit.id === habbit.id) {
      existed[0].classList.add('menu__item__active');
    } else {
      existed[0].classList.remove('menu__item__active');
    }
  }
};

const rerenderHead = (activeHabbit) => {
  if (!activeHabbit) {
    return;
  }
  page.header.pageTitle.textContent = activeHabbit.name;

  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  console.log(progress);
  page.header.progressPercent.textContent = `${progress.toFixed(0)}%`;
  page.header.progressCoverBar.style.width = `${progress.toFixed(0)}%`;
};

const rereneder = (activeHabbitId) => {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  console.log(activeHabbit);
  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
};

//init
(() => {
  loadData();
  if (habbits.length > 0) {
    rereneder(habbits[0].id);
  }
})();
