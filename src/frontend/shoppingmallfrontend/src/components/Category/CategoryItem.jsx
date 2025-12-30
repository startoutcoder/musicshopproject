import React, { useState } from 'react';

const CategoryItem = ({ category, selectedCategory, onCategorySelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const isSelected = selectedCategory?.categoryId === category.categoryId;

    const handleCategoryClick = () => {
        onCategorySelect(category);
        setIsOpen(!isOpen);
    };

    return (
        <li className={`category-tree-item ${isSelected ? 'active' : ''}`}>
            <div className="category-name" onClick={handleCategoryClick}>
                {category.categoryName}
                {category.children && category.children.length > 0 && (
                    <span className={`arrow ${isOpen ? 'open' : ''}`}>›</span>
                )}
            </div>
            {isOpen && category.children && category.children.length > 0 && (
                <ul className="subcategory-list">
                    {category.children.map(child => (
                        <CategoryItem
                            key={child.categoryId}
                            category={child}
                            selectedCategory={selectedCategory}
                            onCategorySelect={onCategorySelect}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default CategoryItem;
