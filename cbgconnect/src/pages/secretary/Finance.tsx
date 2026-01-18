import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Printer,
  Filter,
  Search,
  Calendar,
  Mail,
  Bell,
  FileText,
  CreditCard,
  RefreshCw,
  BarChart3,
  PieChart,
  Users,
  ArrowRight
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle  , CardFooter} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Mock finance data
const mockFinanceData = {
  summary: {
    totalRevenue: "$125,430",
    collectedThisMonth: "$28,500",
    pendingPayments: "$12,750",
    overdueAmount: "$5,230",
    collectionRate: "92%",
    avgPaymentTime: "3.2 days"
  },
  feeStructure: [
    { grade: "Grade 5", term1: "$1,200", term2: "$1,200", term3: "$1,200", total: "$3,600" },
    { grade: "Grade 6", term1: "$1,300", term2: "$1,300", term3: "$1,300", total: "$3,900" },
    { grade: "Grade 7", term1: "$1,400", term2: "$1,400", term3: "$1,400", total: "$4,200" },
    { grade: "Grade 8", term1: "$1,500", term2: "$1,500", term3: "$1,500", total: "$4,500" }
  ],
  recentTransactions: [
    { id: 1, student: "Alex Chen", amount: "$1,200", date: "2024-10-20", method: "Credit Card", status: "completed", invoice: "INV-2024-001" },
    { id: 2, student: "Emma Rodriguez", amount: "$1,300", date: "2024-10-19", method: "Bank Transfer", status: "completed", invoice: "INV-2024-002" },
    { id: 3, student: "James Wilson", amount: "$1,400", date: "2024-10-18", method: "Cash", status: "pending", invoice: "INV-2024-003" },
    { id: 4, student: "Sophia Kim", amount: "$1,200", date: "2024-10-17", method: "Credit Card", status: "completed", invoice: "INV-2024-004" },
    { id: 5, student: "Michael Brown", amount: "$1,500", date: "2024-10-16", method: "Bank Transfer", status: "overdue", invoice: "INV-2024-005" },
    { id: 6, student: "Olivia Davis", amount: "$1,300", date: "2024-10-15", method: "Credit Card", status: "completed", invoice: "INV-2024-006" }
  ],
  pendingPayments: [
    { student: "William Garcia", grade: "Grade 7", amount: "$1,400", dueDate: "2024-10-25", daysLeft: 5 },
    { student: "Ava Martinez", grade: "Grade 5", amount: "$1,200", dueDate: "2024-10-28", daysLeft: 8 },
    { student: "Noah Taylor", grade: "Grade 8", amount: "$1,500", dueDate: "2024-10-30", daysLeft: 10 },
    { student: "Isabella Lee", grade: "Grade 6", amount: "$1,300", dueDate: "2024-11-05", daysLeft: 16 }
  ],
  monthlyCollection: [
    { month: "Jan", amount: 24500 },
    { month: "Feb", amount: 28500 },
    { month: "Mar", amount: 31200 },
    { month: "Apr", amount: 29800 },
    { month: "May", amount: 32500 },
    { month: "Jun", amount: 28900 },
    { month: "Jul", amount: 26500 },
    { month: "Aug", amount: 30100 },
    { month: "Sep", amount: 31800 },
    { month: "Oct", amount: 28500 }
  ]
}

