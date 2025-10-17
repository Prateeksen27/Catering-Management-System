import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, ActionIcon, Tooltip, Modal, TextInput, NumberInput, NativeSelect } from '@mantine/core';
import { Plus, Users, Fuel, Settings, Truck } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useVehicleStore } from '../store/useVehicleStore';

const Vehicle: React.FC = () => {
  const { fetchVehicles, vehicles, updateVehicle, deleteVehicle, createVehicle } = useVehicleStore();
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [isAdd, setAdd] = useState(false);

  const [data, setData] = useState({
    plateNumber: '',
    model: '',
    manufacturer: '',
    capacity: 0,
    fuelType: '',
    status: 'available',
  });

  const fuelType = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Other'];
  const status = ['available', 'assigned', 'maintenance'];

  // ✅ Handle Input Changes (Unified)
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdd && !editItemId) return;
    if (isAdd) {
      await createVehicle(data);
    } else {
      await updateVehicle(editItemId, data);
    }
    close();
    setAdd(false);
    resetForm();
  };

  const resetForm = () => {
    setData({
      plateNumber: '',
      model: '',
      manufacturer: '',
      capacity: 0,
      fuelType: '',
      status: 'available',
    });
    setEditItemId(null);
    setAdd(false);
  };

  const handleEdit = (v) => {
    setEditItemId(v._id);
    setData({
      plateNumber: v.plateNumber,
      model: v.model,
      manufacturer: v.manufacturer,
      capacity: v.capacity,
      fuelType: v.fuelType,
      status: v.status,
    });
    open();
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500 text-white">Available</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500 text-white">Assigned</Badge>;
      case 'maintenance':
        return <Badge className="bg-yellow-500 text-black">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor your fleet of vehicles efficiently.
          </p>
        </div>
        <Button onClick={() => {
          resetForm()
          setAdd(true)
          open()
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Edit Vehicle Modal */}
        <Modal
          opened={opened}
          onClose={close}
          title={isAdd ? "Add New Vehicle" : "Edit Vehicle"}
          overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <TextInput
                name="plateNumber"
                label="Plate Number"
                placeholder="Enter plate number"
                value={data.plateNumber}
                withAsterisk
                onChange={handleInputChange}
              />
              <TextInput
                name="model"
                label="Model"
                placeholder="Enter model"
                value={data.model}
                withAsterisk
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <TextInput
                name="manufacturer"
                label="Manufacturer"
                placeholder="Enter manufacturer"
                value={data.manufacturer}
                withAsterisk
                onChange={handleInputChange}
              />
              <NumberInput
                label="Capacity"
                placeholder="Enter capacity"
                value={data.capacity}
                withAsterisk
                onChange={(value) =>
                  setData((prev) => ({ ...prev, capacity: Number(value) }))
                }
              />
            </div>

            <NativeSelect
              name="fuelType"
              my="sm"
              label="Fuel Type"
              withAsterisk
              data={['Select Type', ...fuelType]}
              value={data.fuelType || 'Select Type'}
              onChange={handleInputChange}
            />

            {!isAdd && <NativeSelect
              name="status"
              my="sm"
              label="Status"
              withAsterisk
              data={['Select Status', ...status]}
              value={data.status || 'Select Status'}
              onChange={handleInputChange}
            />}

            <Button fullWidth mt="md" type="submit" onClick={handleSubmit}>
              {isAdd ? "Add Vehicle" : "Update Vehicle"}
            </Button>
          </form>
        </Modal>

        {/* Vehicle Summary Stats */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{vehicles.length}</p>
              <p className="text-sm text-muted-foreground">Total Vehicles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {vehicles.filter((v) => v.status === 'available').length}
              </p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {vehicles.filter((v) => v.status === 'assigned').length}
              </p>
              <p className="text-sm text-muted-foreground">Assigned</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Fuel className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {vehicles.filter((v) => v.status === 'maintenance').length}
              </p>
              <p className="text-sm text-muted-foreground">Maintenance</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Cards */}
      {/* Vehicle Cards */}
      <div className="grid gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle._id} className="hover:shadow-md transition-shadow relative">
            {/* Edit Icon */}
            <Tooltip label="Edit Vehicle" withArrow>
              <ActionIcon
                variant="filled"
                color="blue"
                className="absolute top-3 right-3 hover:scale-110 transition-transform"
                aria-label="Edit Vehicle"
                onClick={() => handleEdit(vehicle)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>

            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>
                    {vehicle.model
                      ? vehicle.model
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                      : 'V'}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <CardTitle className="flex items-center gap-2">
                    {vehicle.model || 'Unnamed Vehicle'}
                    {getStatusBadge(vehicle.status)}
                  </CardTitle>
                  <p className="text-muted-foreground">Plate: {vehicle.plateNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Fuel: {vehicle.fuelType} | Capacity: {vehicle.capacity} | {vehicle.manufacturer}
                  </p>
                </div>
              </div>
            </CardHeader>

            {/* ✅ Delete Button Bottom Right */}
            <div className="absolute bottom-3 right-3">
              <Tooltip label="Delete Vehicle" withArrow>
                <ActionIcon
                  variant="filled"
                  color="red"
                  aria-label="Delete Vehicle"
                  onClick={() => deleteVehicle(vehicle._id)}
                  className="hover:scale-110 transition-transform"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Tooltip>
            </div>

          </Card>
        ))}
      </div>

    </div>
  );
};

export default Vehicle;
