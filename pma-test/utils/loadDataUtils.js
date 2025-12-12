export const getCategoryName = (categories, categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.title : 'Unknown Category';
};