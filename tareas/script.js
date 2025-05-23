// DOM references
const welcomeScreen = document.getElementById('welcomeScreen');
const usernameInput = document.getElementById('usernameInput');
const startBtn = document.getElementById('startBtn');
const greetingMessage = document.getElementById('greetingMessage');
const app = document.getElementById('app');
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

// Show greeting, then app
function showGreeting(name) {
  greetingMessage.textContent = `Hello, ${name}!`;
  greetingMessage.style.opacity = '1';
  greetingMessage.style.animation = 'fadeInOut 3s forwards';

  setTimeout(() => {
    greetingMessage.style.opacity = '0';
    greetingMessage.style.animation = 'none';
    greetingMessage.textContent = '';
    app.classList.remove('hidden');
  }, 3000);
}

// Animate header text letter by letter
function animateHeaderText() {
  const header = document.querySelector('.intro-text');
  const text = header.textContent;
  header.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.textContent = text[i];
    span.style.animationDelay = `${i * 0.3}s`;
    header.appendChild(span);
  }
}

// Save/load tasks localStorage
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasksStr = localStorage.getItem('tasks');
  return tasksStr ? JSON.parse(tasksStr) : [];
}

// Render tasks list
function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = '';

  tasks.forEach(({ text, completed }, index) => {
    const li = document.createElement('li');
    li.textContent = text;
    li.tabIndex = 0;
    if (completed) {
      li.classList.add('completed');
    }

    // Toggle complete
    li.addEventListener('click', () => {
      if (li.classList.contains('completed')) return;
      li.classList.add('completed');
      tasks[index].completed = true;
      saveTasks(tasks);
    });

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.classList.add('delete-btn');
    delBtn.textContent = '×';
    delBtn.title = 'Delete Task';
    delBtn.setAttribute('aria-label', `Delete task: ${text}`);

    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks();
      showCheckmark(delBtn);
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Add task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;
  const tasks = loadTasks();
  tasks.push({ text, completed: false });
  saveTasks(tasks);
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
  showCheckmark(addTaskBtn);
}

// Show small checkmark animation near button
function showCheckmark(button) {
  let check = document.createElement('div');
  check.className = 'checkmark show';
  check.textContent = '✓';

  // Position checkmark relative to button
  const rect = button.getBoundingClientRect();
  check.style.position = 'fixed';
  check.style.top = `${rect.top + rect.height / 2 - 9}px`;
  check.style.left = `${rect.left + rect.width / 2 - 9}px`;

  document.body.appendChild(check);

  // Remove after 2 seconds
  setTimeout(() => {
    check.classList.remove('show');
    document.body.removeChild(check);
  }, 2000);
}

// Start button click
startBtn.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if (!name) {
    usernameInput.focus();
    return;
  }
  localStorage.setItem('username', name);
  welcomeScreen.style.display = 'none';
  showGreeting(name);
});

// Enter key on username input triggers start
usernameInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') startBtn.click();
});

// Add task button click
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

// On page load
window.addEventListener('DOMContentLoaded', () => {
  animateHeaderText();

  const savedName = localStorage.getItem('username');
  if (savedName) {
    welcomeScreen.style.display = 'none';
    showGreeting(savedName);
  }

  renderTasks();
});

// Fade in/out animation for greeting
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInOut {
  0% { opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; }
}
`;
document.head.appendChild(style);
