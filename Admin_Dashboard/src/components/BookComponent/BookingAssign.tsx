import { Button, Group, Stepper } from '@mantine/core'
import { IconCircleCheck,IconUserCheck,IconTruck, IconToolsKitchen2  } from '@tabler/icons-react';
import React, { useState } from 'react'
import AssingStaff from './AssingStaff';
import AssignCutleryAndGoods from './AssignCutleryAndGoods';
import AssignVehicle from './AssignVehicle';

const BookingAssign = () => {
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    return (
        <div>
            <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}  completedIcon={<IconCircleCheck size={18} />}>
                <Stepper.Step 
                label="Assign Staff"
                description="👨‍💼"
                 icon={<IconUserCheck size={18} />}
                 >
                    <AssingStaff/>
                </Stepper.Step>
                <Stepper.Step
                label="Assign Cutlery & Goods" 
                description="🍽️🪑"
                icon={<IconToolsKitchen2 size={18} />}
                >
                    <AssignCutleryAndGoods/>
                </Stepper.Step>
                <Stepper.Step 
                label="Assign Vehicle" 
                description="🚗"
                icon={<IconTruck size={18} />}
                >
                    <AssignVehicle/>
                </Stepper.Step>
                <Stepper.Completed>
                    Completed, click back button to get to previous step
                </Stepper.Completed>
            </Stepper>

            <Group justify="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next step</Button>
            </Group>
        </div>
    )
}

export default BookingAssign