import React, { useState } from 'react';
import { MultiSelect, NumberInput, Group, Stack, Text, Box, Divider, Title, Paper } from '@mantine/core';

// Dummy store items (these mimic your MongoDB model)
const storeItems = [
  // Equipment
  { name: 'Camera Kit', type: 'Photography', category: 'equipment', current_stock: 10 },
  { name: 'Speaker Set', type: 'Audio Equipment', category: 'equipment', current_stock: 5 },
  { name: 'LED Lights', type: 'Lighting', category: 'equipment', current_stock: 12 },

  // Supplies
  { name: 'Plates Set', type: 'Catering Supplies', category: 'supplies', current_stock: 100 },
  { name: 'Serving Bowls', type: 'Catering Supplies', category: 'supplies', current_stock: 40 },
  { name: 'Napkins', type: 'Catering Supplies', category: 'supplies', current_stock: 200 },

  // Furniture
  { name: 'Round Tables', type: 'Tables', category: 'furniture', current_stock: 10 },
  { name: 'Wooden Chairs', type: 'Seating', category: 'furniture', current_stock: 60 },
  { name: 'Stage Setup', type: 'Event Setup', category: 'furniture', current_stock: 2 },
];

// Group items by category
const groupByCategory = (category) => storeItems.filter((item) => item.category === category);

const AssignCutleryAndGoods = ({ onSelect }) => {
  const [selected, setSelected] = useState({
    equipment: [],
    supplies: [],
    furniture: [],
  });

  const [quantities, setQuantities] = useState({});

  const handleSelection = (category, values) => {
    const updated = { ...selected, [category]: values };
    setSelected(updated);
    onSelect({ ...updated, quantities });
  };

  const handleQuantityChange = (itemName, qty) => {
    const updated = { ...quantities, [itemName]: qty };
    setQuantities(updated);
    onSelect({ ...selected, quantities: updated });
  };

  // Render list of selected items with quantity inputs
  const renderQuantityInputs = (category) => {
    return selected[category]?.map((itemName) => {
      const item = storeItems.find((i) => i.name === itemName);
      return (
        <Group key={itemName} justify="space-between" mt="xs" align="center">
          <Text size="sm" fw={500}>
            {itemName} ({item.current_stock} available)
          </Text>
          <NumberInput
            placeholder="Qty"
            min={1}
            max={item.current_stock}
            value={quantities[itemName] || ''}
            onChange={(val) => handleQuantityChange(itemName, val)}
            w={100}
          />
        </Group>
      );
    });
  };

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Assign Goods & Cutleries</Title>

      {/* EQUIPMENT SECTION */}
      <Paper withBorder p="md" radius="md">
        <MultiSelect
          label="Select Equipment"
          placeholder="Choose from available equipment"
          data={groupByCategory('equipment').map((i) => i.name)}
          value={selected.equipment}
          onChange={(v) => handleSelection('equipment', v)}
          searchable
          hidePickedOptions
        />
        {renderQuantityInputs('equipment')}
      </Paper>

      {/* SUPPLIES SECTION */}
      <Paper withBorder p="md" radius="md">
        <MultiSelect
          label="Select Supplies"
          placeholder="Choose from available supplies"
          data={groupByCategory('supplies').map((i) => i.name)}
          value={selected.supplies}
          onChange={(v) => handleSelection('supplies', v)}
          searchable
          hidePickedOptions
        />
        {renderQuantityInputs('supplies')}
      </Paper>

      {/* FURNITURE SECTION */}
      <Paper withBorder p="md" radius="md">
        <MultiSelect
          label="Select Furniture"
          placeholder="Choose from available furniture"
          data={groupByCategory('furniture').map((i) => i.name)}
          value={selected.furniture}
          onChange={(v) => handleSelection('furniture', v)}
          searchable
          hidePickedOptions
        />
        {renderQuantityInputs('furniture')}
      </Paper>
    </Stack>
  );
};

export default AssignCutleryAndGoods;


