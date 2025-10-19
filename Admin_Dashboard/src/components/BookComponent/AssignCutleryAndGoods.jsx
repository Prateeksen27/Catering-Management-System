import React, { useState, useEffect } from 'react';
import { 
  MultiSelect, 
  Group, 
  Stack, 
  Text, 
  Box, 
  Title, 
  Paper, 
  Badge, 
  Button,
  Alert,
  ActionIcon,
  Card
} from '@mantine/core';
import { useStoreItemsStore } from '../../store/useItemsStore';
import { useDataStore } from '../../store/useDataStore';
import { IconPackage, IconRefresh, IconX, IconAlertCircle, IconCheck, IconPlus, IconMinus } from '@tabler/icons-react';

const AssignCutleryAndGoods = ({ onSelect }) => {
  const { storeItems, fetchStoreItems } = useStoreItemsStore();
  const { selectedGoods, setSelectedGoods, updateGoodsQuantity, clearSelectedGoods, getSelectedGoodsCount } = useDataStore();

  const [selectedNames, setSelectedNames] = useState({
    equipment: [],
    supplies: [],
    furniture: [],
  });

  const [quantityErrors, setQuantityErrors] = useState({});
  const [inputValues, setInputValues] = useState({}); // Track input values separately

  useEffect(() => {
    fetchStoreItems();
  }, []);

  // Sync input values with selectedGoods
  useEffect(() => {
    const newInputValues = {};
    Object.values(selectedGoods).forEach(category => {
      if (category && Array.isArray(category)) {
        category.forEach(item => {
          newInputValues[item.itemId] = item.quantity;
        });
      }
    });
    setInputValues(newInputValues);
  }, [selectedGoods]);

  // Validate quantity against available stock
  const validateQuantity = (category, itemId, quantity, itemName) => {
    const storeItem = groupByCategory(category).find(i => i.name === itemName);
    const maxStock = storeItem?.current_stock || 0;
    
    if (quantity > maxStock) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Cannot exceed available stock (${maxStock})`
      }));
      return false;
    } else if (quantity < 1) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: 'Quantity must be at least 1'
      }));
      return false;
    } else {
      setQuantityErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[itemId];
        return newErrors;
      });
      return true;
    }
  };

  // Convert item names to our data structure
  const handleSelection = (category, selectedItemNames) => {
    setSelectedNames(prev => ({ ...prev, [category]: selectedItemNames }));
    
    const itemsWithQuantities = selectedItemNames.map(itemName => {
      const item = groupByCategory(category).find(i => i.name === itemName);
      const existingItem = (selectedGoods[category] || []).find(i => i.itemName === itemName);
      
      return {
        itemId: item?._id || itemName,
        itemName: itemName,
        quantity: existingItem?.quantity || 1
      };
    });

    setSelectedGoods(category, itemsWithQuantities);
    
    if (onSelect) {
      onSelect({ ...selectedGoods, [category]: itemsWithQuantities });
    }
  };

  const handleQuantityChange = (category, itemId, newQuantity, itemName) => {
    console.log('🔄 Changing quantity:', { category, itemId, newQuantity, itemName });
    
    // Validate before updating
    if (validateQuantity(category, itemId, newQuantity, itemName)) {
      updateGoodsQuantity(category, itemId, newQuantity);
      
      // Get fresh state and call onSelect
      setTimeout(() => {
        const currentState = useDataStore.getState().selectedGoods;
        console.log('✅ Updated state:', currentState);
        if (onSelect) {
          onSelect(currentState);
        }
      }, 0);
    }
  };

  const handleIncrement = (category, itemId, currentQuantity, itemName) => {
    const storeItem = groupByCategory(category).find(i => i.name === itemName);
    const maxStock = storeItem?.current_stock || 0;
    const newQuantity = Math.min(currentQuantity + 1, maxStock);
    handleQuantityChange(category, itemId, newQuantity, itemName);
  };

  const handleDecrement = (category, itemId, currentQuantity, itemName) => {
    const newQuantity = Math.max(currentQuantity - 1, 1);
    handleQuantityChange(category, itemId, newQuantity, itemName);
  };

  const handleInputChange = (itemId, value) => {
    // Update the input value in local state
    const numericValue = parseInt(value) || 1;
    setInputValues(prev => ({
      ...prev,
      [itemId]: numericValue
    }));
  };

  const handleSetQuantity = (category, itemId, itemName) => {
    const currentValue = inputValues[itemId] || 1;
    handleQuantityChange(category, itemId, currentValue, itemName);
  };

  const handleRemoveItem = (category, itemId, itemName) => {
    // Remove from selected names
    const updatedNames = selectedNames[category].filter(name => name !== itemName);
    setSelectedNames(prev => ({ ...prev, [category]: updatedNames }));
    
    // Remove from selected goods
    const updatedGoods = (selectedGoods[category] || []).filter(item => item.itemId !== itemId);
    setSelectedGoods(category, updatedGoods);
    
    // Remove from input values and errors
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[itemId];
      return newValues;
    });
    
    setQuantityErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[itemId];
      return newErrors;
    });
    
    if (onSelect) {
      onSelect({ ...selectedGoods, [category]: updatedGoods });
    }
  };

  const handleReset = () => {
    clearSelectedGoods();
    setSelectedNames({ equipment: [], supplies: [], furniture: [] });
    setQuantityErrors({});
    setInputValues({});
    
    if (onSelect) {
      onSelect({ equipment: [], supplies: [], furniture: [] });
    }
  };

  const groupByCategory = (category) => storeItems[category] || [];

  const renderQuantityInputs = (category) => {
    // Filter out items with quantity 0 or invalid
    const validItems = (selectedGoods[category] || []).filter(item => item.quantity > 0);
    
    if (validItems.length === 0) return null;

    return (
      <Card withBorder mt="md" p="md" radius="md">
        <Text size="sm" fw={600} mb="md" component="div">
          📦 Selected Items & Quantities
        </Text>
        <Stack gap="sm">
          {validItems.map((item) => {
            const storeItem = groupByCategory(category).find((i) => i.name === item.itemName);
            const maxStock = storeItem?.current_stock || 0;
            const isOutOfStock = maxStock === 0;
            const isLowStock = maxStock > 0 && maxStock <= 5;
            const inputValue = inputValues[item.itemId] || item.quantity;
            
            return (
              <Card key={item.itemId} withBorder p="sm" radius="sm">
                <Group justify="space-between" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Group justify="space-between" mb="xs">
                      <Text size="sm" fw={500} component="div">
                        {item.itemName}
                      </Text>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        size="sm"
                        onClick={() => handleRemoveItem(category, item.itemId, item.itemName)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Group>
                    
                    <Group gap="xs" mb="xs">
                      {isOutOfStock ? (
                        <Badge color="red" size="xs" variant="light">
                          Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge color="orange" size="xs" variant="light">
                          Only {maxStock} left
                        </Badge>
                      ) : (
                        <Badge color="green" size="xs" variant="light">
                          {maxStock} available
                        </Badge>
                      )}
                      
                      {item.quantity > 0 && (
                        <Badge color="blue" size="xs" variant="light">
                          Qty: {item.quantity}
                        </Badge>
                      )}
                    </Group>

                    {quantityErrors[item.itemId] && (
                      <Alert 
                        icon={<IconAlertCircle size={16} />} 
                        color="red" 
                        size="xs" 
                        p="xs" 
                        mb="xs"
                      >
                        {quantityErrors[item.itemId]}
                      </Alert>
                    )}
                  </Box>
                  
                  {/* Button-based quantity controls with Tailwind CSS */}
                  <Box className="flex flex-col items-end">
                    <Group gap="xs" className="mb-2">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        size="sm"
                        onClick={() => handleDecrement(category, item.itemId, item.quantity, item.itemName)}
                        disabled={isOutOfStock || item.quantity <= 1}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <IconMinus size={14} />
                      </ActionIcon>
                      
                      <input
                        type="number"
                        min="1"
                        max={maxStock}
                        value={inputValue}
                        onChange={(e) => handleInputChange(item.itemId, e.target.value)}
                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={isOutOfStock}
                      />
                      
                      <ActionIcon
                        variant="light"
                        color="blue"
                        size="sm"
                        onClick={() => handleIncrement(category, item.itemId, item.quantity, item.itemName)}
                        disabled={isOutOfStock || item.quantity >= maxStock}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <IconPlus size={14} />
                      </ActionIcon>
                    </Group>
                    
                    <Button
                      variant="light"
                      color="green"
                      size="xs"
                      className="w-full hover:bg-green-50 transition-colors"
                      onClick={() => handleSetQuantity(category, item.itemId, item.itemName)}
                      disabled={isOutOfStock}
                    >
                      Update
                    </Button>
                  </Box>
                </Group>
              </Card>
            );
          })}
        </Stack>
      </Card>
    );
  };

  const selectedCount = getSelectedGoodsCount();
  const hasErrors = Object.keys(quantityErrors).length > 0;

  return (
    <Stack gap="md" p="md">
      <Group justify="space-between">
        <Box>
          <Title order={4}>Assign Goods & Cutlery</Title>
          <Text size="sm" c="dimmed" mt={4}>
            Select items and set quantities for your event
          </Text>
        </Box>
        <Group>
          <Badge 
            size="lg" 
            variant="light" 
            color={hasErrors ? "red" : "green"}
            leftSection={hasErrors ? <IconAlertCircle size={14} /> : <IconPackage size={14} />}
          >
            {selectedCount} {selectedCount === 1 ? 'Item' : 'Items'}
            {hasErrors && ' • Needs Fix'}
          </Badge>
          <Button
            variant="light"
            color="red"
            size="sm"
            leftSection={<IconRefresh size={16} />}
            onClick={handleReset}
            className="hover:bg-red-50 transition-colors"
          >
            Clear All
          </Button>
        </Group>
      </Group>

      {hasErrors && (
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Please fix the quantity errors before proceeding. Some items exceed available stock.
        </Alert>
      )}

      {/* EQUIPMENT SECTION */}
      <Paper withBorder p="lg" radius="md" shadow="sm">
        <MultiSelect
          label={
            <Group gap="xs">
              <Text component="span">🎥 Equipment</Text>
              {(selectedGoods.equipment || []).length > 0 && (
                <Badge size="sm" variant="light" color="blue">
                  {(selectedGoods.equipment || []).length}
                </Badge>
              )}
            </Group>
          }
          placeholder="Camera, lights, audio equipment..."
          description="Photography, Audio Equipment, Lighting, Event Setup, Decoration"
          data={groupByCategory('equipment').map((i) => i.name)}
          value={selectedNames.equipment}
          onChange={(v) => handleSelection('equipment', v)}
          searchable
          clearable
          hidePickedOptions
          nothingFoundMessage="No equipment found"
        />
        {renderQuantityInputs('equipment')}
      </Paper>

      {/* SUPPLIES SECTION */}
      <Paper withBorder p="lg" radius="md" shadow="sm">
        <MultiSelect
          label={
            <Group gap="xs">
              <Text component="span">🍽️ Supplies</Text>
              {(selectedGoods.supplies || []).length > 0 && (
                <Badge size="sm" variant="light" color="blue">
                  {(selectedGoods.supplies || []).length}
                </Badge>
              )}
            </Group>
          }
          placeholder="Cutlery, plates, serving items..."
          description="Catering Supplies, Cutlery, Tableware, etc."
          data={groupByCategory('supplies').map((i) => i.name)}
          value={selectedNames.supplies}
          onChange={(v) => handleSelection('supplies', v)}
          searchable
          clearable
          hidePickedOptions
          nothingFoundMessage="No supplies found"
        />
        {renderQuantityInputs('supplies')}
      </Paper>

      {/* FURNITURE SECTION */}
      <Paper withBorder p="lg" radius="md" shadow="sm">
        <MultiSelect
          label={
            <Group gap="xs">
              <Text component="span">🪑 Furniture</Text>
              {(selectedGoods.furniture || []).length > 0 && (
                <Badge size="sm" variant="light" color="blue">
                  {(selectedGoods.furniture || []).length}
                </Badge>
              )}
            </Group>
          }
          placeholder="Tables, chairs, decor..."
          description="Tables, Seating, Decorative Items, etc."
          data={groupByCategory('furniture').map((i) => i.name)}
          value={selectedNames.furniture}
          onChange={(v) => handleSelection('furniture', v)}
          searchable
          clearable
          hidePickedOptions
          nothingFoundMessage="No furniture found"
        />
        {renderQuantityInputs('furniture')}
      </Paper>

      {/* Summary */}
      {selectedCount > 0 && (
        <Alert color="blue" icon={<IconCheck size={16} />}>
          <Text fw={500}>Ready to proceed!</Text>
          <Text size="sm">
            You've selected {selectedCount} items across all categories. 
            {hasErrors && ' Please fix any quantity errors before continuing.'}
          </Text>
        </Alert>
      )}
    </Stack>
  );
};

export default AssignCutleryAndGoods;