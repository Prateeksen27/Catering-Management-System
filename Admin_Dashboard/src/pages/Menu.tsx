import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ChefHat, Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuStore } from "../store/useMenuStore";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Modal,
  NativeSelect,
  NumberInput,
  TextInput,
} from "@mantine/core";
import toast from "react-hot-toast";

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("appetizers");
  const { menu, fetchMenu, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [data, setData] = useState({
    name: "",
    smallDesc: "",
    perServingAmount: 0,
    type: "",
    category: "",
  });

  const categories = [
    { id: "appetizers", name: "Appetizers", icon: Utensils },
    { id: "mains", name: "Main Courses", icon: ChefHat },
    { id: "desserts", name: "Desserts", icon: Utensils },
    { id: "beverages", name: "Beverages", icon: Utensils },
  ];

  const foodTypes = ["veg", "non-veg", "seasonal"];
  const cate = ["appetizers", "mains", "desserts", "beverages"];

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  // 🟢 Add or Update handler
  const handleSubmit = async () => {
    if (!data.name || !data.type || !data.category || !data.perServingAmount) {
      return toast.error("Please fill all the fields");
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editItemId) {
        await updateMenuItem(editItemId, data);
      } else {
        await addMenuItem(data);
      }
      close();
      resetForm();
      await fetchMenu();
    } catch (error) {
      console.error("Error submitting item:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setData({
      name: "",
      smallDesc: "",
      perServingAmount: 0,
      type: "",
      category: "",
    });
    setIsEditing(false);
    setEditItemId(null);
  };

  const handleEdit = (item: any) => {
    if (!item) return;
    setIsEditing(true);
    setEditItemId(item._id);
    setData({
      name: item.name || "",
      smallDesc: item.smallDesc || "",
      perServingAmount: item.perServingAmount || 0,
      type: item.type || "",
      category: item.category || "",
    });
    open();
  };

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case "veg":
        return <Badge className="bg-green-600 text-white border-green-700">Veg</Badge>;
      case "non-veg":
        return <Badge className="bg-red-700 text-white border-red-800">Non-Veg</Badge>;
      case "seasonal":
        return <Badge variant="outline">Seasonal</Badge>;
      default:
        return <Badge variant="secondary">{availability || "N/A"}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* ---------------- MODAL ---------------- */}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          resetForm();
        }}
        title={isEditing ? "Edit Menu Item" : "Add New Menu Item"}
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        <TextInput
          label="Item Name"
          placeholder="Enter Item Name"
          withAsterisk
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.currentTarget.value })}
        />
        <TextInput
          label="Small Description"
          my="sm"
          placeholder="Enter Description"
          withAsterisk
          value={data.smallDesc}
          onChange={(e) => setData({ ...data, smallDesc: e.currentTarget.value })}
        />
        <NumberInput
          label="Per Serving Amount"
          placeholder="Enter the amount here"
          withAsterisk
          min={0}
          my="sm"
          value={data.perServingAmount}
          onChange={(value) =>
            setData({ ...data, perServingAmount: Number(value) || 0 })
          }
        />
        <NativeSelect
          my="sm"
          label="Type"
          withAsterisk
          data={["Select Type", ...foodTypes]}
          value={data.type || "Select Type"}
          onChange={(e) => {
            const value = e.currentTarget.value === "Select Type" ? "" : e.currentTarget.value;
            setData({ ...data, type: value });
          }}
        />
        <NativeSelect
          my="sm"
          label="Category"
          withAsterisk
          data={["Select Category", ...cate]}
          value={data.category || "Select Category"}
          onChange={(e) => {
            const value =
              e.currentTarget.value === "Select Category" ? "" : e.currentTarget.value;
            setData({ ...data, category: value });
          }}
        />
        <div className="flex justify-end">
          <Button
            variant="filled"
            onClick={handleSubmit}
            radius="md"
            loading={isSubmitting}
          >
            {isEditing ? "Update" : "Add"}
          </Button>
        </div>
      </Modal>

      {/* ---------------- HEADER ---------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your catering menu and pricing</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            open();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* ---------------- CATEGORY STATS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const items = menu[category.id as keyof typeof menu] || [];
          return (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{items.length}</p>
                    <p className="text-sm text-muted-foreground">{category.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ---------------- MENU TABS ---------------- */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-4">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-4">
              {(menu[category.id as keyof typeof menu] || []).map((item) => (
                <Card
                  key={item._id || item.name}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
                              {item.name || "Unnamed"}
                              {getAvailabilityBadge(item.type)}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">
                              {item.smallDesc || "-"}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold flex items-center text-foreground">
                              <IconCurrencyRupee />
                              {item.perServingAmount || 0}
                            </p>
                            <p className="text-sm text-muted-foreground">per serving</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            color="red"
                            onClick={() => deleteMenuItem(item._id, category.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Menu;
