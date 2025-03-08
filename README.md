# Monk Upsell & Cross-Sell

Monk Upsell & Cross-Sell is a platform designed for store owners to set up their e-commerce store efficiently. Store owners can search for products using the **Product Picker**, add products along with their variants, apply discounts, and reorder products or variants using drag-and-drop functionality.

## Components

### ProductList
- Manages the list of products added by the store owner along with their variants.
- Displays added products using the **ProductDetailsRow** component.

### ProductDetailsRow
- Displays product details.
- Allows store owners to:
  - Select or edit an existing product.
  - Apply a discount to the product.
  - Remove a product from the list.

### ProductVariantRow
- Displays variant details.
- Allows store owners to:
  - Apply a discount to a specific variant.
  - Remove a variant from the list.

### ProductPicker
- Allows store owners to search for products.
- Initially, a default list of products is displayed.
- Owners can search and select multiple products at once.
- When a product is selected, all its variants are automatically added.
- If a specific variant is selected, only that variant (along with its product) is stored.
- Implements pagination:
  - Initially, 10 records are displayed.
  - Additional records load on scroll.

## Technologies Used

### Libraries
- **UI Library:** Material UI
- **API Integration:** Axios
- **Drag & Drop for Reordering:** dnd-kit

### Styling
- **SCSS**

## Functionalities

- Store owners can create multiple product instances using the **"Add Product"** button.
- Owners can select **single or multiple** products for a product instance by clicking the **edit icon**.
- Clicking the **edit icon** allows owners to select single or multiple products along with their variants.
- Owners can **apply discounts** to products.
  - If no discount is applied to variants, applying a discount to the product automatically applies it to all variants (for the first time).
- Owners can **show/hide variants**.
- Discounts can be applied to **individual variants** as well.
- Owners can **remove products or variants** from the list.
- **Drag & drop functionality** allows reordering of products and variants.
