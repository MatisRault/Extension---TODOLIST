document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('item');
    const saveButton = document.getElementById('Valider');
    const loadButton = document.getElementById('Afficher');
    const clearButton = document.getElementById('Effacer');
    const taskList = document.getElementById('taskList');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    function addTaskToList(task) {
        const li = document.createElement('li');
        li.textContent = task;

        const checkButton = document.createElement('button');
        checkButton.textContent = '✓';
        checkButton.classList.add('checkButton');
        checkButton.addEventListener('click', function() {
            li.classList.toggle('checked'); 
        });
        li.appendChild(checkButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✗';
        deleteButton.classList.add('deleteButton');
        deleteButton.addEventListener('click', function() {
            li.remove();
            chrome.storage.local.get({ tasks: [] }, function(result) {
                const tasks = result.tasks.filter(t => t !== task);
                chrome.storage.local.set({ tasks: tasks }, function() {
                    console.log('La tâche a été supprimée:', task);
                });
            });
        });
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    }

    saveButton.addEventListener('click', function() {
        const inputValue = textInput.value;
        if (inputValue) {
            chrome.storage.local.get({ tasks: [] }, function(result) {
                const tasks = result.tasks;
                tasks.push(inputValue);
                chrome.storage.local.set({ tasks: tasks }, function() {
                    console.log('Le texte a été stocké:', inputValue);
                    addTaskToList(inputValue); 
                    textInput.value = ''; 
                });
            });
        } else {
            console.log('Veuillez entrer un texte.');
        }
    });

    loadButton.addEventListener('click', function() {
        taskList.innerHTML = ''; 
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.forEach(function(task) {
                addTaskToList(task); 
            });
            console.log('Les tâches ont été chargées:', tasks);
        });
    });

    clearButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'block'; 
    });

    confirmDeleteButton.addEventListener('click', function() {
        taskList.innerHTML = ''; 
        chrome.storage.local.set({ tasks: [] }, function() {
            console.log('Toutes les tâches ont été supprimées.');
        });
        confirmationPopup.style.display = 'none'; 
    });

    cancelDeleteButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'none'; 
    });
});
