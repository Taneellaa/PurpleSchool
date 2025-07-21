'use strict';

//Переменные, используемые в глобальном контексте
let habbits = [];
const HABBIT_KEY = 'habbits';
const page = {
  menu: document.querySelector('.menu__list'),
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

const renderMenu = (activeHabbit) => {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelectorAll(
      `[menu-habbit-id="${habbit.id}"]`
    );
    if (!existed) {
      const element = document.createElement('button');
      element.setAttribute('menu-habbit-id', habbit.id);
      element.classList.add('menu__item');
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}">`;
      page.menu.appendChild(element);
      if (activeHabbit.id === habbit.id) {
        existed.classList.add('menu__item__active');
      }
      continue;
    }

    if (activeHabbit.id === habbit.id) {
      existed.classList.add('menu__item__active');
    } else {
      existed.classList.remove('menu__item__active');
    }
  }
};

const rereneder = (activeHabbitId) => {
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
};

//init
(() => {
  loadData();
})();
