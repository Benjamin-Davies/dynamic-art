const warn = document.createElement('div');
warn.className = 'warn';
warn.innerText =
  'Your browser does not support ES6 modules. Please update or use a more modern browser (Google Chrome recommended).';

document.getElementById('intro').appendChild(warn);
