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

        // Show validation message on input
        this.elements.input.addEventListener('invalid', (e) => {
            e.preventDefault();
            this.elements.input.classList.add('invalid');
        });

        // Remove validation styling when user starts typing
        this.elements.input.addEventListener('input', () => {
            this.elements.input.classList.remove('invalid');
        });

        // List click events (for delete and toggle)
        this.elements.list.addEventListener('click', (e) => {
            const todoItem = e.target.closest('.todo-item');
            if (!todoItem) return;

            // Get task ID
            const taskId = Number(todoItem.dataset.id);

            // Handle different button clicks
            if (e.target.classList.contains('delete-btn')) {
                this.deleteTask(taskId);
            } else if (e.target.classList.contains('edit-btn')) {
                this.editTask(todoItem, taskId);
            } else if (e.target.classList.contains('save-btn')) {
                this.saveEdit(todoItem, taskId);
            } else if (e.target.classList.contains('checkbox')) {
                this.toggleTask(taskId);
            }
        });
    },

    // Add new task
    addTask() {
        const text = this.elements.input.value.trim();

        // JavaScript validation
        if (!text) {
            this.elements.input.classList.add('invalid');
            this.elements.input.focus();
            return;
        }

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
        this.elements.input.classList.remove('invalid');
    },

    // Delete task
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveAndDisplay();
    },

    // Toggle task complete status
    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.saveAndDisplay();
        }
    },

    // Edit task
    editTask(todoItem, taskId) {
        const taskText = this.tasks.find(task => task.id === taskId).text;
        todoItem.innerHTML = `
            <input type="checkbox" class="checkbox" ${this.tasks.find(task => task.id === taskId).completed ? 'checked' : ''}>
            <input type="text" class="edit-input" value="${taskText}">
            <div class="todo-buttons">
                <button class="save-btn">Save</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    },

    // Save edited task
    saveEdit(todoItem, taskId) {
        const newText = todoItem.querySelector('.edit-input').value.trim();
        if (newText) {
            const task = this.tasks.find(task => task.id === taskId);
            if (task) {
                task.text = newText;
                this.saveAndDisplay();
            }
        }
    },

    // Save tasks and update display
    saveAndDisplay() {
        Storage.save(this.tasks);
        this.displayTasks();
    },

    // HTML for a single todo item
    createTodoItemHTML(task) {
        return `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
            <span class="todo-text">${task.text}</span>
            <div class="todo-buttons">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
    },

    // Display all tasks
    displayTasks() {
        // Clear current list
        this.elements.list.innerHTML = '';

        // Create and add task elements
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            li.dataset.id = task.id;
            li.innerHTML = this.createTodoItemHTML(task);
            this.elements.list.appendChild(li);
        });
    }
};

// Start app when page loads
document.addEventListener('DOMContentLoaded', () => TodoApp.init());