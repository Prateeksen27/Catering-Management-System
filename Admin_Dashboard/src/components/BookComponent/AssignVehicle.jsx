import React, { useState, useEffect } from "react";
import {
  Card, Group, Text, SimpleGrid, Container, MultiSelect, SegmentedControl,
  Badge, Stack, ActionIcon, Tooltip, Modal, Button, Grid, Box, ScrollArea
} from "@mantine/core";
import { 
  IconInfoCircle, IconGasStation, IconWeight, IconCar, 
  IconCheck, IconFilter, IconRefresh
} from "@tabler/icons-react";
import { useDataStore } from "../../store/useDataStore";
import { useVehicleStore } from "../../store/useVehicleStore";

const AssignVehicleStep = () => {
  // Get vehicle data from store
  const { vehicles, fetchVehicles } = useVehicleStore();
  
  // Get vehicle selection state from data store
  const {
    selectedVehicles,
    toggleVehicle,
    getSelectedVehiclesCount
  } = useDataStore();

  const [statusFilter, setStatusFilter] = useState("All");
  const [fuelFilter, setFuelFilter] = useState([]);
  const [detailModal, setDetailModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch vehicles on component mount
  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      await fetchVehicles();
      setIsLoading(false);
    };
    loadVehicles();
  }, [fetchVehicles]);

  const fuelOptions = [
    { value: "Petrol", label: "Petrol" }, 
    { value: "Diesel", label: "Diesel" },
    { value: "CNG", label: "CNG" }, 
    { value: "Electric", label: "Electric" },
    { value: "Other", label: "Other" },
  ];

  // Filter vehicles based on selected criteria
  const filteredVehicles = vehicles.filter(
    (v) =>
      (statusFilter === "All" || v.status === statusFilter) &&
      (fuelFilter.length === 0 || fuelFilter.includes(v.fuelType)) &&
      (v.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       v.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleVehicleToggle = (vehicleId) => {
    toggleVehicle(vehicleId);
  };

  const handleClearFilters = () => {
    setStatusFilter("All");
    setFuelFilter([]);
    setSearchQuery("");
  };

  const getStatusColor = (status) => {
    const colors = { 
      available: "green", 
      maintenance: "orange", 
      assigned: "blue" 
    };
    return colors[status] || "gray";
  };

  const getFuelIcon = (fuelType) => {
    return fuelType === "Electric" ? <IconCar size={16} /> : <IconGasStation size={16} />;
  };

  // Format capacity display
  const formatCapacity = (capacity) => {
    return capacity > 0 ? `${capacity} Ton` : "Not specified";
  };

  if (isLoading) {
    return (
      <Container size="lg" py="md">
        <Box style={{ textAlign: "center", padding: "60px 20px" }}>
          <Text size="lg" fw={500} c="dimmed" component="div">
            Loading vehicles...
          </Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md" px={{ base: "xs", sm: "md", lg: "xl" }}>
      <Stack gap="xs" mb="lg">
        <Group justify="space-between" wrap="nowrap">
          <Box>
            <Text size={{ base: "lg", sm: "xl" }} fw={700} component="div">
              Assign Vehicle(s)
            </Text>
            <Text c="dimmed" size={{ base: "xs", sm: "sm" }} mt={2} component="div">
              Select one or more vehicles for this booking
            </Text>
          </Box>
          <Badge size="lg" variant="light" color="blue">
            {getSelectedVehiclesCount()} Selected
          </Badge>
        </Group>
      </Stack>

      <Card shadow="sm" padding={{ base: "sm", md: "lg" }} radius="md" withBorder mb="lg">
        <Stack gap="md">
          <Group justify="space-between" wrap="wrap">
            <Text size="sm" fw={600} component="div">
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
                <Text size="xs" fw={500} c="dimmed" component="div">Status</Text>
                <ScrollArea 
                  type="never" 
                  offsetScrollbars={false}
                  styles={{
                    root: { 
                      width: "100%",
                      "&::-webkit-scrollbar": { display: "none" },
                    }
                  }}
                >
                  <SegmentedControl
                    value={statusFilter}
                    onChange={setStatusFilter}
                    data={[
                      { label: "All", value: "All" }, 
                      { label: "Available", value: "available" },
                      { label: "Assigned", value: "assigned" }, 
                      { label: "Maintenance", value: "maintenance" },
                    ]}
                    styles={{
                      root: {
                        overflow: "hidden",
                        minWidth: "max-content"
                      }
                    }}
                  />
                </ScrollArea>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed" component="div">Fuel Type</Text>
                <MultiSelect
                  clearable
                  placeholder="All fuel types"
                  data={fuelOptions}
                  value={fuelFilter}
                  onChange={setFuelFilter}
                  searchable
                  nothingFoundMessage="No fuel type found"
                />
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, lg: 4 }}>
              <Stack gap={4}>
                <Text size="xs" fw={500} c="dimmed" component="div">Search</Text>
                <input
                  type="text"
                  placeholder="Search by plate, model, manufacturer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </Stack>
            </Grid.Col>
          </Grid>
        </Stack>
      </Card>

      <Group justify="space-between" mb="md">
        <Text size="sm" c="dimmed" component="div">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </Text>
        <Text size="xs" c="dimmed" component="div">
          Click on vehicles to select/deselect
        </Text>
      </Group>

      <SimpleGrid 
        cols={{ base: 1, xs: 2, md: 3, xl: 4 }} 
        spacing={{ base: "sm", md: "lg" }} 
        verticalSpacing={{ base: "sm", md: "lg" }}
      >
        {filteredVehicles.length > 0 ? filteredVehicles.map((vehicle) => {
          const isSelected = selectedVehicles.includes(vehicle._id);
          return (
            <Card
              key={vehicle._id}
              shadow={isSelected ? "md" : "sm"}
              padding={{ base: "sm", md: "lg" }}
              radius="md"
              withBorder
              onClick={() => handleVehicleToggle(vehicle._id)}
              className={`cursor-pointer transition-all duration-200 relative overflow-visible ${
                isSelected ? 'border-blue-500 bg-blue-50 transform -translate-y-0.5' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <Box className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <IconCheck size={14} color="white" />
                </Box>
              )}

              <Group justify="space-between" mb="xs" wrap="nowrap">
                <Text 
                  fw={700} 
                  size={{ base: "sm", md: "md" }} 
                  truncate 
                  style={{ flex: 1 }} 
                  component="div"
                >
                  {vehicle.plateNumber}
                </Text>
                <Group gap="xs" wrap="nowrap">
                  <Badge 
                    color={getStatusColor(vehicle.status)} 
                    variant="light" 
                    size="sm"
                  >
                    {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1) || 'Unknown'}
                  </Badge>
                  <Tooltip label="View details">
                    <ActionIcon
                      variant="subtle"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailModal(vehicle);
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
                component="div"
              >
                {vehicle.model}
              </Text>

              <Stack gap={2} mb="sm">
                <Group gap="xs" wrap="nowrap">
                  <IconWeight size={14} color="gray" />
                  <Text size="xs" c="dimmed" component="span">
                    Capacity: {formatCapacity(vehicle.capacity)}
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  {getFuelIcon(vehicle.fuelType)}
                  <Text size="xs" c="dimmed" component="span">
                    Fuel: {vehicle.fuelType || 'Not specified'}
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <IconCar size={14} color="gray" />
                  <Text size="xs" c="dimmed" lineClamp={1} component="span">
                    {vehicle.manufacturer || 'Manufacturer not specified'}
                  </Text>
                </Group>
              </Stack>

              {vehicle.notes && (
                <Tooltip label={vehicle.notes} withArrow>
                  <Text 
                    size="xs" 
                    c="orange" 
                    style={{ fontStyle: 'italic' }} 
                    lineClamp={1} 
                    component="div"
                  >
                    Note: {vehicle.notes}
                  </Text>
                </Tooltip>
              )}
            </Card>
          );
        }) : (
          <Box style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px" }}>
            <IconCar size={48} color="gray" style={{ marginBottom: 16 }} />
            <Text size="lg" fw={500} c="dimmed" mb={8} component="div">
              No vehicles found
            </Text>
            <Text size="sm" c="dimmed" component="div">
              Try adjusting your filters or search terms
            </Text>
            <Button variant="light" size="sm" mt="md" onClick={handleClearFilters}>
              Clear all filters
            </Button>
          </Box>
        )}
      </SimpleGrid>

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
              <Text size="xl" fw={700} component="div">
                {detailModal.plateNumber}
              </Text>
              <Badge 
                color={getStatusColor(detailModal.status)} 
                size="lg" 
                variant="light"
              >
                {detailModal.status?.charAt(0).toUpperCase() + detailModal.status?.slice(1) || 'Unknown'}
              </Badge>
            </Group>

            <Grid gutter="md">
              {[
                { label: "Model", value: detailModal.model || 'Not specified' },
                { label: "Manufacturer", value: detailModal.manufacturer || 'Not specified' },
                { label: "Capacity", value: formatCapacity(detailModal.capacity) },
                { label: "Fuel Type", value: detailModal.fuelType || 'Not specified' },
                { label: "Created", value: detailModal.createdAt ? new Date(detailModal.createdAt).toLocaleDateString() : 'Not available' },
                { label: "Last Updated", value: detailModal.updatedAt ? new Date(detailModal.updatedAt).toLocaleDateString() : 'Not available' },
              ].map((item, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                  <Stack gap={4}>
                    <Text size="sm" fw={600} component="div">{item.label}</Text>
                    <Text size="sm" component="div">{item.value}</Text>
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>

            {detailModal.notes && (
              <Stack gap={4}>
                <Text size="sm" fw={600} component="div">Notes</Text>
                <Card withBorder padding="sm" radius="sm">
                  <Text size="sm" component="div">{detailModal.notes}</Text>
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
};

export default AssignVehicleStep;