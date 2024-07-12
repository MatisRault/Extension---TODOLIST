document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('item');
    const saveButton = document.getElementById('Valider');
    const loadButton = document.getElementById('Afficher');
    const clearButton = document.getElementById('Effacer');
    const taskList = document.getElementById('taskList');
    const confirmationPopup = document.getElementById('confirmationPopup');
    const confirmDeleteButton = document.getElementById('confirmDelete');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    // Fonction pour ajouter une tâche à la liste avec des boutons
    function addTaskToList(task) {
        const li = document.createElement('li');
        li.textContent = task;

        const checkButton = document.createElement('button');
        checkButton.textContent = '✓';
        checkButton.classList.add('checkButton');
        checkButton.addEventListener('click', function() {
            li.classList.toggle('checked'); // Barrer le texte en cliquant sur le bouton
        });
        li.appendChild(checkButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '✗';
        deleteButton.classList.add('deleteButton');
        deleteButton.addEventListener('click', function() {
            li.remove(); // Supprimer la tâche de la liste
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

    // Fonction pour stocker la valeur de l'input
    saveButton.addEventListener('click', function() {
        const inputValue = textInput.value;
        if (inputValue) {
            chrome.storage.local.get({ tasks: [] }, function(result) {
                const tasks = result.tasks;
                tasks.push(inputValue);
                chrome.storage.local.set({ tasks: tasks }, function() {
                    console.log('Le texte a été stocké:', inputValue);
                    addTaskToList(inputValue); // Ajouter la tâche à la liste
                    textInput.value = ''; // Effacer l'input après l'enregistrement
                });
            });
        } else {
            console.log('Veuillez entrer un texte.');
        }
    });

    // Fonction pour afficher les tâches stockées
    loadButton.addEventListener('click', function() {
        taskList.innerHTML = ''; // Effacer la liste actuelle
        chrome.storage.local.get(['tasks'], function(result) {
            const tasks = result.tasks || [];
            tasks.forEach(function(task) {
                addTaskToList(task); // Ajouter chaque tâche à la liste
            });
            console.log('Les tâches ont été chargées:', tasks);
        });
    });

    // Écouteur d'événement pour le bouton "Effacer les tâches"
    clearButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'block'; // Afficher le popup de confirmation
    });

    // Écouteur d'événement pour le bouton "Confirmer" dans le popup de confirmation
    confirmDeleteButton.addEventListener('click', function() {
        taskList.innerHTML = ''; // Efface toutes les tâches de l'interface
        chrome.storage.local.set({ tasks: [] }, function() {
            console.log('Toutes les tâches ont été supprimées.');
        });
        confirmationPopup.style.display = 'none'; // Cacher le popup de confirmation
    });

    // Écouteur d'événement pour le bouton "Annuler" dans le popup de confirmation
    cancelDeleteButton.addEventListener('click', function() {
        confirmationPopup.style.display = 'none'; // Cacher le popup de confirmation
    });
});
