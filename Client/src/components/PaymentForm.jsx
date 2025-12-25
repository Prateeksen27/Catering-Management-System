import React from 'react'
import SectionTitle from "../components/Share/SectionTitle";
import { Image } from '@mantine/core';
import { paymentMethods } from '../assets/constants';
import { TextInput, Select,NumberInput } from '@mantine/core';
import { IndianRupeeIcon } from 'lucide-react';
const PaymentForm = ({ data, extra, errors, onChange }) => {
    console.log(extra);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <SectionTitle
                title="Payment Information"
                subtitle="Securely set up your billing details"
            />
            <div className='flex'>
                {/* Payment form fields can be added here */}
                <div className='w-1/2'>
                    <div>
                        <h2>Pricing Details</h2>
                        <ul className='list-disc list-inside mt-4 text-slate-700'>
                            <li className='flex items-center'>Total Amount: {extra.menu.estimatedPrice * (10 + extra.event.guests)} <IndianRupeeIcon size={17} /></li>
                        </ul>
                    </div>
                    <div className='mt-6'>
                        <NumberInput
                            label="Amount Paid"
                            placeholder="Enter amount you paid"
                            min={0}
                            value={data.totalPricePaid}
                            onChange={(value) => onChange('totalPricePaid', value)}
                        />
                        <Select
                            label="Choose Payment Method"
                            data={paymentMethods}
                            mb={5}
                            value={data.paymentMethod}
                            onChange={(value) => onChange('paymentMethod', value)}
                        />
                        <TextInput
                            label="Transaction ID"
                            placeholder="Enter transaction ID"
                            value={data.transactionId}
                            onChange={(e) => onChange('transactionId', e.target.value)}
                            mt={5}
                        />
                    </div>
                </div>
                <div className='w-1/2 flex flex-col'>
                    <Image
                        radius="md"
                        h={200}
                        w="auto"
                        fit="contain"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                    />
                </div>
            </div>
        </div>
    )
}

export default PaymentForm