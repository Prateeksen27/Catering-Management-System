// src/components/BookingAssign.jsx
import { Button, Group, Stepper } from '@mantine/core';
import { IconCircleCheck, IconUserCheck, IconTruck, IconToolsKitchen2 } from '@tabler/icons-react';
import React, { useState } from 'react';
import AssignStaff from './AssignStaff';
import AssignCutleryAndGoods from './AssignCutleryAndGoods';
import AssignVehicle from './AssignVehicle';
import toast from 'react-hot-toast';

const BookingAssign = () => {
  const [active, setActive] = useState(0);

  // ✅ Step data states
  type StaffSelection = Record<string, any[]>;
  type GoodsSelection = Record<string, any> & { quantities?: Record<string, number> };

  const [staffSelection, setStaffSelection] = useState<StaffSelection>({});
  const [goodsSelection, setGoodsSelection] = useState<GoodsSelection>({});

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
      const allCategoriesEmpty = Object.values(goodsSelection).every(
        (arr) => !arr || arr.length === 0
      );
      const hasQuantities =
        goodsSelection.quantities &&
        Object.keys(goodsSelection.quantities).length > 0;

      if (allCategoriesEmpty || !hasQuantities) {
        toast.error('Please assign at least one item and quantity before proceeding!');
        return;
      }
    }

    // Move forward
    setActive((current) => (current < 3 ? current + 1 : current));
  };

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

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

        {/* COMPLETED */}
        <Stepper.Completed>
          ✅ Completed! Click "Back" to revisit steps.
        </Stepper.Completed>
      </Stepper>

      {/* FOOTER BUTTONS */}
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        <Button onClick={nextStep}>
          {active === 2 ? 'Finish' : 'Next step'}
        </Button>
      </Group>
    </div>
  );
};

export default BookingAssign;