const Finance = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const handleRecordPayment = () => {
    navigate('/secretary/finance/record-payment')
    toast.info("Recording new payment...")
  }

  const handleGenerateInvoice = () => {
    toast.success("Invoice generated successfully!")
  }

  const handleSendReminders = () => {
    toast.info("Sending payment reminders...")
  }

  const handleExportReport = () => {
    toast.success("Exporting finance report...")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700"
      case "pending": return "bg-yellow-100 text-yellow-700"
      case "overdue": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
              <p className="text-gray-600">Manage fee collection, transactions, and financial reporting</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleExportReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button 
                onClick={handleRecordPayment}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <div className="text-2xl font-bold text-gray-900">{mockFinanceData.summary.totalRevenue}</div>
                  <p className="text-xs text-gray-500 mt-1">Current academic year</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Collected This Month</p>
                  <div className="text-2xl font-bold text-gray-900">{mockFinanceData.summary.collectedThisMonth}</div>
                  <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                  <div className="text-2xl font-bold text-gray-900">{mockFinanceData.summary.pendingPayments}</div>
                  <p className="text-xs text-gray-500 mt-1">{mockFinanceData.pendingPayments.length} students</p>
                </div>
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Amount</p>
                  <div className="text-2xl font-bold text-gray-900">{mockFinanceData.summary.overdueAmount}</div>
                  <p className="text-xs text-gray-500 mt-1">Collection rate: {mockFinanceData.summary.collectionRate}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="fee-structure" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Fee Structure
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Monthly Collection Chart */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Monthly Collection Trend</CardTitle>
                  <CardDescription>
                    Fee collection over the past 10 months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-end gap-2">
                    {mockFinanceData.monthlyCollection.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg"
                          style={{ height: `${(item.amount / 35000) * 100}%` }}
                        />
                        <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                        <span className="text-xs font-medium">${(item.amount / 1000).toFixed(0)}k</span>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Average monthly collection: $29,310</span>
                    <span className="font-medium text-green-600">+8.5% growth</span>
                  </div>
                </CardContent>
              </Card>

              {/* Pending Payments */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>
                    Upcoming fee due dates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFinanceData.pendingPayments.map((payment, index) => (
                      <div key={index} className="p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{payment.student}</h4>
                            <p className="text-sm text-gray-600">{payment.grade}</p>
                          </div>
                          <Badge className={
                            payment.daysLeft <= 3 ? "bg-red-100 text-red-700" :
                            payment.daysLeft <= 7 ? "bg-amber-100 text-amber-700" :
                            "bg-blue-100 text-blue-700"
                          }>
                            Due in {payment.daysLeft} days
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">{payment.amount}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleGenerateInvoice}>
                              <FileText className="h-3 w-3 mr-1" />
                              Invoice
                            </Button>
                            <Button size="sm" onClick={() => toast.info(`Sending reminder to ${payment.student}`)}>
                              <Bell className="h-3 w-3 mr-1" />
                              Remind
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={handleSendReminders}>
                    <Bell className="h-4 w-4 mr-2" />
                    Send All Reminders
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Collection Stats */}
            <Card className="border-gray-200">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {mockFinanceData.summary.collectionRate}
                    </div>
                    <p className="text-gray-600">Collection Rate</p>
                    <Progress value={92} className="h-2 mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {mockFinanceData.summary.avgPaymentTime}
                    </div>
                    <p className="text-gray-600">Avg. Payment Time</p>
                    <p className="text-sm text-gray-500">Days from due date</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">45</div>
                    <p className="text-gray-600">Pending Invoices</p>
                    <Button size="sm" variant="link" onClick={handleSendReminders}>
                      Send reminders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      All fee payments and financial transactions
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search transactions..."
                        className="pl-10 w-48"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFinanceData.recentTransactions.map((transaction) => (
                        <TableRow key={transaction.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{transaction.invoice}</TableCell>
                          <TableCell>{transaction.student}</TableCell>
                          <TableCell className="font-bold">{transaction.amount}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{transaction.method}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(transaction.status)}>
                              {transaction.status === 'completed' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : transaction.status === 'pending' ? (
                                <Clock className="h-3 w-3 mr-1" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Showing {mockFinanceData.recentTransactions.length} transactions
                  </p>
                  <Button variant="outline">
                    View All Transactions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods Distribution */}
            <Card className="mt-8 border-gray-200">
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-xl bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">58%</div>
                    <p className="text-gray-600">Credit Card</p>
                    <p className="text-sm text-gray-500">Most popular</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-green-50">
                    <div className="text-2xl font-bold text-green-600">28%</div>
                    <p className="text-gray-600">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Direct deposit</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-amber-50">
                    <div className="text-2xl font-bold text-amber-600">12%</div>
                    <p className="text-gray-600">Cash</p>
                    <p className="text-sm text-gray-500">In-person payments</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-purple-50">
                    <div className="text-2xl font-bold text-purple-600">2%</div>
                    <p className="text-gray-600">Other</p>
                    <p className="text-sm text-gray-500">Checks, etc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fee Structure Tab */}
          <TabsContent value="fee-structure">
            <Card className="border-gray-200 shadow-lg">
              <CardHeader>
                <CardTitle>Fee Structure</CardTitle>
                <CardDescription>
                  Academic year 2024-2025 fee breakdown by grade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Grade Level</TableHead>
                        <TableHead>Term 1</TableHead>
                        <TableHead>Term 2</TableHead>
                        <TableHead>Term 3</TableHead>
                        <TableHead>Total Annual Fee</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFinanceData.feeStructure.map((fee, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{fee.grade}</TableCell>
                          <TableCell>{fee.term1}</TableCell>
                          <TableCell>{fee.term2}</TableCell>
                          <TableCell>{fee.term3}</TableCell>
                          <TableCell className="font-bold">{fee.total}</TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="outline" onClick={() => toast.info(`Editing ${fee.grade} fee structure`)}>
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Additional Fees</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Fee</span>
                        <span className="font-medium">$150</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sports Fee</span>
                        <span className="font-medium">$75</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Library Fee</span>
                        <span className="font-medium">$50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technology Fee</span>
                        <span className="font-medium">$100</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Discounts & Scholarships</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sibling Discount</span>
                        <span className="font-medium text-green-600">10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Early Payment Discount</span>
                        <span className="font-medium text-green-600">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Academic Scholarship</span>
                        <span className="font-medium text-green-600">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.info("Updating fee structure...")}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Fee Structure
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Generate Financial Reports</CardTitle>
                  <CardDescription>
                    Create detailed financial reports for different periods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Monthly Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Quarterly Report
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Annual Report
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Tax Report
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Custom Report</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
                          <Input type="date" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">End Date</label>
                          <Input type="date" />
                        </div>
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="collection">Collection Report</SelectItem>
                          <SelectItem value="pending">Pending Payments</SelectItem>
                          <SelectItem value="overdue">Overdue Analysis</SelectItem>
                          <SelectItem value="student">Student-wise Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full">
                        <Printer className="h-4 w-4 mr-2" />
                        Generate Custom Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-lg">
                <CardHeader>
                  <CardTitle>Report History</CardTitle>
                  <CardDescription>
                    Previously generated financial reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "October 2024 Collection Report", date: "Oct 20, 2024", size: "2.4 MB" },
                      { name: "Q3 2024 Financial Summary", date: "Oct 5, 2024", size: "3.1 MB" },
                      { name: "Annual Fee Collection 2023-24", date: "Sep 30, 2024", size: "5.2 MB" },
                      { name: "Overdue Payments Report", date: "Sep 15, 2024", size: "1.8 MB" }
                    ].map((report, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                        <div>
                          <h4 className="font-medium text-gray-900">{report.name}</h4>
                          <p className="text-sm text-gray-500">Generated: {report.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{report.size}</span>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default Finance