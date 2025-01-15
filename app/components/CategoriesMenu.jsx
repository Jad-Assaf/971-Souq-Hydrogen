import React from 'react';

export function CategoriesMenu({ menuData, currentPath }) {
  if (!menuData?.items) return null;

  return (
    <div className="categories-menu">
      <h3 className="text-lg font-medium mb-4">Categories</h3>
      <ul className="space-y-2">
        {menuData.items.map((item) => {
          const isActive = currentPath.includes(item.url);
          const hasChildren = item.items && item.items.length > 0;

          return (
            <li key={item.id} className="menu-item nav-links">
              <Link
                to={item.url}
                className={`block py-2 ${isActive ? 'font-bold text-primary' : 'text-gray-700'}`}
              >
                {item.title}
              </Link>

              {hasChildren && (
                <ul className={`ml-4 space-y-1 ${isActive ? 'block' : 'hidden'}`}>
                  {item.items.map((subItem) => (
                    <li key={subItem.id}>
                      <Link
                        to={subItem.url}
                        className={`block py-1 text-sm ${currentPath.includes(subItem.url)
                            ? 'font-semibold text-primary'
                            : 'text-gray-600'
                          }`}
                      >
                        {subItem.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}