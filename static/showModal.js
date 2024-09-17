function showModalx(category) {
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