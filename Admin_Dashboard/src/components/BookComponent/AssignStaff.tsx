// src/components/AssignStaff.jsx
import { MultiSelect, Avatar, Group, Text, Box, Title, Stack, Badge } from "@mantine/core";
import { useState, useEffect } from "react";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { useBookingStore } from "../../store/useBookingStore";
import { IconUsers } from "@tabler/icons-react";

const AssignStaff = ({ onSelect }) => {
  const { employeesGrouped, allEmployees, fetchEmployeesGrouped, fetchAllEmployees } = useEmployeeStore();
  const { staff, setStaff, getSelectedStaffCount } = useBookingStore();

  const [selected, setSelected] = useState({
    manager: [],
    employee: [],
    worker: [],
    driver: [],
    chef: [],
  });

  useEffect(() => {
    fetchEmployeesGrouped();
    fetchAllEmployees();
  }, []);

  // Initialize with store data
  useEffect(() => {
    setSelected(staff);
  }, []);

  const handleChange = (role, value) => {
    const updated = { ...selected, [role]: value };
    
    // Update local state
    setSelected(updated);
    
    // Update Zustand store
    setStaff(role, value);
    
    // Call parent callback (if needed for validation)
    if (onSelect) {
      onSelect(updated);
    }
  };

  // Function to get dropdown data for a role
  const getDataForRole = (role) => {
    let list = [];
    if (role === "employee") {
      list = allEmployees || [];
    } else {
      list = employeesGrouped[role + "s"] || [];
    }

    return list.map((p) => ({
      value: `${role}:${p._id}`,
      label: p.name,
      img: p.img || "",
      email: p.email,
    }));
  };

  // Custom option renderer
  const renderOption = ({ option }) => {
    const [role, id] = option.value.split(":");

    let list = role === "employee" ? allEmployees || [] : employeesGrouped[role + "s"] || [];
    const person = list.find((p) => p._id === id);

    if (!person) return null;

    return (
      <Group gap="sm">
        <Avatar src={person.img || ""} size={36} radius="xl" />
        <Box>
          <Text size="sm" fw={500}>{person.name}</Text>
          <Text size="xs" c="dimmed">{person.email}</Text>
        </Box>
      </Group>
    );
  };

  const selectedCount = getSelectedStaffCount();

  return (
    <Stack gap="md" p="md">
      <Group justify="space-between">
        <Title order={4}>Assign Staff Members</Title>
        <Badge 
          size="lg" 
          variant="light" 
          color="blue"
          leftSection={<IconUsers size={14} />}
        >
          {selectedCount} Selected
        </Badge>
      </Group>

      <MultiSelect
        label="Assign Manager"
        placeholder="Select manager"
        data={getDataForRole("manager")}
        value={selected.manager}
        onChange={(v) => handleChange("manager", v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
      />

      <MultiSelect
        label="Assign Workers"
        placeholder="Select workers"
        data={getDataForRole("worker")}
        value={selected.worker}
        onChange={(v) => handleChange("worker", v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
      />

      <MultiSelect
        label="Assign Drivers"
        placeholder="Select drivers"
        data={getDataForRole("driver")}
        value={selected.driver}
        onChange={(v) => handleChange("driver", v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
      />

      <MultiSelect
        label="Assign Chefs"
        placeholder="Select chefs"
        data={getDataForRole("chef")}
        value={selected.chef}
        onChange={(v) => handleChange("chef", v)}
        renderOption={renderOption}
        searchable
        hidePickedOptions
        styles={{ dropdown: { maxHeight: 200, overflowY: 'auto' } }}
      />
    </Stack>
  );
};

export default AssignStaff;