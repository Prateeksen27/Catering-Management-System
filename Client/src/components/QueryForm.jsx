import React, { useState } from "react";
import { clientAuthStore } from "../store/clientStore";
import { Button, Loader, NumberInput, Textarea, TextInput } from "@mantine/core";
import { AtSign, Calendar, IndianRupee, Phone, Users } from "lucide-react";
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';

const QueryForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    eventName: "",
    email: "",
    phone: 0,
    eventDate: null,
    budget: 0,
    message: "",
    pax: 0
  });

  const { sendQuery, isLoading } = clientAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    sendQuery(formData);

    // Reset form after submit if needed
    setFormData({
      clientName: "",
      eventName: "",
      email: "",
      phone: 0,
      eventDate: null,
      budget: 0,
      message: "",
      pax: 0
    });
  };

  return (
    <div className="bg-gray-50 w-full py-16 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Have a Query? Contact Us</h2>

        <div className="flex flex-col gap-5 [&>*]:w-full">
          <div className="flex flex-col md:flex-row gap-5 [&>*]:w-full md:[&>*]:w-1/2">
            <TextInput
              label="Full Name"
              withAsterisk
              placeholder="Enter your Name"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.currentTarget.value })
              }
            />
            <TextInput
              label="Email"
              withAsterisk
              placeholder="Enter your email"
              value={formData.email}
              leftSection={<AtSign />}
              onChange={(e) =>
                setFormData({ ...formData, email: e.currentTarget.value })
              }
            />
          </div>

          <div className="flex flex-col md:flex-row gap-5 [&>*]:w-full md:[&>*]:w-1/2">
            <NumberInput
              label="Phone No"
              placeholder="Enter Your Phone Number"
              value={formData.phone}
              leftSection={<Phone />}
              withAsterisk
              onChange={(value) => setFormData({ ...formData, phone: value })}
              min={0}
              max={9999999999}
            />
            <TextInput
              label="Event Name"
              withAsterisk
              placeholder="Enter the Event Name"
              value={formData.eventName}
              onChange={(e) =>
                setFormData({ ...formData, eventName: e.currentTarget.value })
              }
            />
          </div>

          <div className="flex flex-col md:flex-row gap-5 [&>*]:w-full md:[&>*]:w-1/2">
            <DateInput
              minDate={dayjs().toDate()}
              maxDate={dayjs().add(1, 'month').toDate()}
              label="Event Date"
              withAsterisk
              leftSection={<Calendar />}
              placeholder="Enter your event date"
              value={formData.eventDate}
              onChange={(date) => setFormData({ ...formData, eventDate: date })}
            />
            <NumberInput
              label="Event Budget(Approx)"
              placeholder="Enter Your Budget"
              withAsterisk
              value={formData.budget}
              leftSection={<IndianRupee />}
              onChange={(value) => setFormData({ ...formData, budget: value })}
              min={0}
            />
          </div>

          <Textarea
            label="Query"
            placeholder="Enter Your Query Here"
            autosize
            withAsterisk
            minRows={2}
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.currentTarget.value })
            }
          />

          <NumberInput
            label="Number of Guest(Approx)"
            placeholder="Enter Number of Guest"
            value={formData.pax}
            withAsterisk
            leftSection={<Users />}
            onChange={(value) => setFormData({ ...formData, pax: value })}
            min={0}
          />

          <Button onClick={handleSubmit}  variant="filled" color="red">
            Submit Query
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QueryForm;
