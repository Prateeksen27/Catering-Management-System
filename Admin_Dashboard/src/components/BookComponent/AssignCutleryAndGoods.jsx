import React, { useState, useEffect } from 'react';
import { MultiSelect, NumberInput, Group, Stack, Text, Box, Divider, Title, Paper } from '@mantine/core';
import { useStoreItemsStore } from '../../store/useItemsStore';


const AssignCutleryAndGoods = ({ onSelect }) => {
  const { storeItems, fetchStoreItems } = useStoreItemsStore();
  const [selected, setSelected] = useState({
    equipment: [],
    supplies: [],
    furniture: [],
  });

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchStoreItems(); // Fetch items from backend when component mounts
  }, []);

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

  const groupByCategory = (category) => storeItems[category] || [];

  const renderQuantityInputs = (category) => {
    return selected[category]?.map((itemName) => {
      const item = groupByCategory(category).find((i) => i.name === itemName);
      return (
        <Group key={itemName} justify="space-between" mt="xs" align="center">
          <Text size="sm" fw={500}>
            {itemName} ({item?.current_stock || 0} available)
          </Text>
          <NumberInput
            placeholder="Qty"
            min={1}
            max={item?.current_stock || 1}
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
