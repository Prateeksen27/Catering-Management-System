import React, { useEffect, useState } from 'react';
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Edit
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStoreItemsStore } from '../store/useItemsStore';
import { IconCurrencyRupee } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Button, Modal, NativeSelect, NumberInput, TextInput } from '@mantine/core';
import toast from 'react-hot-toast';

const Store: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('equipment');
  const { storeItems, fetchStoreItems, createStoreItem, updateStoreItem, updateStockItem } = useStoreItemsStore();
  const [opened, { open, close }] = useDisclosure(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [isStock, setIsStock] = useState(false);
  const [total, setTotal] = useState(0);

  const [data, setData] = useState({
    name: '',
    type: '',
    unit_cost: 0,
    current_stock: 0,
    supplierName: '',
    min_stock: 0,
    category: ''
  });

  const [stockData, setStockData] = useState({
    current_stock: 0,
    addedStock: 0,
    category: ''
  });

  useEffect(() => {
    fetchStoreItems();
  }, [fetchStoreItems]);

  const categories = [
    { id: 'equipment', name: 'Equipment', icon: Package },
    { id: 'supplies', name: 'Supplies', icon: Package },
    { id: 'furniture', name: 'Furniture', icon: Package }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'limited-stock':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'limited-stock':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'out-of-stock':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStockLevel = (current: number, _min: number, max: number) => {
    return Math.min(100, Math.round((current / (max || 1)) * 100));
  };

  const getTotalValue = (items: any[]) => {
    return items.reduce((total, item) => total + (item.current_stock * item.unit_cost), 0);
  };

  const types = [
    'Photography',
    'Audio Equipment',
    'Lighting',
    'Event Setup',
    'Decoration',
    'Catering Supplies',
    'Tables',
    'Seating'
  ];

  const catc = ['equipment', 'supplies', 'furniture'];

  const resetForm = () => {
    setData({
      name: '',
      type: '',
      unit_cost: 0,
      current_stock: 0,
      supplierName: '',
      min_stock: 0,
      category: ''
    });
    setIsEditing(false);
    setEditItemId(null);
    setIsStock(false);
  };

  const handleCreate = async () => {
    if (!data.name || !data.type || !data.unit_cost || !data.supplierName || !data.min_stock || !data.category) {
      return toast.error('Please fill all the fields!');
    }
    try {
      if (isEditing && editItemId) {
        await updateStoreItem(editItemId, data, data.category);
      } else {
        await createStoreItem(data);
      }
      close();
      resetForm();
      await fetchStoreItems();
    } catch (error) {
      console.error('Error submitting item', error);
      toast.error('Something went wrong!');
    }
  };

  const handleStockChange = async () => {
    if (stockData.current_stock > total) {
      return toast.error('Current stock cannot exceed total stock!');
    }
    try {
      if (isStock && editItemId) {
        await updateStockItem(stockData, editItemId);
      }
      close();
      resetForm();
      await fetchStoreItems();
    } catch (error) {
      console.error('Error updating stock', error);
      toast.error('Failed to update stock!');
    }
  };

  const handleEdit = (item: any) => {
    if (!item) return;
    setIsEditing(true);
    setEditItemId(item._id);
    setData({
      name: item.name || '',
      supplierName: item.supplierName || '',
      unit_cost: item.unit_cost || 0,
      type: item.type || '',
      category: item.category || '',
      min_stock: item.min_stock || 0,
      current_stock: item.current_stock || 0
    });
    open();
  };

  const handleStockExchange = (item: any) => {
    if (!item) return;
    setIsStock(true);
    setEditItemId(item._id);
    setTotal(item.total_stock);
    setStockData({
      current_stock: item.current_stock,
      addedStock: 0,
      category: item.category
    });
    open();
  };

  const getModalTitle = () => {
    if (isStock) return 'Add or Update Stock';
    if (isEditing) return 'Update Item';
    return 'Add New Item';
  };

  return (
    <div className="space-y-6">
      {/* Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title={getModalTitle()}
        size="lg"
        overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      >
        {!isStock ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2">
              <TextInput label="Item Name" placeholder="Enter item name" withAsterisk value={data.name} onChange={(e) => setData({ ...data, name: e.currentTarget.value })} className="w-full md:w-1/2" />
              <NativeSelect label="Item Type" withAsterisk data={types} value={data.type} onChange={(e) => setData({ ...data, type: e.currentTarget.value })} className="w-full md:w-1/2" />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <TextInput label="Supplier Name" placeholder="Enter Supplier Name" withAsterisk value={data.supplierName} onChange={(e) => setData({ ...data, supplierName: e.currentTarget.value })} className="w-full md:w-1/2" />
              <NativeSelect label="Category" withAsterisk data={catc} value={data.category} onChange={(e) => setData({ ...data, category: e.currentTarget.value })} className="w-full md:w-1/2" />
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <NumberInput label="Unit Cost" min={0} withAsterisk value={data.unit_cost} onChange={(v) => setData({ ...data, unit_cost: Number(v) })} className="w-full md:w-1/2" />
              <NumberInput label="Min Stock" min={0} withAsterisk value={data.min_stock} onChange={(v) => setData({ ...data, min_stock: Number(v) })} className="w-full md:w-1/2" />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreate}>{isEditing ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <NumberInput label="Current Stock" min={0} withAsterisk value={stockData.current_stock} onChange={(v) => setStockData({ ...stockData, current_stock: Number(v) })} />
            <NumberInput label="Add Stock" min={0} withAsterisk value={stockData.addedStock} onChange={(v) => setStockData({ ...stockData, addedStock: Number(v) })} />
            <div className="flex justify-end">
              <Button onClick={handleStockChange}>Update</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground">Manage your equipment, supplies, and furniture inventory</p>
        </div>
        <Button onClick={() => { resetForm(); open(); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full">
        {/* Total Items */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Object.values(storeItems || {}).flat().length}</p>
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
                {getTotalValue(Object.values(storeItems || {}).flat()).toLocaleString()}
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
                {Object.values(storeItems || {}).flat().filter((item) => item.status === 'limited-stock').length}
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
                {Object.values(storeItems || {}).flat().filter((item) => item.status === 'out-of-stock').length}
              </p>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-3 w-full">
          {categories.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>{c.name}</TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {storeItems[category.id as keyof typeof storeItems]?.map(
                (item: any) => (
                  <Card
                    key={item._id}
                    className="hover:shadow-lg transition-shadow duration-200"
                  >
                    <CardContent className="p-5 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 text-lg">
                            {item.name}
                            {getStatusBadge(item.status)}
                          </h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold flex items-center">
                            <IconCurrencyRupee className="h-4 w-4" />
                            {(item.current_stock * item.unit_cost).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Total Value
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 text-sm gap-2">
                        <p>
                          <span className="text-muted-foreground">Stock:</span>{" "}
                          {item.current_stock}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Min:</span>{" "}
                          {item.min_stock}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Supplier:</span>{" "}
                          {item.supplierName}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Unit:</span>{" "}
                          ₹{item.unit_cost}
                        </p>
                      </div>

                      <div className="bg-muted rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${item.status === "out-of-stock"
                              ? "bg-destructive"
                              : item.status === "low-stock"
                                ? "bg-warning"
                                : "bg-success"
                            }`}
                          style={{
                            width: `${getStockLevel(
                              item.current_stock,
                              item.min_stock,
                              item.total_stock
                            )}%`,
                          }}
                        ></div>
                      </div>

                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleStockExchange(item)}
                        >
                          Restock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Store;
