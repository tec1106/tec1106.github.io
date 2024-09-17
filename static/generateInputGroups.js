function generateInputGroups(categories, updateChart) {

    const inputMin = '0';
    const inputMax = '10';
    const inputDefault = '5';
    const goalDefault = '5';
    const inputStep = '1';

    const inputsContainer = document.getElementById('inputsContainer');

    console.log(categories)

    categories.forEach(category => {
        console.log(category);
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';

        const labelGroup = document.createElement('div');
        labelGroup.className = 'label-group';

        const questionMark = document.createElement('span');
        questionMark.className = 'question-mark';
        questionMark.textContent = '?';
        questionMark.addEventListener('click', () => showModal(category));

        const label = document.createElement('label');
        const firstWord = category.split(/[ ,]+/)[0].toLowerCase();
        label.htmlFor = firstWord;
        label.textContent = category;

        const currentInput = document.createElement('input');
        currentInput.type = 'number';
        currentInput.id = `${firstWord}-value`;
        currentInput.min = inputMin;
        currentInput.max = inputMax;
        currentInput.value = inputDefault;

        const currentRange = document.createElement('input');
        currentRange.type = 'range';
        currentRange.id = firstWord;
        currentRange.min = inputMin;
        currentRange.max = inputMax;
        currentRange.value = inputDefault;
        currentRange.step = inputStep;

        const goalRange = document.createElement('input');
        goalRange.type = 'range';
        goalRange.id = `${firstWord}-goal`;
        goalRange.className = 'goalInput'
        goalRange.min = inputMin;
        goalRange.max = inputMax;
        goalRange.value = goalDefault;
        goalRange.step = inputStep;

        labelGroup.appendChild(questionMark);
        labelGroup.appendChild(label);
        labelGroup.appendChild(currentInput);
        inputGroup.appendChild(labelGroup);
        inputGroup.appendChild(currentRange);
        inputGroup.appendChild(goalRange);

        inputsContainer.appendChild(inputGroup);

        // Sync current sliders with number inputs
        currentRange.addEventListener('input', () => {
            currentInput.value = currentRange.value;
        });
        currentInput.addEventListener('input', () => {
            currentRange.value = currentInput.value;
        });

        // Update chart when sliders change
        currentRange.addEventListener('input', updateChart);
        goalRange.addEventListener('input', updateChart);
    });
}

function showModal(category) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.getElementsByClassName('close')[0];

    const firstWord = category.split(/[ ,]+/)[0].toLowerCase();
    fetch(`text/${firstWord}.md`)
        .then(response => response.text())
        .then(text => {
            modalContent.innerHTML = marked.parse(text);
            modal.style.display = 'block';
        })
        .catch(error => {
            console.error('Error loading markdown file:', error);
            modalContent.innerHTML = 'Error loading content.';
            modal.style.display = 'block';
        });

    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
}