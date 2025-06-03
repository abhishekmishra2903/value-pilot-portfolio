
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Investment {
  id: string;
  asset_name: string;
  asset_type: string;
  symbol: string | null;
  quantity: number;
  purchase_price: number;
  purchase_date: string;
  current_price: number | null;
  notes: string | null;
}

const InvestmentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    asset_name: '',
    asset_type: '',
    symbol: '',
    quantity: '',
    purchase_price: '',
    purchase_date: '',
    current_price: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchInvestments();
    }
  }, [user]);

  const fetchInvestments = async () => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch investments",
        variant: "destructive",
      });
    } else {
      setInvestments(data || []);
    }
  };

  const resetForm = () => {
    setFormData({
      asset_name: '',
      asset_type: '',
      symbol: '',
      quantity: '',
      purchase_price: '',
      purchase_date: '',
      current_price: '',
      notes: '',
    });
    setEditingInvestment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const investmentData = {
      user_id: user.id,
      asset_name: formData.asset_name,
      asset_type: formData.asset_type,
      symbol: formData.symbol || null,
      quantity: parseFloat(formData.quantity),
      purchase_price: parseFloat(formData.purchase_price),
      purchase_date: formData.purchase_date,
      current_price: formData.current_price ? parseFloat(formData.current_price) : null,
      notes: formData.notes || null,
    };

    let error;

    if (editingInvestment) {
      const { error: updateError } = await supabase
        .from('investments')
        .update(investmentData)
        .eq('id', editingInvestment.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('investments')
        .insert([investmentData]);
      error = insertError;
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: editingInvestment ? "Investment updated successfully" : "Investment added successfully",
      });
      resetForm();
      setIsDialogOpen(false);
      fetchInvestments();
    }

    setLoading(false);
  };

  const handleEdit = (investment: Investment) => {
    setEditingInvestment(investment);
    setFormData({
      asset_name: investment.asset_name,
      asset_type: investment.asset_type,
      symbol: investment.symbol || '',
      quantity: investment.quantity.toString(),
      purchase_price: investment.purchase_price.toString(),
      purchase_date: investment.purchase_date,
      current_price: investment.current_price?.toString() || '',
      notes: investment.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete investment",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Investment deleted successfully",
      });
      fetchInvestments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Investments</h2>
          <p className="text-muted-foreground">Manage your investment portfolio</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingInvestment ? 'Edit Investment' : 'Add New Investment'}
              </DialogTitle>
              <DialogDescription>
                {editingInvestment ? 'Update your investment details' : 'Enter the details of your new investment'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="asset_name">Asset Name</Label>
                <Input
                  id="asset_name"
                  placeholder="Apple Inc."
                  value={formData.asset_name}
                  onChange={(e) => setFormData({ ...formData, asset_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="asset_type">Asset Type</Label>
                <Select
                  value={formData.asset_type}
                  onValueChange={(value) => setFormData({ ...formData, asset_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stock">Stock</SelectItem>
                    <SelectItem value="mutual_fund">Mutual Fund</SelectItem>
                    <SelectItem value="cryptocurrency">Cryptocurrency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="symbol">Symbol (Optional)</Label>
                <Input
                  id="symbol"
                  placeholder="AAPL"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.0001"
                    placeholder="10"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input
                    id="purchase_price"
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current_price">Current Price (Optional)</Label>
                  <Input
                    id="current_price"
                    type="number"
                    step="0.01"
                    placeholder="160.00"
                    value={formData.current_price}
                    onChange={(e) => setFormData({ ...formData, current_price: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes about this investment..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : editingInvestment ? 'Update' : 'Add Investment'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {investments.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <p className="text-muted-foreground">No investments added yet.</p>
                <p className="text-sm text-muted-foreground mt-2">Click "Add Investment" to get started!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          investments.map((investment) => (
            <Card key={investment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {investment.asset_name}
                      {investment.symbol && (
                        <span className="text-sm text-muted-foreground">({investment.symbol})</span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {investment.asset_type.replace('_', ' ').toUpperCase()}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(investment)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(investment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">Quantity</Label>
                    <p className="font-medium">{investment.quantity}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Purchase Price</Label>
                    <p className="font-medium">${investment.purchase_price}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Purchase Date</Label>
                    <p className="font-medium">{new Date(investment.purchase_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Current Price</Label>
                    <p className="font-medium">
                      {investment.current_price ? `$${investment.current_price}` : 'Not set'}
                    </p>
                  </div>
                </div>
                {investment.notes && (
                  <div className="mt-4">
                    <Label className="text-muted-foreground">Notes</Label>
                    <p className="text-sm mt-1">{investment.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InvestmentForm;
