import React, { useState, useEffect } from 'react'
import SectionTitle from "../components/Share/SectionTitle";
import { Image } from '@mantine/core';
import { paymentMethods } from '../assets/constants';
import { TextInput, Select, NumberInput, Alert } from '@mantine/core';
import { IndianRupeeIcon, AlertCircle } from 'lucide-react';

const PaymentForm = ({ data, extra, errors, onChange }) => {
    const [paymentError, setPaymentError] = useState('');
    
    const estimatedTotal = extra.menu.estimatedPrice * (10 + extra.event.guests);
    const minimumRequired = estimatedTotal * 0.5; // 50% of total
    
    // Validate payment amount whenever it changes
    const handleAmountChange = (value) => {
        onChange('totalPricePaid', value);
        
        if (value < minimumRequired) {
            setPaymentError(`Minimum 50% (₹${minimumRequired.toFixed(2)}) advance payment required`);
        } else {
            setPaymentError('');
        }
    };
    
    // Initial validation when component mounts
    useEffect(() => {
        if (data.totalPricePaid < minimumRequired) {
            setPaymentError(`Minimum 50% (₹${minimumRequired.toFixed(2)}) advance payment required`);
        }
    }, []);

    // Export validation status to parent component via onChange
    useEffect(() => {
        // Pass validation status to parent component
        // We'll use a special key '__paymentValid' to communicate validation status
        onChange('__paymentValid', !paymentError && data.totalPricePaid >= minimumRequired);
    }, [paymentError, data.totalPricePaid, minimumRequired]);

    return (
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <SectionTitle
                title="Payment Information"
                subtitle="Securely set up your billing details"
            />
            
            <div className='flex'>
                <div className='w-1/2'>
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Pricing Details</h2>
                        <ul className='space-y-2 text-slate-700'>
                            <li className='flex items-center justify-between pb-2 border-b'>
                                <span>Estimated Total Amount:</span>
                                <span className='font-medium flex items-center'>
                                    ₹{estimatedTotal.toFixed(2)}
                                    <IndianRupeeIcon size={17} className="ml-1" />
                                </span>
                            </li>
                            <li className='flex items-center justify-between pb-2 border-b text-blue-600'>
                                <span>Minimum Advance Required (50%):</span>
                                <span className='font-bold flex items-center'>
                                    ₹{minimumRequired.toFixed(2)}
                                    <IndianRupeeIcon size={17} className="ml-1" />
                                </span>
                            </li>
                            <li className='flex items-center justify-between pb-2 border-b'>
                                <span>Amount Paid:</span>
                                <span className={`font-medium flex items-center ${data.totalPricePaid >= minimumRequired ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{data.totalPricePaid || 0}
                                    <IndianRupeeIcon size={17} className="ml-1" />
                                </span>
                            </li>
                            <li className='flex items-center justify-between mt-2 pt-2 border-t'>
                                <span>Balance Remaining:</span>
                                <span className='font-medium text-slate-800 flex items-center'>
                                    ₹{Math.max(0, (estimatedTotal - (data.totalPricePaid || 0))).toFixed(2)}
                                    <IndianRupeeIcon size={17} className="ml-1" />
                                </span>
                            </li>
                        </ul>
                        
                        {/* Progress bar showing payment percentage */}
                        <div className="mt-6">
                            <div className="flex justify-between text-sm mb-1">
                                <span>Payment Progress</span>
                                <span className="font-medium">
                                    {((data.totalPricePaid / estimatedTotal) * 100).toFixed(1)}%
                                </span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${data.totalPricePaid >= minimumRequired ? 'bg-green-500' : 'bg-orange-500'}`}
                                    style={{ width: `${Math.min(100, (data.totalPricePaid / estimatedTotal) * 100)}%` }}
                                />
                            </div>
                            <div className="relative h-2">
                                <div 
                                    className="absolute top-0 h-2 w-0.5 bg-red-500"
                                    style={{ left: '50%' }}
                                />
                                <span className="absolute text-xs text-red-500 font-medium" style={{ left: '50%', top: '-18px' }}>
                                    50%
                                </span>
                            </div>
                        </div>
                        
                        {/* Important Note */}
                        <Alert 
                            color="blue" 
                            title="Important Payment Note" 
                            className="mt-6"
                            variant="light"
                            icon={<AlertCircle size={16} />}
                        >
                            <div className="text-sm">
                                <p className="font-medium">To proceed with the booking:</p>
                                <ol className="list-decimal ml-4 mt-1 space-y-1">
                                    <li>Pay at least <strong className="text-blue-700">50% (₹{minimumRequired.toFixed(2)})</strong> as advance</li>
                                    <li>The remaining balance can be paid before the event date</li>
                                    <li>Booking will be confirmed only after receiving advance payment</li>
                                </ol>
                            </div>
                        </Alert>
                    </div>
                    
                    <div className='mt-6'>
                        <div className="mb-4">
                            <NumberInput
                                label="Amount Paid"
                                placeholder="Enter amount you paid"
                                min={0}
                                max={estimatedTotal}
                                value={data.totalPricePaid}
                                onChange={handleAmountChange}
                                error={paymentError && "Insufficient payment"}
                                withAsterisk
                                prefix="₹ "
                                size="md"
                            />
                            {/* Custom description placed outside the NumberInput */}
                            <div className={`mt-1 text-sm ${data.totalPricePaid >= minimumRequired ? 'text-green-600' : 'text-red-600'}`}>
                                {data.totalPricePaid >= minimumRequired 
                                    ? "✓ Payment requirement met" 
                                    : `Minimum required: ₹${minimumRequired.toFixed(2)}`
                                }
                            </div>
                        </div>
                        <Select
                            label="Choose Payment Method"
                            data={paymentMethods}
                            mb={5}
                            value={data.paymentMethod}
                            onChange={(value) => onChange('paymentMethod', value)}
                            withAsterisk
                            size="md"
                        />
                        <TextInput
                            label="Transaction ID"
                            placeholder="Enter transaction ID (optional)"
                            description="Required for online payments"
                            value={data.transactionId}
                            onChange={(e) => onChange('transactionId', e.target.value)}
                            mt={5}
                            size="md"
                        />
                    </div>
                </div>
                <div className='w-1/2 flex flex-col pl-6'>
                    <Image
                        radius="md"
                        h={200}
                        w="auto"
                        fit="contain"
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
                        alt="Payment illustration"
                    />
                    <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-medium mb-3 text-slate-800 flex items-center">
                            <AlertCircle size={16} className="mr-2" />
                            Payment Instructions
                        </h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">1</span>
                                </div>
                                Pay at least 50% advance to confirm booking
                            </li>
                            <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">2</span>
                                </div>
                                Upload payment proof after transaction
                            </li>
                            <li className="flex items-start">
                                <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-2">
                                    <span className="text-xs font-bold w-4 h-4 flex items-center justify-center">3</span>
                                </div>
                                Balance can be paid 48 hours before event
                            </li>
                        </ul>
                        
                        {/* Warning box for insufficient payment */}
                        {paymentError && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm font-medium text-red-800 flex items-center">
                                    <AlertCircle size={14} className="mr-2" />
                                    Cannot Proceed
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                    You need to pay at least ₹{minimumRequired.toFixed(2)} to continue to next step
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentForm