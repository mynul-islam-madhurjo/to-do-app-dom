const Storage = {
    save(tasks) {
        localStorage.setItem('todos', JSON.stringify(tasks));
    },

    load() {
        const tasks = localStorage.getItem('todos');
        return tasks ? JSON.parse(tasks) : [];
    }
};