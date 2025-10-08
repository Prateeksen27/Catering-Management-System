import React, { useState } from 'react';
import { Package, TrendingUp, TrendingDown, AlertTriangle, Plus, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Store: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('equipment');

  const inventory = {
    equipment: [
      {
        id: 1,
        name: 'Professional Camera Kit',
        category: 'Photography',
        currentStock: 5,
        minStock: 2,
        maxStock: 8,
        unitCost: 2500,
        supplier: 'Canon Pro Supplies',
        lastRestocked: '2024-04-15',
        status: 'in-stock'
      },
      {
        id: 2,
        name: 'Sound System Set',
        category: 'Audio Equipment',
        currentStock: 3,
        minStock: 2,
        maxStock: 6,
        unitCost: 1800,
        supplier: 'Audio Dynamics',
        lastRestocked: '2024-03-20',
        status: 'in-stock'
      },
      {
        id: 3,
        name: 'LED Lighting Kit',
        category: 'Lighting',
        currentStock: 1,
        minStock: 3,
        maxStock: 10,
        unitCost: 800,
        supplier: 'BrightLights Co',
        lastRestocked: '2024-02-10',
        status: 'low-stock'
      },
      {
        id: 4,
        name: 'Portable Stage Platform',
        category: 'Event Setup',
        currentStock: 8,
        minStock: 4,
        maxStock: 12,
        unitCost: 450,
        supplier: 'StageWorks Ltd',
        lastRestocked: '2024-04-01',
        status: 'in-stock'
      }
    ],
    supplies: [
      {
        id: 5,
        name: 'Table Linens (White)',
        category: 'Linens',
        currentStock: 50,
        minStock: 20,
        maxStock: 100,
        unitCost: 25,
        supplier: 'Premium Textiles',
        lastRestocked: '2024-04-20',
        status: 'in-stock'
      },
      {
        id: 6,
        name: 'Centerpiece Vases',
        category: 'Decoration',
        currentStock: 15,
        minStock: 10,
        maxStock: 30,
        unitCost: 35,
        supplier: 'Glass & More',
        lastRestocked: '2024-03-15',
        status: 'in-stock'
      },
      {
        id: 7,
        name: 'Disposable Plates (Premium)',
        category: 'Catering Supplies',
        currentStock: 500,
        minStock: 200,
        maxStock: 1000,
        unitCost: 2,
        supplier: 'Party Supplies Inc',
        lastRestocked: '2024-04-25',
        status: 'in-stock'
      },
      {
        id: 8,
        name: 'Floral Arrangements',
        category: 'Decoration',
        currentStock: 5,
        minStock: 15,
        maxStock: 40,
        unitCost: 75,
        supplier: 'Fresh Flowers Daily',
        lastRestocked: '2024-04-18',
        status: 'low-stock'
      }
    ],
    furniture: [
      {
        id: 9,
        name: 'Round Tables (8-seat)',
        category: 'Tables',
        currentStock: 25,
        minStock: 20,
        maxStock: 50,
        unitCost: 180,
        supplier: 'Event Furniture Co',
        lastRestocked: '2024-03-10',
        status: 'in-stock'
      },
      {
        id: 10,
        name: 'Chiavari Chairs (Gold)',
        category: 'Seating',
        currentStock: 150,
        minStock: 100,
        maxStock: 300,
        unitCost: 45,
        supplier: 'Elegant Seating',
        lastRestocked: '2024-04-05',
        status: 'in-stock'
      },
      {
        id: 11,
        name: 'Bar Setup Kit',
        category: 'Bar Equipment',
        currentStock: 3,
        minStock: 2,
        maxStock: 8,
        unitCost: 650,
        supplier: 'Bar Essentials Pro',
        lastRestocked: '2024-02-28',
        status: 'in-stock'
      },
      {
        id: 12,
        name: 'Lounge Furniture Set',
        category: 'Seating',
        currentStock: 0,
        minStock: 2,
        maxStock: 6,
        unitCost: 1200,
        supplier: 'Luxury Lounge Co',
        lastRestocked: '2024-01-15',
        status: 'out-of-stock'
      }
    ]
  };

  const categories = [
    { id: 'equipment', name: 'Equipment', icon: Package },
    { id: 'supplies', name: 'Supplies', icon: Package },
    { id: 'furniture', name: 'Furniture', icon: Package }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge className="bg-success text-success-foreground">In Stock</Badge>;
      case 'low-stock':
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge className="bg-destructive text-destructive-foreground">Out of Stock</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'low-stock':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'out-of-stock':
        return <TrendingDown className="h-5 w-5 text-destructive" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStockLevel = (current: number, min: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  const getTotalValue = (items: any[]) => {
    return items.reduce((total, item) => total + (item.currentStock * item.unitCost), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Store Inventory</h1>
          <p className="text-muted-foreground">Manage your equipment, supplies, and furniture inventory</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(inventory).flat().length}
                </p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${getTotalValue(Object.values(inventory).flat()).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(inventory).flat().filter(item => item.status === 'low-stock').length}
                </p>
                <p className="text-sm text-muted-foreground">Low Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Object.values(inventory).flat().filter(item => item.status === 'out-of-stock').length}
                </p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-4">
              {inventory[category.id as keyof typeof inventory].map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          {item.name}
                          {getStatusBadge(item.status)}
                        </h3>
                        <p className="text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          ${(item.currentStock * item.unitCost).toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="font-medium">{item.currentStock} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Unit Cost</p>
                        <p className="font-medium">${item.unitCost}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Supplier</p>
                        <p className="font-medium">{item.supplier}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Restocked</p>
                        <p className="font-medium">{item.lastRestocked}</p>
                      </div>
                    </div>

                    {/* Stock Level Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Stock Level</span>
                        <span className="text-muted-foreground">
                          {item.currentStock} / {item.maxStock}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.status === 'out-of-stock' ? 'bg-destructive' :
                            item.status === 'low-stock' ? 'bg-warning' : 'bg-success'
                          }`}
                          style={{ width: `${getStockLevel(item.currentStock, item.minStock, item.maxStock)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <span>Min: {item.minStock} units</span>
                        <span className="ml-4">Item ID: #{item.id.toString().padStart(3, '0')}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          Restock
                        </Button>
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

export default Store;