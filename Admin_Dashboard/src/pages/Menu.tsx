import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChefHat, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Menu: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('appetizers');

  const menuItems = {
    appetizers: [
      {
        id: 1,
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls with truffle oil and parmesan',
        price: 18,
        category: 'appetizers',
        dietary: ['vegetarian'],
        availability: 'available',
        prepTime: 15,
        image: '/placeholder-food.jpg'
      },
      {
        id: 2,
        name: 'Seared Scallops',
        description: 'Pan-seared scallops with cauliflower purée and pancetta',
        price: 24,
        category: 'appetizers',
        dietary: ['gluten-free'],
        availability: 'available',
        prepTime: 12,
        image: '/placeholder-food.jpg'
      },
      {
        id: 3,
        name: 'Bruschetta Trio',
        description: 'Three varieties: classic tomato, mushroom, and goat cheese',
        price: 16,
        category: 'appetizers',
        dietary: ['vegetarian'],
        availability: 'limited',
        prepTime: 10,
        image: '/placeholder-food.jpg'
      }
    ],
    mains: [
      {
        id: 4,
        name: 'Wagyu Beef Tenderloin',
        description: 'Grilled wagyu with roasted vegetables and red wine jus',
        price: 65,
        category: 'mains',
        dietary: ['gluten-free'],
        availability: 'available',
        prepTime: 25,
        image: '/placeholder-food.jpg'
      },
      {
        id: 5,
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with lemon herb butter and quinoa pilaf',
        price: 42,
        category: 'mains',
        dietary: ['gluten-free', 'healthy'],
        availability: 'available',
        prepTime: 18,
        image: '/placeholder-food.jpg'
      },
      {
        id: 6,
        name: 'Mushroom Wellington',
        description: 'Puff pastry filled with wild mushrooms and herbs',
        price: 38,
        category: 'mains',
        dietary: ['vegetarian'],
        availability: 'available',
        prepTime: 30,
        image: '/placeholder-food.jpg'
      }
    ],
    desserts: [
      {
        id: 7,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        price: 14,
        category: 'desserts',
        dietary: ['vegetarian'],
        availability: 'available',
        prepTime: 12,
        image: '/placeholder-food.jpg'
      },
      {
        id: 8,
        name: 'Crème Brûlée',
        description: 'Classic vanilla custard with caramelized sugar top',
        price: 12,
        category: 'desserts',
        dietary: ['vegetarian', 'gluten-free'],
        availability: 'available',
        prepTime: 5,
        image: '/placeholder-food.jpg'
      },
      {
        id: 9,
        name: 'Seasonal Fruit Tart',
        description: 'Fresh seasonal fruits on pastry cream and almond crust',
        price: 13,
        category: 'desserts',
        dietary: ['vegetarian'],
        availability: 'seasonal',
        prepTime: 8,
        image: '/placeholder-food.jpg'
      }
    ],
    beverages: [
      {
        id: 10,
        name: 'House Wine Selection',
        description: 'Curated selection of red, white, and rosé wines',
        price: 35,
        category: 'beverages',
        dietary: ['vegan'],
        availability: 'available',
        prepTime: 2,
        image: '/placeholder-drink.jpg'
      },
      {
        id: 11,
        name: 'Craft Cocktails',
        description: 'Premium cocktails made with top-shelf spirits',
        price: 15,
        category: 'beverages',
        dietary: [],
        availability: 'available',
        prepTime: 5,
        image: '/placeholder-drink.jpg'
      },
      {
        id: 12,
        name: 'Artisan Coffee',
        description: 'Single-origin coffee beans, expertly brewed',
        price: 6,
        category: 'beverages',
        dietary: ['vegan'],
        availability: 'available',
        prepTime: 3,
        image: '/placeholder-drink.jpg'
      }
    ]
  };

  const categories = [
    { id: 'appetizers', name: 'Appetizers', icon: Utensils },
    { id: 'mains', name: 'Main Courses', icon: ChefHat },
    { id: 'desserts', name: 'Desserts', icon: Utensils },
    { id: 'beverages', name: 'Beverages', icon: Utensils }
  ];

  const getAvailabilityBadge = (availability: string) => {
    switch (availability) {
      case 'available':
        return <Badge className="bg-success text-success-foreground">Available</Badge>;
      case 'limited':
        return <Badge className="bg-warning text-warning-foreground">Limited</Badge>;
      case 'seasonal':
        return <Badge variant="outline">Seasonal</Badge>;
      default:
        return <Badge variant="secondary">{availability}</Badge>;
    }
  };

  const getDietaryBadge = (dietary: string) => {
    const colors = {
      vegetarian: 'bg-green-100 text-green-800',
      vegan: 'bg-green-100 text-green-800',
      'gluten-free': 'bg-blue-100 text-blue-800',
      healthy: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge variant="outline" className={colors[dietary as keyof typeof colors]}>
        {dietary}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <p className="text-muted-foreground">Manage your catering menu and pricing</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Menu Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((category) => {
          const items = menuItems[category.id as keyof typeof menuItems];
          const Icon = category.icon;
          
          return (
            <Card key={category.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
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

      {/* Menu Tabs */}
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
              {menuItems[category.id as keyof typeof menuItems].map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-foreground flex items-center gap-3">
                              {item.name}
                              {getAvailabilityBadge(item.availability)}
                            </h3>
                            <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="text-2xl font-bold text-foreground">${item.price}</p>
                            <p className="text-sm text-muted-foreground">per serving</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Preparation Time</p>
                            <p className="font-medium">{item.prepTime} minutes</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">Dietary Information</p>
                            <div className="flex flex-wrap gap-1">
                              {item.dietary.length > 0 ? (
                                item.dietary.map((diet, index) => (
                                  <div key={index}>{getDietaryBadge(diet)}</div>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">Standard</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Item ID: {item.id.toString().padStart(3, '0')}
                          </span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </Button>
                          </div>
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