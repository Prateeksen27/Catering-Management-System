import {
  MultiSelect,
  Avatar,
  Group,
  Text,
  Box,
  Title,
  Stack,
  Badge,
  Alert,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useEmployeeStore } from "../../store/useEmployeeStore";
import { useDataStore } from "../../store/useDataStore";
import { IconUsers, IconAlertCircle } from "@tabler/icons-react";

type Role = "manager" | "worker" | "driver" | "chef";

const REQUIRED_ROLES: Role[] = ["manager", "worker", "driver", "chef"];

const AssignStaff = ({ onSelect }) => {
  const {
    employeesGrouped,
    allEmployees,
    fetchEmployeesGrouped,
    fetchAllEmployees,
  } = useEmployeeStore();

  const { selectedStaff, setSelectedStaff, getSelectedCount } =
    useDataStore();

  const [errors, setErrors] = useState<Record<Role, string>>({} as any);

  useEffect(() => {
    fetchEmployeesGrouped();
    fetchAllEmployees();
  }, [fetchEmployeesGrouped, fetchAllEmployees]);

  // ✅ Check availability
  const hasAvailableStaff = (role: Role) =>
    (employeesGrouped[role] || []).some(
      (p) => p.status !== "Assigned"
    );

  // ✅ Validate minimum one per role
  const validateSelection = (state) => {
    const newErrors: Record<Role, string> = {} as any;

    REQUIRED_ROLES.forEach((role) => {
      if (!state[role] || state[role].length === 0) {
        newErrors[role] = `Please select at least one ${role}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (role: Role, value: string[]) => {
    const updatedState = {
      ...selectedStaff,
      [role]: value,
    };

    setSelectedStaff(role, value);

    if (value.length > 0) {
      setErrors((prev) => ({ ...prev, [role]: "" }));
    }

    onSelect(updatedState, validateSelection(updatedState));
  };

  // ✅ Filter Assigned staff
  const getDataForRole = (role: Role) =>
    (employeesGrouped[role] || [])
      .filter((p) => p.status !== "Assigned")
      .map((p) => ({
        value: p._id,
        label: p.name,
        img: p.profilePic || "",
        email: p.email,
      }));

  // ✅ Option renderer
  const renderOption = ({ option }) => {
    const person =
      allEmployees?.find((p) => p._id === option.value) ||
      (Object.values(employeesGrouped || {}).flat() as any[]).find(
        (p: any) => p._id === option.value
      );

    if (!person) return null;

    const initials =
      person.name
        ?.split(" ")
        .map((n, i, arr) =>
          i === 0 || i === arr.length - 1 ? n[0] : ""
        )
        .join("")
        .toUpperCase() || "U";

    return (
      <Group gap="sm">
        <Avatar src={person.profilePic} radius="xl" size={40}>
          {initials}
        </Avatar>

        <Box>
          <Text size="sm" fw={500}>
            {person.name}
          </Text>
          <Text size="xs" c="dimmed">
            {person.email}
          </Text>
        </Box>
      </Group>
    );
  };

  const renderMultiSelect = (role: Role, label: string) => (
    <MultiSelect
      label={label}
      placeholder={
        hasAvailableStaff(role)
          ? `Select ${label.toLowerCase()}`
          : `No ${label.toLowerCase()} available`
      }
      data={getDataForRole(role)}
      value={selectedStaff[role]}
      onChange={(v) => handleChange(role, v)}
      renderOption={renderOption}
      searchable
      hidePickedOptions
      disabled={!hasAvailableStaff(role)}
      error={errors[role]}
      nothingFoundMessage={`All ${label.toLowerCase()} are already assigned`}
      styles={{ dropdown: { maxHeight: 200, overflowY: "auto" } }}
    />
  );

  return (
    <Stack gap="md" p="md">
      {Object.keys(errors).length > 0 && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          variant="light"
        >
          Please assign at least one staff member from each group.
        </Alert>
      )}

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

      {renderMultiSelect("manager", "Manager")}
      {renderMultiSelect("worker", "Workers")}
      {renderMultiSelect("driver", "Drivers")}
      {renderMultiSelect("chef", "Chefs")}
    </Stack>
  );
};

export default AssignStaff;
