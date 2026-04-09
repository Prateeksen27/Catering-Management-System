/**
 * Automatic Grocery Calculation Utility
 * Calculates required ingredients based on menu items and guest count
 */

import MenuItem from "../models/menu.model.js";

/**
 * Calculate required ingredients for a menu based on guest count
 * @param {Array} menuItems - Array of menu item names
 * @param {number} guestCount - Number of guests
 * @returns {Array} - Array of calculated ingredients
 */
export const calculateGroceryRequirements = async (menuItems, guestCount) => {
  const ingredientMap = new Map();
  
  // Fetch all menu items that have ingredient ratios
  const menuDocs = await MenuItem.find({
    name: { $in: menuItems },
    autoCalculateEnabled: true
  });
  
  // Process each menu item
  menuDocs.forEach(menuDoc => {
    if (menuDoc.ingredientRatios && menuDoc.ingredientRatios.length > 0) {
      menuDoc.ingredientRatios.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        
        if (ingredientMap.has(key)) {
          // Aggregate quantities
          const existing = ingredientMap.get(key);
          existing.quantity += ingredient.quantityPerPerson * guestCount;
        } else {
          // Add new ingredient
          ingredientMap.set(key, {
            ingredientName: ingredient.name,
            quantity: ingredient.quantityPerPerson * guestCount,
            unit: ingredient.unit,
            category: ingredient.category,
            sourceMenu: menuDoc.name
          });
        }
      });
    }
  });
  
  // Convert map to array and round values
  const calculatedIngredients = Array.from(ingredientMap.values()).map(item => ({
    ...item,
    quantity: Math.ceil(item.quantity * 100) / 100 // Round to 2 decimal places
  }));
  
  return calculatedIngredients;
};

/**
 * Get estimated cost for a list of ingredients
 * @param {Array} ingredients - Array of ingredients
 * @param {number} costPerUnit - Cost per unit (optional)
 * @returns {number} - Estimated total cost
 */
export const estimateGroceryCost = (ingredients, costPerUnit = 0) => {
  // Default cost estimation based on ingredient type
  const defaultCosts = {
    'chicken': 300, // per kg
    'mutton': 500,
    'paneer': 400,
    'rice': 50,
    'wheat': 30,
    'oil': 150,
    'vegetables': 40,
    'spices': 200,
    'dairy': 60,
    'default': 100
  };
  
  let totalCost = 0;
  
  ingredients.forEach(ingredient => {
    const name = ingredient.ingredientName.toLowerCase();
    let unitCost = costPerUnit;
    
    if (!unitCost) {
      // Find matching default cost
      for (const [key, cost] of Object.entries(defaultCosts)) {
        if (name.includes(key)) {
          unitCost = cost;
          break;
        }
      }
      if (!unitCost) unitCost = defaultCosts.default;
    }
    
    totalCost += ingredient.quantity * unitCost;
  });
  
  return totalCost;
};

/**
 * Get menu items with their ingredient breakdown
 * @param {Array} menuItems - Array of menu item names
 * @returns {Array} - Detailed ingredient list by menu item
 */
export const getMenuIngredientBreakdown = async (menuItems) => {
  const breakdown = [];
  
  const menuDocs = await MenuItem.find({
    name: { $in: menuItems }
  });
  
  menuDocs.forEach(menuDoc => {
    breakdown.push({
      menuItem: menuDoc.name,
      category: menuDoc.category,
      type: menuDoc.type,
      ingredients: menuDoc.ingredientRatios || []
    });
  });
  
  return breakdown;
};

/**
 * Validate ingredient availability
 * @param {Array} requiredIngredients - Array of required ingredients
 * @param {Array} inventory - Array of inventory items
 * @returns {Object} - Validation results with purchase requirements
 */
export const validateIngredientAvailability = async (requiredIngredients) => {
  const Inventory = (await import('../models/store.model.js')).StoreItem;
  
  const purchaseRequirements = [];
  const availableIngredients = [];
  
  for (const required of requiredIngredients) {
    // Search inventory for matching ingredient
    const inventoryItem = await Inventory.findOne({
      $or: [
        { name: { $regex: new RegExp(required.ingredientName, 'i') } },
        { itemName: { $regex: new RegExp(required.ingredientName, 'i') } }
      ]
    });
    
    if (inventoryItem) {
      const availableQty = inventoryItem.current_stock || 0;
      const requiredQty = required.quantity;
      
      if (availableQty >= requiredQty) {
        availableIngredients.push({
          ...required,
          availableQty,
          sufficient: true,
          inventoryItemId: inventoryItem._id
        });
      } else {
        purchaseRequirements.push({
          ingredientName: required.ingredientName,
          requiredQty,
          availableQty,
          purchaseNeeded: requiredQty - availableQty,
          unit: required.unit,
          status: 'Pending',
          inventoryItemId: inventoryItem._id
        });
      }
    } else {
      // Item not in inventory - needs to be purchased
      purchaseRequirements.push({
        ingredientName: required.ingredientName,
        requiredQty: required.quantity,
        availableQty: 0,
        purchaseNeeded: required.quantity,
        unit: required.unit,
        status: 'Not Available',
        inventoryItemId: null
      });
    }
  }
  
  return {
    availableIngredients,
    purchaseRequirements,
    totalPurchaseNeeded: purchaseRequirements.length,
    allAvailable: purchaseRequirements.length === 0
  };
};

/**
 * Convert between units
 * @param {number} value - Value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {number} - Converted value
 */
export const convertUnit = (value, fromUnit, toUnit) => {
  const conversions = {
    'kg_to_g': 1000,
    'g_to_kg': 0.001,
    'litres_to_ml': 1000,
    'ml_to_litres': 0.001,
    'dozen_to_pieces': 12,
    'pieces_to_dozen': 1/12
  };
  
  const key = `${fromUnit}_to_${toUnit}`;
  return conversions[key] ? value * conversions[key] : value;
};

export default {
  calculateGroceryRequirements,
  estimateGroceryCost,
  getMenuIngredientBreakdown,
  validateIngredientAvailability,
  convertUnit
};
