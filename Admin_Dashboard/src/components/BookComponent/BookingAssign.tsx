// src/components/BookingAssign.jsx
import { Button, Group, Stepper, Modal, Text } from '@mantine/core';
import { 
  IconCircleCheck, 
  IconUserCheck, 
  IconTruck, 
  IconToolsKitchen2,
  IconClipboardList,
  IconEdit
} from '@tabler/icons-react';
import React, { useState } from 'react';
import AssignStaff from './AssignStaff';
import AssignCutleryAndGoods from './AssignCutleryAndGoods';
import AssignVehicle from './AssignVehicle';
import ReviewAllSelections from './ReviewAllSelections '
import toast from 'react-hot-toast';
import { useDataStore } from '../../store/useDataStore';

const BookingAssign = ({ onCloseDrawer }) => {
  const [active, setActive] = useState(0);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [stepToEdit, setStepToEdit] = useState(0);

  // ✅ Step data states
  const [staffSelection, setStaffSelection] = useState({});
  const [goodsSelection, setGoodsSelection] = useState({});

  // ✅ Handle next step with validation
  const nextStep = () => {
    // Step 1 validation: Staff
    if (active === 0) {
      const allRolesEmpty = Object.values(staffSelection).every(
        (arr) => !arr || arr.length === 0
      );
      if (allRolesEmpty) {
        toast.error('Please assign at least one staff member before proceeding!');
        return;
      }
    }

    // Step 2 validation: Goods and Cutlery
    if (active === 1) {
      const { selectedGoods } = useDataStore.getState();
      
      const hasItems = Object.values(selectedGoods).some(
        (categoryItems) => categoryItems && categoryItems.length > 0
      );
      
      const hasValidQuantities = Object.values(selectedGoods).every((categoryItems) => 
        categoryItems.every(item => item.quantity > 0)
      );

      if (!hasItems || !hasValidQuantities) {
        toast.error('Please assign at least one item with valid quantity before proceeding!');
        return;
      }
    }

    // Step 3 validation: Vehicles
    if (active === 2) {
      const { selectedVehicles } = useDataStore.getState();
      if (selectedVehicles.length === 0) {
        toast.error('Please assign at least one vehicle before proceeding!');
        return;
      }
    }

    // Move forward
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // Handle edit action from review step
  const handleEditStep = (stepIndex) => {
    setStepToEdit(stepIndex);
    setEditModalOpened(true);
  };

  const handleConfirmEdit = () => {
    setActive(stepToEdit);
    setEditModalOpened(false);
  };

  // Get step titles for the modal
  const getStepTitle = (stepIndex) => {
    const titles = {
      0: "Staff Assignment",
      1: "Goods & Cutlery",
      2: "Vehicle Assignment"
    };
    return titles[stepIndex] || "Step";
  };

  // Handle finish button click
  const handleFinish = () => {
    // Get current state from store
    const currentState = useDataStore.getState();
    
    // Prepare the data to log
    const bookingData = {
      staff: currentState.selectedStaff,
      goods: currentState.selectedGoods,
      vehicles: currentState.selectedVehicles,
      summary: {
        totalStaff: currentState.getSelectedStaffCount(),
        totalGoods: currentState.getSelectedGoodsCount(),
        totalVehicles: currentState.getSelectedVehiclesCount(),
        totalQuantity: currentState.getTotalGoodsQuantity()
      },
      timestamp: new Date().toISOString()
    };

    // Log to console
    console.log('🎯 FINAL BOOKING DATA:', bookingData);
    
    // Show success message
    toast.success('Booking confirmed successfully!');
    
    // Reset the store state
    currentState.clearAllSelections();
    
    // Close the drawer after a short delay
    setTimeout(() => {
      if (onCloseDrawer) {
        onCloseDrawer();
      }
    }, 1000);
  };

  return (
    <div>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        completedIcon={<IconCircleCheck size={18} />}
      >
        {/* STEP 1: STAFF */}
        <Stepper.Step
          label="Assign Staff"
          description="👨‍💼"
          icon={<IconUserCheck size={18} />}
        >
          <AssignStaff onSelect={setStaffSelection} />
        </Stepper.Step>

        {/* STEP 2: GOODS & CUTLERY */}
        <Stepper.Step
          label="Assign Cutlery & Goods"
          description="🍽️🪑"
          icon={<IconToolsKitchen2 size={18} />}
        >
          <AssignCutleryAndGoods onSelect={setGoodsSelection} />
        </Stepper.Step>

        {/* STEP 3: VEHICLE */}
        <Stepper.Step
          label="Assign Vehicle"
          description="🚗"
          icon={<IconTruck size={18} />}
        >
          <AssignVehicle />
        </Stepper.Step>

        {/* STEP 4: REVIEW - Only show review once */}
        <Stepper.Step
          label="Review All"
          description="📋"
          icon={<IconClipboardList size={18} />}
        >
          <ReviewAllSelections onEdit={handleEditStep} />
        </Stepper.Step>
      </Stepper>

      {/* FOOTER BUTTONS */}
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        
        {active < 3 ? (
          <Button onClick={nextStep}>
            Next step
          </Button>
        ) : (
          <Button 
            color="green" 
            onClick={handleFinish}
          >
            Confirm Booking
          </Button>
        )}
      </Group>

      {/* Edit Step Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Edit Selection"
        centered
        size="md"
      >
        <div style={{ textAlign: 'center' }}>
          <IconEdit size={48} color="#228be6" style={{ marginBottom: 16 }} />
          <Text size="lg" fw={500} mb="md">
            Edit {getStepTitle(stepToEdit)}
          </Text>
          <Text size="sm" c="dimmed" mb="xl">
            You will be taken back to the {getStepTitle(stepToEdit).toLowerCase()} step to make changes. 
            Your current selections will be preserved.
          </Text>
          
          <Group justify="center">
            <Button 
              variant="light" 
              onClick={() => setEditModalOpened(false)}
            >
              Cancel
            </Button>
            <Button 
              color="blue"
              onClick={handleConfirmEdit}
            >
              Continue Editing
            </Button>
          </Group>
        </div>
      </Modal>
    </div>
  );
};

export default BookingAssign;