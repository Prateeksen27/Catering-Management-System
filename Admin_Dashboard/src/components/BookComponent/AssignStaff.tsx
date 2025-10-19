import { MultiSelect, Avatar, Group, Text, Box, Title, Stack ,Badge } from "@mantine/core";
import { useState, useEffect } from "react";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { useDataStore } from "../../store/useDataStore";
import { log } from "node:console";
import { IconUsers } from "@tabler/icons-react";

const AssignStaff = ({ onSelect }) => {
  const { employeesGrouped, allEmployees, fetchEmployeesGrouped, fetchAllEmployees } = useEmployeeStore();
  const { selectedStaff, setSelectedStaff, getSelectedCount } = useDataStore();


  useEffect(() => {
    fetchEmployeesGrouped();
    fetchAllEmployees(); // fetch all employees
  }, []);

  const handleChange = (role, value) => {
    setSelectedStaff(role, value);
   const updatedState = {
      ...selectedStaff,
      [role]: value
    };
    console.log(updatedState);
    onSelect(updatedState);
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
      value: `${p._id}`,
      label: p.name,
      img: p.img || "",
      email: p.email,
    }));
  };

  // Custom option renderer
  const renderOption = ({ option }) => {
     const person = allEmployees?.find(p => p._id === option.value) || 
                Object.values(employeesGrouped).flat().find(p => p._id === option.value);

  if (!person) return null;

  return (
    <Group gap="sm">
      <Avatar src={person.img || ""} size={36} radius="xl" />
      <Box>
        <Text size="sm" fw={500}>{person.name}</Text>
        <Text size="xs" c="dimmed">{person.email}</Text>
      </Box>
    </Group>
  )
  };

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
          {getSelectedCount()} Selected
        </Badge>
      </Group>
      <MultiSelect
        label="Assign Manager"
        placeholder="Select manager"
        data={getDataForRole("manager")}
        value={selectedStaff.manager}
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
        value={selectedStaff.worker}
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
        value={selectedStaff.driver}
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
        value={selectedStaff.chef}
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