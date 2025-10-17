// src/components/AssignStaff.jsx
import { MultiSelect, Avatar, Group, Text, Box, Title, Divider, Stack } from '@mantine/core';
import { useState } from 'react';

// Dummy data for all roles
const staffData = {
  manager: [
    { name: 'Rohit Sharma', email: 'rohit.manager@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png' },
    { name: 'Sneha Kapoor', email: 'sneha.manager@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png' },
  ],
  employee: [
    { name: 'Vikram Das', email: 'vikram.employee@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png' },
    { name: 'Riya Patel', email: 'riya.employee@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png' },
    { name: 'Arjun Singh', email: 'arjun.employee@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-3.png' },
  ],
  worker: [
    { name: 'Karan Mehta', email: 'karan.worker@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png' },
    { name: 'Priya Reddy', email: 'priya.worker@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-6.png' },
  ],
  driver: [
    { name: 'Deepak Yadav', email: 'deepak.driver@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png' },
    { name: 'Rahul Kumar', email: 'rahul.driver@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png' },
  ],
  chef: [
    { name: 'Chef Ananya', email: 'ananya.chef@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-9.png' },
    { name: 'Chef Kabir', email: 'kabir.chef@gmail.com', img: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png' },
  ],
};

// Common renderer for dropdown options
const renderOption = ({ option }) => {
  const [role, name] = option.value.split(':');
  const person = staffData[role].find((p) => p.name === name);

  return (
    <Group gap="sm">
      <Avatar src={person?.img} size={36} radius="xl" />
      <Box>
        <Text size="sm" fw={500}>{person?.name}</Text>
        <Text size="xs" c="dimmed">{person?.email}</Text>
      </Box>
    </Group>
  );
};

const AssignStaff = ({ onSelect }) => {
  const [selected, setSelected] = useState({
    manager: [],
    employee: [],
    worker: [],
    driver: [],
    chef: [],
  });

  const handleChange = (role, value) => {
    const updated = { ...selected, [role]: value };
    setSelected(updated);
    onSelect(updated);
  };

  const getDataForRole = (role) =>
    staffData[role].map((p) => ({
      value: `${role}:${p.name}`,
      label: p.name,
    }));

  return (
    <Stack gap="md" p="md">
      <Title order={4}>Assign Staff Members</Title>

      <MultiSelect
        label="Assign Manager"
        placeholder="Select manager"
        data={getDataForRole('manager')}
        value={selected.manager}
        onChange={(v) => handleChange('manager', v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
      />

      <MultiSelect
        label="Assign Employees"
        placeholder="Select employees"
        data={getDataForRole('employee')}
        value={selected.employee}
        onChange={(v) => handleChange('employee', v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
      />

      <MultiSelect
        label="Assign Workers"
        placeholder="Select workers"
        data={getDataForRole('worker')}
        value={selected.worker}
        onChange={(v) => handleChange('worker', v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
      />

      <MultiSelect
        label="Assign Drivers"
        placeholder="Select drivers"
        data={getDataForRole('driver')}
        value={selected.driver}
        onChange={(v) => handleChange('driver', v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
      />

      <MultiSelect
        label="Assign Chefs"
        placeholder="Select chefs"
        data={getDataForRole('chef')}
        value={selected.chef}
        onChange={(v) => handleChange('chef', v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
      />
    </Stack>
  );
};

export default AssignStaff;
