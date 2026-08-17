const BASE_URL = 'https://dummyjson.com/products';

const BLOCKED_CATEGORIES = ['groceries', 'meat'];
const NON_VEG_KEYWORDS = ['pork', 'beef', 'chicken', 'fish', 'meat', 'seafood', 'bacon', 'sausage', 'lamb', 'steak'];

const isCleanProduct = (product) => {
  const isBlockedCategory = BLOCKED_CATEGORIES.includes((product.category || '').toLowerCase());
  const textToSearch = `${product.title || ''} ${product.description || ''}`.toLowerCase();
  const containsNonVeg = NON_VEG_KEYWORDS.some((keyword) => textToSearch.includes(keyword));
  return !isBlockedCategory && !containsNonVeg;
};

export const fetchProducts = async ({ limit = 12, skip = 0, search = '', category = '' }) => {
  let url = `${BASE_URL}?limit=${limit}&skip=${skip}`;

  if (search) {
    url = `${BASE_URL}/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
  } else if (category) {
    url = `${BASE_URL}/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to load products from server.');
  const data = await response.json();

  const filteredProducts = data.products.filter(isCleanProduct);

  return {
    ...data,
    products: filteredProducts,
  };
};

export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to load categories.');
  const data = await response.json();

  return data
    .map((c) => (typeof c === 'object' ? c.slug || c.name : c))
    .filter((catSlug) => !BLOCKED_CATEGORIES.includes(catSlug.toLowerCase()));
};