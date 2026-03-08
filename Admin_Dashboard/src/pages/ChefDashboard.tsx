import React, { useEffect, useState } from "react";
import { Flame, Clock, CheckCircle, Package, Plus, FileText, Upload } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDisclosure } from "@mantine/hooks";
import { Modal, TextInput, NumberInput, Select, Textarea } from "@mantine/core";
import { useChefRequirementStore } from "@/store/useChefRequirementStore";
import { useAuthStore } from "@/store/useAuthStore";

const ChefDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const {
    myRequirements,
    pendingBookings,
    fetchMyRequirements,
    submitRequirement,
    uploadFile,
    isLoading,
  } = useChefRequirementStore();

  const [requirementModalOpened, { open: openRequirementModal, close: closeRequirementModal }] = useDisclosure(false);

  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const [ingredients, setIngredients] = useState([
    { ingredientName: "", quantity: 0, unit: "kg" },
  ]);

  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user?.empType === "Chef") {
      fetchMyRequirements();
    }
  }, [user]);

  const pendingRequirements = pendingBookings || [];
  const submittedRequirements = myRequirements || [];

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { ingredientName: "", quantity: 0, unit: "kg" }]);
  };

  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  const handleSubmitRequirement = async () => {
    if (!selectedBooking) return;


    const validIngredients = ingredients.filter(
      (i) => i.ingredientName && i.quantity > 0
    );

    if (validIngredients.length === 0) {
      alert("Please add at least one ingredient");
      return;
    }

    try {
      const payload = {
        bookingId: selectedBooking._id,
        ingredients: validIngredients,
        estimatedCost,
        notes,
        files: [],
      };

      const result = await submitRequirement(payload);

      if (selectedFile && result.requirement) {
        await uploadFile(result.requirement._id, selectedFile);
      }

      closeRequirementModal();

      setIngredients([{ ingredientName: "", quantity: 0, unit: "kg" }]);
      setEstimatedCost(0);
      setNotes("");
      setSelectedFile(null);

      fetchMyRequirements();
    } catch (error) {
      console.error("Requirement submit error:", error);
    }

  };

  const unitOptions = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "litres", label: "Litres" },
    { value: "grams", label: "Grams (g)" },
    { value: "pieces", label: "Pieces" },
    { value: "packets", label: "Packets" },
    { value: "bottles", label: "Bottles" },
    { value: "dozen", label: "Dozen" },
    { value: "boxes", label: "Boxes" },
  ];

  return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

    ```
    <div>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
        Chef Dashboard
      </h1>
      <p className="text-muted-foreground">
        Welcome, {user?.name || "Chef"}!
      </p>
    </div>

    <Tabs defaultValue="orders" className="space-y-6">

      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="orders">Kitchen Orders</TabsTrigger>
        <TabsTrigger value="requirements">Provide Requirement</TabsTrigger>
      </TabsList>

      {/* ORDERS TAB */}
      <TabsContent value="orders">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <StatsCard
            title="Pending Requirements"
            value={pendingRequirements.length}
            icon={<Clock />}
          />

          <StatsCard
            title="Submitted Requirements"
            value={submittedRequirements.length}
            icon={<Flame />}
          />

          <StatsCard
            title="Completed Today"
            value={0}
            icon={<CheckCircle />}
          />

        </div>
      </TabsContent>

      {/* REQUIREMENT TAB */}
      <TabsContent value="requirements">
        <Card>

          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              My Event Requirements
            </CardTitle>
          </CardHeader>

          <CardContent>

            {pendingRequirements.length === 0 &&
              submittedRequirements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto mb-4 opacity-50" />
                No events assigned yet.
              </div>
            ) : (
              <div className="space-y-4">

                {/* PENDING EVENTS */}
                {pendingRequirements.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">
                        {booking.eventDetails.eventName}
                      </h4>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          booking.eventDetails.eventDate
                        ).toLocaleDateString()} |{" "}
                        {booking.eventDetails.pax} guests
                      </p>

                      <Badge variant="secondary">
                        Requirement Pending
                      </Badge>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedBooking(booking);
                        openRequirementModal();
                      }}
                    >
                      Submit Requirements
                    </Button>
                  </div>
                ))}

                {/* SUBMITTED REQUIREMENTS */}
                {submittedRequirements.map((req: any) => (
                  <div
                    key={req._id}
                    className="flex justify-between items-center p-4 border rounded-lg bg-green-50"
                  >
                    <div>
                      <h4 className="font-medium">
                        {req.bookingId?.eventDetails?.eventName}
                      </h4>

                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          req.bookingId?.eventDetails?.eventDate
                        ).toLocaleDateString()} |{" "}
                        {req.bookingId?.eventDetails?.pax} guests
                      </p>

                      <Badge className="bg-green-600">
                        {req.status}
                      </Badge>
                    </div>

                    <div className="text-right">
                      <p className="font-medium">
                        ₹{req.estimatedCost || 0}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {req.ingredients?.length || 0} items
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* REQUIREMENT MODAL */}
    {/* REQUIREMENT MODAL */}
    <Modal
      opened={requirementModalOpened}
      onClose={closeRequirementModal}
      title="Submit Grocery Requirements"
      size="lg"
    >

      <div className="space-y-4">

        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium">
            {selectedBooking?.eventDetails?.eventName}
          </h4>

          <p className="text-sm text-muted-foreground">
            {selectedBooking?.eventDetails?.pax} guests |{" "}
            {selectedBooking?.eventDetails?.venue}
          </p>
        </div>

        {/* MENU SECTION */}
        <div className="space-y-2">
          <h4 className="font-semibold">Event Menu</h4>

          <div className="flex flex-wrap gap-2">

            {selectedBooking?.menu?.starters?.map((item: string, i: number) => (
              <Badge key={`starter-${i}`} variant="outline">
                Starter: {item}
              </Badge>
            ))}


            {selectedBooking?.menu?.maincourse?.map((item: string, i: number) => (
              <Badge key={`main-${i}`} variant="outline">
                Main: {item}
              </Badge>
            ))}

            {selectedBooking?.menu?.desserts?.map((item: string, i: number) => (
              <Badge key={`dessert-${i}`} variant="outline">
                Dessert: {item}
              </Badge>
            ))}

            {selectedBooking?.menu?.beverages?.map((item: string, i: number) => (
              <Badge key={`beverage-${i}`} variant="outline">
                Beverage: {item}
              </Badge>
            ))}
            {selectedBooking?.customMenuItems?.map((customItem: any, index: number) => (
              <Badge key={`custom-${index}`} variant="outline">
                {String(customItem.name)}
              </Badge>
            ))}

          </div>
        </div>

        {/* INGREDIENTS */}
        {ingredients.map((ing, index) => (
          <div key={index} className="flex gap-2">

            <TextInput
              placeholder="Ingredient"
              value={ing.ingredientName}
              onChange={(e) =>
                handleIngredientChange(
                  index,
                  "ingredientName",
                  e.target.value
                )
              }
            />

            <NumberInput
              placeholder="Qty"
              value={ing.quantity}
              onChange={(v) =>
                handleIngredientChange(index, "quantity", v)
              }
            />

            <Select
              data={unitOptions}
              value={ing.unit}
              onChange={(v) =>
                handleIngredientChange(index, "unit", v)
              }
            />
          </div>
        ))}

        <Button
          variant="outline"
          onClick={handleAddIngredient}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>

        <NumberInput
          label="Estimated Cost"
          value={estimatedCost}
          onChange={(v) => setEstimatedCost(Number(v) || 0)}
        />

        <Textarea
          label="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) =>
            setSelectedFile(e.target.files?.[0] || null)
          }
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeRequirementModal}>
            Cancel
          </Button>

          <Button onClick={handleSubmitRequirement}>
            Submit Requirements
          </Button>
        </div>

      </div>

    </Modal>

  </div>

  );
};

export default ChefDashboard;
