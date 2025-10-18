import React, { useState } from "react";
import {
  Card,
  Group,
  Text,
  SimpleGrid,
  Container,
  MultiSelect,
  SegmentedControl,
  Badge,
  Stack,
  ActionIcon,
  Tooltip,
  Modal,
  Button,
  Grid,
  Box,
  Divider,
  Avatar,
  HoverCard,
} from "@mantine/core";
import { 
  IconInfoCircle, 
  IconGasStation, 
  IconWeight, 
  IconCar, 
  IconCheck,
  IconFilter,
  IconRefresh
} from "@tabler/icons-react";

export default function AssignVehicleStep() {
  // ====== Mock Vehicle Data (Schema-based) ======
  const allVehicles = [
    {
      _id: 1,
      plateNumber: "OD-02-AX-1234",
      model: "Tata Ace",
      capacity: 1.5,
      status: "available",
      manufacturer: "Tata Motors",
      fuelType: "Diesel",
      notes: "Good condition",
      year: 2022,
      mileage: "45,000 km",
      lastService: "2024-01-15"
    },
    {
      _id: 2,
      plateNumber: "OD-05-BB-5678",
      model: "Ashok Leyland Dost",
      capacity: 3,
      status: "available",
      manufacturer: "Ashok Leyland",
      fuelType: "Diesel",
      notes: "",
      year: 2023,
      mileage: "22,000 km",
      lastService: "2024-02-20"
    },
    {
      _id: 3,
      plateNumber: "OD-07-CC-9999",
      model: "Eicher Pro",
      capacity: 5,
      status: "maintenance",
      manufacturer: "Eicher",
      fuelType: "Diesel",
      notes: "Under repair",
      year: 2021,
      mileage: "78,000 km",
      lastService: "2024-01-05"
    },
    {
      _id: 4,
      plateNumber: "OD-10-DD-2222",
      model: "Mahindra Supro",
      capacity: 1,
      status: "available",
      manufacturer: "Mahindra",
      fuelType: "CNG",
      notes: "",
      year: 2023,
      mileage: "15,000 km",
      lastService: "2024-03-01"
    },
  ];

  // ====== Local State ======
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState([]);
  const [detailModal, setDetailModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ====== Derived Data ======
  const fuelOptions = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" },
    { value: "Other", label: "Other" },
  ];

  const filteredVehicles = allVehicles.filter(
    (v) =>
      (statusFilter === "All" || v.status === statusFilter) &&
      (fuelFilter.length === 0 || fuelFilter.includes(v.fuelType)) &&
      (v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // ====== Event Handlers ======
  const handleVehicleToggle = (vehicleId) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId)
        ? prev.filter((id) => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleClearFilters = () => {
    setStatusFilter("All");
    setFuelFilter([]);
    setSearchQuery("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "green";
      case "maintenance": return "orange";
      case "assigned": return "blue";
      default: return "gray";
    }
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case "Diesel": return <IconGasStation size={16} />;
      case "Petrol": return <IconGasStation size={16} />;
      case "CNG": return <IconGasStation size={16} />;
      case "Electric": return <IconCar size={16} />;
      default: return <IconGasStation size={16} />;
    }
  };

  // ====== UI ======
  return (
    <Container size="lg" py="md" px={{ base: "xs", sm: "md", lg: "xl" }}>
      {/* ===== Header ===== */}
      <Stack gap="xs" mb="lg">
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text size={{ base: "lg", sm: "xl" }} fw={700}>
              Assign Vehicle(s)
            </Text>
            <Text c="dimmed" size={{ base: "xs", sm: "sm" }} mt={2}>
              Select one or more vehicles for this booking
            </Text>
          </div>
          <Badge 
            size="lg" 
            variant="light" 
            color="blue"
          >
            {selectedVehicles.length} Selected
          </Badge>
        </Group>
      </Stack>

      {/* ===== Filters ===== */}
      <Card 
        shadow="sm" 
        padding={{ base: "sm", md: "lg" }} 
        radius="md" 
        withBorder 
        mb="lg"
      >
        <Stack gap="md">
          <Group justify="space-between" wrap="wrap">
            <Text size="sm" fw={600}>
              <Group gap="xs">
                <IconFilter size={16} />
                Filters
              </Group>
            </Text>
            <Button
              variant="light"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Group>

          <Grid gutter="md">
            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed">
                  Status
                </Text>
                <SegmentedControl
                  value={statusFilter}
                  onChange={setStatusFilter}
                  data={[
                    { label: "All", value: "All" },
                    { label: "Available", value: "available" },
                    { label: "Assigned", value: "assigned" },
                    { label: "Maintenance", value: "maintenance" },
                  ]}
                  fullWidth
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed">
                  Fuel Type
                </Text>
                <MultiSelect
                  clearable
                  placeholder="All fuel types"
                  data={fuelOptions}
                  value={fuelFilter}
                  onChange={setFuelFilter}
                  searchable
                  nothingFound="No fuel type found"
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed">
                  Search
                </Text>
                <input
                  type="text"
                  placeholder="Search by plate, model, manufacturer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    fontSize: "14px",
                    width: "100%"
                  }}
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      {/* ===== Results Summary ===== */}
      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed">
          Showing {filteredVehicles.length} of {allVehicles.length} vehicles
        </Text>
        <Text size="xs" c="dimmed">
          Click on vehicles to select/deselect
        </Text>
      </Group>

      {/* ===== Vehicle Grid ===== */}
      <SimpleGrid
        cols={{ base: 1, xs: 2, md: 3, xl: 4 }}
        spacing={{ base: "sm", md: "lg" }}
        verticalSpacing={{ base: "sm", md: "lg" }}
      >
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((v) => {
            const isSelected = selectedVehicles.includes(v._id);
            return (
              <Card
                key={v._id}
                shadow={isSelected ? "md" : "sm"}
                padding={{ base: "sm", md: "lg" }}
                radius="md"
                withBorder
                onClick={() => handleVehicleToggle(v._id)}
                style={{
                  cursor: "pointer",
                  borderColor: isSelected
                    ? "var(--mantine-color-blue-5)"
                    : "var(--mantine-color-gray-3)",
                  backgroundColor: isSelected
                    ? "var(--mantine-color-blue-light)"
                    : "",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <Box
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      backgroundColor: "var(--mantine-color-blue-5)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconCheck size={14} color="white" />
                  </Box>
                )}

                <Group justify="space-between" mb="xs" wrap="nowrap">
                  <Text 
                    fw={700} 
                    size={{ base: "sm", md: "md" }}
                    truncate
                    style={{ flex: 1 }}
                  >
                    {v.plateNumber}
                  </Text>
                  <Group gap="xs" wrap="nowrap">
                    <Badge
                      color={getStatusColor(v.status)}
                      variant="light"
                      size="sm"
                    >
                      {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                    </Badge>
                    <Tooltip label="View details">
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailModal(v);
                        }}
                      >
                        <IconInfoCircle size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>

                <Text 
                  size={{ base: "sm", md: "md" }} 
                  fw={600} 
                  lineClamp={1}
                  mb={4}
                >
                  {v.model}
                </Text>

                <Stack gap={2} mb="sm">
                  <Group gap="xs" wrap="nowrap">
                    <IconWeight size={14} color="gray" />
                    <Text size="xs" c="dimmed">
                      Capacity: {v.capacity} Ton
                    </Text>
                  </Group>
                  
                  <Group gap="xs" wrap="nowrap">
                    {getFuelIcon(v.fuelType)}
                    <Text size="xs" c="dimmed">
                      Fuel: {v.fuelType}
                    </Text>
                  </Group>
                  
                  <Group gap="xs" wrap="nowrap">
                    <IconCar size={14} color="gray" />
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {v.manufacturer}
                    </Text>
                  </Group>
                </Stack>

                {v.notes && (
                  <HoverCard width={280} shadow="md">
                    <HoverCard.Target>
                      <Text 
                        size="xs" 
                        c="orange" 
                        style={{ 
                          fontStyle: 'italic',
                          cursor: 'help'
                        }}
                        lineClamp={1}
                      >
                        Note: {v.notes}
                      </Text>
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                      <Text size="sm">{v.notes}</Text>
                    </HoverCard.Dropdown>
                  </HoverCard>
                )}
              </Card>
            );
          })
        ) : (
          <Box
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "40px 20px"
            }}
          >
            <IconCar size={48} color="gray" style={{ marginBottom: 16 }} />
            <Text size="lg" fw={500} c="dimmed" mb={8}>
              No vehicles found
            </Text>
            <Text size="sm" c="dimmed">
              Try adjusting your filters or search terms
            </Text>
            <Button 
              variant="light" 
              size="sm" 
              mt="md"
              onClick={handleClearFilters}
            >
              Clear all filters
            </Button>
          </Box>
        )}
      </SimpleGrid>

      {/* ===== Vehicle Detail Modal ===== */}
      <Modal
        opened={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Vehicle Details"
        size="lg"
        padding="lg"
        radius="md"
      >
        {detailModal && (
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="xl" fw={700}>
                {detailModal.plateNumber}
              </Text>
              <Badge
                color={getStatusColor(detailModal.status)}
                size="lg"
                variant="light"
              >
                {detailModal.status}
              </Badge>
            </Group>

            <Divider />

            <Grid gutter="md">
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Model</Text>
                  <Text size="sm">{detailModal.model}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Manufacturer</Text>
                  <Text size="sm">{detailModal.manufacturer}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Capacity</Text>
                  <Text size="sm">{detailModal.capacity} Ton</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Fuel Type</Text>
                  <Group gap="xs">
                    {getFuelIcon(detailModal.fuelType)}
                    <Text size="sm">{detailModal.fuelType}</Text>
                  </Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Year</Text>
                  <Text size="sm">{detailModal.year}</Text>
                </Stack>
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Stack gap={4}>
                  <Text size="sm" fw={600}>Mileage</Text>
                  <Text size="sm">{detailModal.mileage}</Text>
                </Stack>
              </Grid.Col>
            </Grid>

            {detailModal.notes && (
              <Stack gap={4}>
                <Text size="sm" fw={600}>Notes</Text>
                <Card withBorder padding="sm" radius="sm">
                  <Text size="sm">{detailModal.notes}</Text>
                </Card>
              </Stack>
            )}

            <Group justify="flex-end" mt="md">
              <Button
                variant={selectedVehicles.includes(detailModal._id) ? "filled" : "light"}
                color="blue"
                onClick={() => {
                  handleVehicleToggle(detailModal._id);
                  setDetailModal(null);
                }}
              >
                {selectedVehicles.includes(detailModal._id) ? "Deselect" : "Select"} Vehicle
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}