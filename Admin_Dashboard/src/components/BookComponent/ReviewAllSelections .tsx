// src/components/ReviewAllSelections.jsx
import React from 'react';
import {
  Card,
  Group,
  Text,
  Stack,
  Badge,
  Container,
  Table,
  Button,
  Grid,
  Accordion,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import {
  IconUser,
  IconToolsKitchen2,
  IconTruck,
  IconEdit
} from '@tabler/icons-react';
import { useDataStore } from '../../store/useDataStore';
import { useVehicleStore } from '../../store/useVehicleStore';

const ReviewAllSelections = ({ onEdit }) => {
  const {
    selectedStaff,
    selectedGoods,
    selectedVehicles,
    getSelectedStaffCount,
    getSelectedGoodsCount,
    getSelectedVehiclesCount,
    getTotalGoodsQuantity
  } = useDataStore();

  const { vehicles } = useVehicleStore();

  // Staff data with role labels
  const staffRoles = {
    manager: 'Manager',
    worker: 'Worker', 
    driver: 'Driver',
    chef: 'Chef'
  };

  // Goods categories with labels
  const goodsCategories = {
    equipment: 'Equipment',
    supplies: 'Supplies',
    furniture: 'Furniture'
  };

  // Get actual vehicle data from store
  const getVehicleDetails = (vehicleId) => {
    return vehicles.find(v => v._id === vehicleId);
  };

  return (
    <Container size="lg" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Text size="xl" fw={700}>Review All Selections</Text>
            <Text c="dimmed" size="sm">
              Review all assigned resources before finalizing the booking
            </Text>
          </div>
          
          <Group>
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => onEdit && onEdit(0)}
            >
              Edit Staff
            </Button>
            <Button
              variant="light" 
              leftSection={<IconEdit size={16} />}
              onClick={() => onEdit && onEdit(1)}
            >
              Edit Goods
            </Button>
            <Button
              variant="light"
              leftSection={<IconEdit size={16} />}
              onClick={() => onEdit && onEdit(2)}
            >
              Edit Vehicles
            </Button>
          </Group>
        </Group>

        <Accordion variant="contained" defaultValue={['staff', 'goods', 'vehicles']}>
          {/* STAFF SECTION */}
          <Accordion.Item value="staff">
            <Accordion.Control icon={<IconUser size={20} />}>
              <Group justify="apart" style={{ width: '100%' }}>
                <Text fw={600}>Staff Assignments</Text>
                <Group>
                  <Badge color="blue" variant="light">
                    {getSelectedStaffCount()} Total
                  </Badge>
                  <Tooltip label="Edit staff assignments">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => onEdit && onEdit(0)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {getSelectedStaffCount() > 0 ? (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Role</Table.Th>
                      <Table.Th>Assigned Count</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {Object.entries(selectedStaff).map(([role, staffIds]) => (
                      staffIds.length > 0 && (
                        <Table.Tr key={role}>
                          <Table.Td>
                            <Text fw={500}>{staffRoles[role]}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color="blue" variant="light">
                              {staffIds.length} {staffRoles[role].toLowerCase()}(s)
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      )
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text c="dimmed">No staff members assigned</Text>
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {/* GOODS & CUTLERY SECTION */}
          <Accordion.Item value="goods">
            <Accordion.Control icon={<IconToolsKitchen2 size={20} />}>
              <Group justify="apart" style={{ width: '100%' }}>
                <Text fw={600}>Goods & Cutlery</Text>
                <Group>
                  <Badge color="green" variant="light">
                    {getSelectedGoodsCount()} Items
                  </Badge>
                  <Badge color="orange" variant="light">
                    {getTotalGoodsQuantity()} Total Qty
                  </Badge>
                  <Tooltip label="Edit goods assignments">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => onEdit && onEdit(1)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {getSelectedGoodsCount() > 0 ? (
                <Stack gap="md">
                  {Object.entries(selectedGoods).map(([category, items]) => (
                    items.length > 0 && (
                      <Card key={category} withBorder padding="md">
                        <Group justify="space-between" mb="sm">
                          <Text fw={600} size="lg">
                            {goodsCategories[category]}
                          </Text>
                          <Badge color="teal" variant="light">
                            {items.length} items
                          </Badge>
                        </Group>
                        
                        <Table>
                          <Table.Thead>
                            <Table.Tr>
                              <Table.Th>Item Name</Table.Th>
                              <Table.Th>Quantity</Table.Th>
                            </Table.Tr>
                          </Table.Thead>
                          <Table.Tbody>
                            {items.map((item, index) => (
                              <Table.Tr key={item.itemId || index}>
                                <Table.Td>
                                  <Text>{item.itemName}</Text>
                                </Table.Td>
                                <Table.Td>
                                  <Badge color="blue" variant="filled">
                                    {item.quantity}
                                  </Badge>
                                </Table.Td>
                              </Table.Tr>
                            ))}
                          </Table.Tbody>
                        </Table>
                      </Card>
                    )
                  ))}
                </Stack>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text c="dimmed">No goods or cutlery assigned</Text>
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {/* VEHICLES SECTION */}
          <Accordion.Item value="vehicles">
            <Accordion.Control icon={<IconTruck size={20} />}>
              <Group justify="apart" style={{ width: '100%' }}>
                <Text fw={600}>Vehicle Assignments</Text>
                <Group>
                  <Badge color="red" variant="light">
                    {getSelectedVehiclesCount()} Vehicles
                  </Badge>
                  <Tooltip label="Edit vehicle assignments">
                    <ActionIcon
                      variant="subtle"
                      onClick={() => onEdit && onEdit(2)}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {getSelectedVehiclesCount() > 0 ? (
                <Grid gutter="md">
                  {selectedVehicles.map((vehicleId) => {
                    const vehicle = getVehicleDetails(vehicleId);
                    return (
                      <Grid.Col key={vehicleId} span={{ base: 12, sm: 6, lg: 4 }}>
                        <Card withBorder padding="lg">
                          <Stack gap="xs">
                            <Group justify="space-between">
                              <Text fw={700} size="lg">
                                {vehicle?.plateNumber || `Vehicle ${vehicleId}`}
                              </Text>
                              <Badge color="green" variant="light">
                                Assigned
                              </Badge>
                            </Group>
                            
                            {vehicle && (
                              <>
                                <Group gap="xs">
                                  <Text size="sm" fw={500}>Model:</Text>
                                  <Text size="sm" c="dimmed">
                                    {vehicle.model}
                                  </Text>
                                </Group>
                                
                                <Group gap="xs">
                                  <Text size="sm" fw={500}>Capacity:</Text>
                                  <Text size="sm" c="dimmed">
                                    {vehicle.capacity ? `${vehicle.capacity} Ton` : 'Not specified'}
                                  </Text>
                                </Group>
                                
                                <Group gap="xs">
                                  <Text size="sm" fw={500}>Fuel Type:</Text>
                                  <Text size="sm" c="dimmed">
                                    {vehicle.fuelType}
                                  </Text>
                                </Group>
                              </>
                            )}
                          </Stack>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Text c="dimmed">No vehicles assigned</Text>
                </div>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* SUMMARY CARD */}
        <Card shadow="sm" withBorder>
          <Group justify="space-between">
            <div>
              <Text fw={600} size="lg">Booking Summary</Text>
              <Text c="dimmed" size="sm">
                Total resources assigned for this booking
              </Text>
            </div>
            
            <Group>
              <Badge color="blue" size="lg" variant="light">
                Staff: {getSelectedStaffCount()}
              </Badge>
              <Badge color="green" size="lg" variant="light">
                Items: {getSelectedGoodsCount()}
              </Badge>
              <Badge color="orange" size="lg" variant="light">
                Qty: {getTotalGoodsQuantity()}
              </Badge>
              <Badge color="red" size="lg" variant="light">
                Vehicles: {getSelectedVehiclesCount()}
              </Badge>
            </Group>
          </Group>
        </Card>
      </Stack>
    </Container>
  );
};

export default ReviewAllSelections;