import React, { useEffect, useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { IconCurrencyRupee } from "@tabler/icons-react";
import { Button, Modal, NativeSelect, NumberInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";

import { useInventoryStore } from "../store/useInventory";

const Inventory = () => {
  const {
    inventory,
    fetchInventory,
    createInventoryItem,
    updateInventoryItem,
    restockInventoryItem
  } = useInventoryStore();

  const [activeCategory, setActiveCategory] = useState("vegetables");
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isStock, setIsStock] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  const [data, setData] = useState({
    name: "",
    category: "vegetables",
    unit_cost: 0,
    supplierName: "",
    min_stock: 0
  });

  const [stockData, setStockData] = useState({
    current_stock: 0,
    addedStock: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  console.log(inventory);
  
  /* ================= CONSTANTS ================= */

  const categories = [
    { id: "vegetables", name: "Vegetables", icon: Package },
    { id: "groceries", name: "Groceries", icon: Package },
    { id: "dairy", name: "Dairy", icon: Package }
  ];

  /* ================= HELPERS ================= */

  const getStatusBadge = (status) => {
    if (status === "in-stock")
      return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
    if (status === "limited-stock")
      return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
    return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
  };

  const getStockLevel = (current, total) =>
    Math.min(100, Math.round((current / (total || 1)) * 100));

  const getTotalValue = (items) =>
    items.reduce((sum, i) => sum + i.current_stock * i.unit_cost, 0);

  const resetForm = () => {
    setData({
      name: "",
      category: "vegetables",
      unit_cost: 0,
      supplierName: "",
      min_stock: 0
    });
    setStockData({ current_stock: 0, addedStock: 0 });
    setIsEditing(false);
    setIsStock(false);
    setEditItemId(null);
  };

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = async () => {
    console.log(data);
    
    if (!data.name || !data.category || !data.unit_cost || !data.supplierName || !data.min_stock) {
      return toast.error("Please fill all fields");
    }

    if (isEditing) {
      await updateInventoryItem(editItemId, data);
    } else {
      await createInventoryItem(data);
    }

    close();
    resetForm();
  };

  /* ================= RESTOCK ================= */

  const handleRestock = async () => {
    if (stockData.addedStock <= 0) {
      return toast.error("Added stock must be greater than 0");
    }

    await restockInventoryItem(editItemId, stockData);
    close();
    resetForm();
  };

  /* ================= ACTION HANDLERS ================= */

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditItemId(item._id);
    setData({
      name: item.name,
      category: item.category,
      unit_cost: item.unit_cost,
      supplierName: item.supplierName,
      min_stock: item.min_stock
    });
    open();
  };

  const handleStock = (item) => {
    setIsStock(true);
    setEditItemId(item._id);
    setStockData({
      current_stock: item.current_stock,
      addedStock: 0
    });
    open();
  };

  /* ================= RENDER ================= */

  const allItems = Object.values(inventory || {}).flat();

  return (
    <div className="space-y-6">
      {/* ================= MODAL ================= */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          isStock ? "Update Stock" : isEditing ? "Update Inventory Item" : "Add Inventory Item"
        }
        size="lg"
      >
        {!isStock ? (
          <div className="flex flex-col gap-4">
            <TextInput
              label="Item Name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              withAsterisk
            />
            <TextInput
              label="Supplier Name"
              value={data.supplierName}
              onChange={(e) => setData({ ...data, supplierName: e.target.value })}
              withAsterisk
            />
            <NativeSelect
              label="Category"
              data={categories.map((c) => c.id)}
              value={data.category}
              onChange={(e) => setData({ ...data, category: e.target.value })}
              withAsterisk
            />
            <NumberInput
              label="Unit Cost"
              min={0}
              value={data.unit_cost}
              onChange={(v) => setData({ ...data, unit_cost: Number(v) })}
              withAsterisk
            />
            <NumberInput
              label="Minimum Stock"
              min={0}
              value={data.min_stock}
              onChange={(v) => setData({ ...data, min_stock: Number(v) })}
              withAsterisk
            />
            <Button onClick={handleSubmit}>
              {isEditing ? "Update Item" : "Create Item"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <NumberInput
              label="Current Stock"
              value={stockData.current_stock}
              disabled 
            />
            <NumberInput
              label="Add Stock"
              min={1}
              value={stockData.addedStock}
              onChange={(v) =>
                setStockData({ ...stockData, addedStock: Number(v) })
              }
              withAsterisk
            />
            <Button onClick={handleRestock}>Update Stock</Button>
          </div>
        )}
      </Modal>

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Manage vegetables, groceries, and dairy stock
          </p>
        </div>
        <Button onClick={() => { resetForm(); open(); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
              {/* Total Items */}
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{Object.values(inventory || {}).flat().length}</p>
                    <p className="text-sm text-muted-foreground">Total Items</p>
                  </div>
                </CardContent>
              </Card>
      
              {/* Total Value */}
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold flex items-center">
                      <IconCurrencyRupee className="mr-1" />
                      {getTotalValue(Object.values(inventory || {}).flat()).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Value</p>
                  </div>
                </CardContent>
              </Card>
      
              {/* Low Stock */}
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Object.values(inventory || {}).flat().filter((item) => item.status === 'limited-stock').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Low Stock</p>
                  </div>
                </CardContent>
              </Card>
      
              {/* Out of Stock */}
              <Card>
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-3 bg-red-100 rounded-lg">
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {Object.values(inventory || {}).flat().filter((item) => item.status === 'out-of-stock').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
                  </div>
                </CardContent>
              </Card>
            </div>

      {/* ================= CATEGORY FILTER ================= */}
      <div className="grid grid-cols-3 gap-2">
        {categories.map((c) => (
          <Button
            key={c.id}
            variant={activeCategory === c.id ? "filled" : "outline"}
            onClick={() => setActiveCategory(c.id)}
          >
            {c.name}
          </Button>
        ))}
      </div>

      {/* ================= INVENTORY LIST ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory?.[activeCategory]?.map((item) => (
          <Card key={item._id} className="hover:shadow-md">
            <CardContent className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold flex gap-2">
                  {item.name}
                  {getStatusBadge(item.status)}
                </h3>
                <span className="font-bold">
                  ₹{item.current_stock * item.unit_cost}
                </span>
              </div>

              <p className="text-sm text-muted-foreground capitalize">
                {item.category}
              </p>

              <p>
                Stock: {item.current_stock} / {item.total_stock}
              </p>

              <div className="bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    item.status === "out-of-stock"
                      ? "bg-red-500"
                      : item.status === "limited-stock"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${getStockLevel(
                      item.current_stock,
                      item.total_stock
                    )}%`
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" onClick={() => handleStock(item)}>
                  Restock
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
