import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  CreditCard,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Users,
  Eye,
  Receipt,
  Loader,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { apiCall } from '@/lib/api';

interface Fee {
  id: number;
  student_id: number;
  student_name: string;
  fee_type: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
}

interface FeeSummary {
  total_collected: number;
  total_pending: number;
  total_overdue: number;
  total_partial: number;
  students_paid: number;
  students_pending: number;
  students_overdue: number;
}

export default function Finance() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [summary, setSummary] = useState<FeeSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

  useEffect(() => {
    fetchFees();
  }, [selectedStatus]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const [feesData, summaryData] = await Promise.all([
        apiCall.get(`/api/fees?${params}`),
        apiCall.get('/api/fees/summary')
      ]);

      setFees(feesData);
      setSummary(summaryData);
    } catch (error) {
      toast.error('Failed to fetch fees');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFee = async (formData: any) => {
    try {
      const response = await apiCall.post('/api/fees', formData);
      setFees([...fees, response]);
      setIsAddFeeOpen(false);
      fetchFees();
      toast.success('Fee added successfully');
    } catch (error) {
      toast.error('Failed to add fee');
      console.error(error);
    }
  };

  const handleRecordPayment = async (feeId: number, amount: number) => {
    try {
      const response = await apiCall.post(`/api/fees/${feeId}/payment`, {
        amount,
        paid_date: new Date().toISOString().split('T')[0]
      });
      
      setFees(fees.map(f => f.id === feeId ? response : f));
      setIsPaymentOpen(false);
      setSelectedFee(null);
      fetchFees();
      toast.success('Payment recorded successfully');
    } catch (error) {
      toast.error('Failed to record payment');
      console.error(error);
    }
  };

  const handleExportFees = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== 'all') params.append('status', selectedStatus);

      const response = await fetch(`http://localhost:4000/api/fees/export/csv?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fees_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      
      toast.success('Fees exported successfully');
    } catch (error) {
      toast.error('Failed to export fees');
      console.error(error);
    }
  };

  const filteredFees = fees.filter(fee => {
    const matchesSearch = fee.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fee.fee_type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'partial': return <TrendingUp className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Manage student fees and financial transactions</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddFeeOpen} onOpenChange={setIsAddFeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Fee
              </Button>
            </DialogTrigger>
            <AddFeeDialog onClose={() => setIsAddFeeOpen(false)} onSubmit={handleAddFee} />
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Collected</p>
                  <p className="text-2xl font-bold">${summary.total_collected?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-muted-foreground">{summary.students_paid} students</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">${summary.total_pending?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-muted-foreground">{summary.students_pending} students</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-bold">${summary.total_overdue?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-muted-foreground">{summary.students_overdue} students</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Partial Payments</p>
                  <p className="text-2xl font-bold">${summary.total_partial?.toFixed(2) || '0.00'}</p>
                  <p className="text-xs text-muted-foreground">In progress</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by student name or fee type..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportFees}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Fees</TabsTrigger>
          <TabsTrigger value="pending">Pending ({fees.filter(f => f.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({fees.filter(f => f.status === 'overdue').length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({fees.filter(f => f.status === 'paid').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Fee Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Paid Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No fees found</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredFees.map((fee) => (
                          <TableRow key={fee.id}>
                            <TableCell className="font-medium">{fee.student_name}</TableCell>
                            <TableCell>{fee.fee_type}</TableCell>
                            <TableCell className="font-bold">${fee.amount.toFixed(2)}</TableCell>
                            <TableCell>{fee.due_date}</TableCell>
                            <TableCell>{fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : '-'}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(fee.status)}>
                                <span className="mr-1">{getStatusIcon(fee.status)}</span>
                                {fee.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedFee(fee);
                                    setIsPaymentOpen(true);
                                  }}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Record Payment
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Receipt className="mr-2 h-4 w-4" />
                                    View Receipt
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    <AlertCircle className="mr-2 h-4 w-4" />
                                    Send Reminder
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.filter(f => f.status === 'pending').map((fee) => (
                      <TableRow key={fee.id}>
                        <TableCell className="font-medium">{fee.student_name}</TableCell>
                        <TableCell>{fee.fee_type}</TableCell>
                        <TableCell className="font-bold">${fee.amount.toFixed(2)}</TableCell>
                        <TableCell>{fee.due_date}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(fee.status)}>
                            {fee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm"
                            onClick={() => {
                              setSelectedFee(fee);
                              setIsPaymentOpen(true);
                            }}
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-red-200 bg-red-50/20">
            <CardHeader>
              <CardTitle className="text-red-700">Overdue Fees - Action Required</CardTitle>
              <CardDescription>These fees are past the due date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Overdue</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.filter(f => f.status === 'overdue').map((fee) => {
                      const daysOverdue = Math.floor(
                        (new Date().getTime() - new Date(fee.due_date).getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return (
                        <TableRow key={fee.id} className="border-red-100">
                          <TableCell className="font-medium">{fee.student_name}</TableCell>
                          <TableCell>{fee.fee_type}</TableCell>
                          <TableCell className="font-bold">${fee.amount.toFixed(2)}</TableCell>
                          <TableCell>{fee.due_date}</TableCell>
                          <TableCell>
                            <Badge variant="destructive">{daysOverdue} days</Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                setSelectedFee(fee);
                                setIsPaymentOpen(true);
                              }}
                            >
                              Collect Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card className="bg-white/50 backdrop-blur-sm border-green-200 bg-green-50/20">
            <CardHeader>
              <CardTitle className="text-green-700">Paid Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Paid Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFees.filter(f => f.status === 'paid').map((fee) => (
                      <TableRow key={fee.id} className="border-green-100">
                        <TableCell className="font-medium">{fee.student_name}</TableCell>
                        <TableCell>{fee.fee_type}</TableCell>
                        <TableCell className="font-bold">${fee.amount.toFixed(2)}</TableCell>
                        <TableCell>{fee.due_date}</TableCell>
                        <TableCell>{fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      {selectedFee && (
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
              <DialogDescription>
                Record payment for {selectedFee.student_name} - {selectedFee.fee_type} (${selectedFee.amount.toFixed(2)})
              </DialogDescription>
            </DialogHeader>
            <PaymentForm 
              fee={selectedFee}
              onClose={() => {
                setIsPaymentOpen(false);
                setSelectedFee(null);
              }}
              onSubmit={(amount) => handleRecordPayment(selectedFee.id, amount)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function AddFeeDialog({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    student_id: '',
    fee_type: '',
    amount: '',
    due_date: '',
  });

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const data = await apiCall.get('/api/students');
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      student_id: parseInt(formData.student_id),
      fee_type: formData.fee_type,
      amount: parseFloat(formData.amount),
      due_date: formData.due_date,
    });
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add New Fee</DialogTitle>
        <DialogDescription>
          Create a new fee entry for a student
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="student_id">Student *</Label>
          <Select value={formData.student_id} onValueChange={(value) => setFormData({...formData, student_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.name} ({student.student_id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fee_type">Fee Type *</Label>
          <Select value={formData.fee_type} onValueChange={(value) => setFormData({...formData, fee_type: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select fee type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tuition">Tuition</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
              <SelectItem value="uniform">Uniform</SelectItem>
              <SelectItem value="exam">Exam Fee</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input 
            id="amount" 
            type="number" 
            placeholder="0.00" 
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date *</Label>
          <Input 
            id="due_date" 
            type="date" 
            value={formData.due_date}
            onChange={(e) => setFormData({...formData, due_date: e.target.value})}
            required
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Add Fee
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

function PaymentForm({ fee, onClose, onSubmit }: { fee: Fee; onClose: () => void; onSubmit: (amount: number) => void }) {
  const [amount, setAmount] = useState(fee.amount.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(parseFloat(amount));
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="payment_amount">Amount to Record *</Label>
        <Input 
          id="payment_amount" 
          type="number" 
          placeholder="0.00" 
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <p className="text-sm text-muted-foreground">
          Full amount due: ${fee.amount.toFixed(2)}
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Record Payment
        </Button>
      </DialogFooter>
    </form>
  );
}
