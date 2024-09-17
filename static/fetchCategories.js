function fetchCategories() {
    return fetch('categories/categories.json')
        .then(response => response.json())
        .then(data => data.categories)
        .catch(error => {
            console.error('Error loading categories:', error);
            return []; // Return an empty array in case of error
        });
}