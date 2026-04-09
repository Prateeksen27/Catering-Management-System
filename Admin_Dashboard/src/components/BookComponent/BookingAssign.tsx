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
import { useBookingStore } from '../../store/useBookingStore';

const BookingAssign = ({ onCloseDrawer, eventData }) => {
  const { approveBooking, confirmBooking, assignStaff, assignGoods, assignVehicles, completePreparation } = useBookingStore()
  const [active, setActive] = useState(0);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [stepToEdit, setStepToEdit] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Step data states
  const [staffSelection, setStaffSelection] = useState<{
    manager?: string[];
    worker?: string[];
    chef?: string[];
    driver?: string[];
  }>({});
  const [goodsSelection, setGoodsSelection] = useState({});

  // ✅ Handle next step with validation
  const nextStep = () => {
    // Step 1 validation: Staff - Manager is required, Chef is required
    if (active === 0) {
      if (!staffSelection.manager || staffSelection.manager.length === 0) {
        toast.error("Please assign at least one manager!");
        return;
      }
      if (!staffSelection.chef || staffSelection.chef.length === 0) {
        toast.error("Please assign at least one chef!");
        return;
      }
    }

    // Step 2 validation: Goods and Cutlery (optional but validate if provided)
    if (active === 1) {
      const currentState = useDataStore.getState();
      const selectedGoods = currentState.selectedGoods || {};
      
      const hasItems = Object.values(selectedGoods).some(
        (categoryItems) => Array.isArray(categoryItems) && categoryItems.length > 0
      );

      if (hasItems) {
        const hasValidQuantities = Object.values(selectedGoods).every((categoryItems) =>
          Array.isArray(categoryItems) && categoryItems.every(item => typeof item.quantity === 'number' && item.quantity > 0)
        );

        if (!hasValidQuantities) {
          toast.error('Please ensure all selected items have valid quantities!');
          return;
        }
      }
    }

    // Move forward
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  // Handle edit action from review step
  const handleEditStep = (stepIndex: number) => {
    setStepToEdit(stepIndex);
    setEditModalOpened(true);
  };

  const handleConfirmEdit = () => {
    setActive(stepToEdit);
    setEditModalOpened(false);
  };

  // Get step titles for the modal
  const getStepTitle = (stepIndex: number) => {
    const titles: Record<number, string> = {
      0: "Staff Assignment",
      1: "Goods & Cutlery",
      2: "Vehicle Assignment"
    };
    return titles[stepIndex] || "Step";
  };

  // Handle finish button click
  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Get current state from store
      const currentState = useDataStore.getState();
      const bookingId = eventData._id;

      // Step 0: Approve booking first (PENDING_REVIEW → CONFIRMED)
      await approveBooking(bookingId);

      // Step 1: Assign Staff
      await assignStaff(bookingId, {
        manager: staffSelection.manager,
        workers: staffSelection.worker || [],
        chefs: staffSelection.chef || [],
        drivers: staffSelection.driver || []
      });

      // Step 2: Assign Goods
      const allGoods = [
        ...(currentState.selectedGoods.equipment || []),
        ...(currentState.selectedGoods.supplies || []),
        ...(currentState.selectedGoods.furniture || [])
      ];
      
      if (allGoods.length > 0) {
        await assignGoods(bookingId, allGoods);
      }

      // Step 3: Assign Vehicles
      const vehicles = currentState.selectedVehicles || [];
      if (vehicles.length > 0) {
        await assignVehicles(bookingId, vehicles);
      }

      // Step 4: Complete Preparation (this creates manager task automatically)
      await completePreparation(bookingId);

      // Reset the store state
      currentState.clearAllSelections();

      toast.success("Booking prepared successfully! Manager task created.");

      // Close the drawer
      if (onCloseDrawer) {
        onCloseDrawer();
      }

    } catch (error: any) {
      console.error("Error completing booking:", error);
      toast.error(error.response?.data?.message || "Error completing booking preparation");
    } finally {
      setIsSubmitting(false);
    }
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
            loading={isSubmitting}
          >
            Complete Preparation
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
