const TodoApp = {
    // Get DOM elements using querySelector
    elements: {
        input: document.querySelector('.task-input'),
        addBtn: document.querySelector('.add-btn'),
        list: document.querySelector('.todo-list')
    },

    // Store tasks
    tasks: [],

    // Initialize app
    init() {
        // Load saved tasks
        this.tasks = Storage.load();
        this.displayTasks();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Add task events
        this.elements.addBtn.addEventListener('click', () => this.addTask());
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // List click events (for delete and toggle)
        this.elements.list.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            // Handle delete button click
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(todoItem);
            }
            // Handle click on todo item (toggle complete)
            else if (e.target.classList.contains('todo-text')) {
                this.toggleTask(todoItem);
            }
        });
    },

    // Add new task
    addTask() {
        const text = this.elements.input.value.trim();
        if (!text) return;

        // Create new task
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };

        // Add task to array
        this.tasks.push(task);
        this.saveAndDisplay();
        this.elements.input.value = '';
    },

    // Delete task
    deleteTask(todoItem) {
        const taskId = Number(todoItem.dataset.id);
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveAndDisplay();
    },

    // Toggle task complete status
    toggleTask(todoItem) {
        const taskId = Number(todoItem.dataset.id);
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveAndDisplay();
        }
    },

    // Save tasks and update display
    saveAndDisplay() {
        Storage.save(this.tasks);
        this.displayTasks();
    },

    // Display all tasks
    displayTasks() {
        this.elements.list.innerHTML = '';

        // Create and add task elements
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;

            li.innerHTML = `
                <span class="todo-text">${task.text}</span>
                <button class="delete-btn">Delete</button>
            `;

            this.elements.list.appendChild(li);
        });
    }
};

// Start app when page loads
document.addEventListener('DOMContentLoaded', () => TodoApp.init());