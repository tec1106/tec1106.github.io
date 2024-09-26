function promptForName() {
    const namePrompt = document.getElementById('namePrompt');
    const nameInput = document.getElementById('nameInput');
    const submitButton = document.getElementById('submitName');
    const chartTitle = document.getElementById('chartTitle');

    namePrompt.style.display = 'flex';
    document.getElementById("nameInput").focus();

    return new Promise((resolve) => {
        submitButton.addEventListener('click', function() {
            const userName = nameInput.value.trim();
            if (userName) {
                chartTitle.textContent = `${userName}'s ${title} Growth Bubble`;
                namePrompt.style.display = 'none';
                resolve(userName);  // return userName
            }
        });

        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitButton.click();
            }
        });
    });
}