import { useState } from 'react';
import {
  Download,
  BarChart3,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Calendar,
  Filter,
  Loader
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface ReportData {
  title: string;
  description: string;
  data: any[];
}

export default function SecretaryReports() {
  const [reportType, setReportType] = useState<string>('student');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [generating, setGenerating] = useState(false);
  const [currentReport, setCurrentReport] = useState<ReportData | null>(null);

  const studentReportData = {
    title: 'Student Summary Report',
    description: 'Overview of all students in the system',
    data: [
      {
        grade: 'Grade 9',
        total: 45,
        active: 42,
        inactive: 2,
        graduated: 1,
        percentage: 93
      },
      {
        grade: 'Grade 10',
        total: 38,
        active: 36,
        inactive: 1,
        graduated: 1,
        percentage: 95
      },
      {
        grade: 'Grade 11',
        total: 42,
        active: 40,
        inactive: 2,
        graduated: 0,
        percentage: 95
      },
      {
        grade: 'Grade 12',
        total: 35,
        active: 35,
        inactive: 0,
        graduated: 0,
        percentage: 100
      }
    ]
  };

  const attendanceReportData = {
    title: 'Attendance Report',
    description: 'School-wide attendance statistics',
    data: [
      {
        class: 'Grade 9',
        total_days: 180,
        present: 168,
        absent: 8,
        late: 3,
        excused: 1,
        rate: 94
      },
      {
        class: 'Grade 10',
        total_days: 180,
        present: 172,
        absent: 4,
        late: 3,
        excused: 1,
        rate: 96
      },
      {
        class: 'Grade 11',
        total_days: 180,
        present: 165,
        absent: 10,
        late: 4,
        excused: 1,
        rate: 92
      },
      {
        class: 'Grade 12',
        total_days: 180,
        present: 175,
        absent: 3,
        late: 2,
        excused: 0,
        rate: 97
      }
    ]
  };

  const financeReportData = {
    title: 'Finance Report',
    description: 'Financial summary and fee collection',
    data: [
      {
        fee_type: 'Tuition',
        total_amount: 450000,
        collected: 425000,
        pending: 25000,
        percentage: 94
      },
      {
        fee_type: 'Hostel',
        total_amount: 180000,
        collected: 175000,
        pending: 5000,
        percentage: 97
      },
      {
        fee_type: 'Uniform',
        total_amount: 65000,
        collected: 60000,
        pending: 5000,
        percentage: 92
      },
      {
        fee_type: 'Exam',
        total_amount: 55000,
        collected: 55000,
        pending: 0,
        percentage: 100
      }
    ]
  };

  const gradesReportData = {
    title: 'Grades Report',
    description: 'Academic performance analysis',
    data: [
      {
        subject: 'Mathematics',
        total_students: 160,
        average_percentage: 78,
        top_performers: 28,
        below_average: 12
      },
      {
        subject: 'English',
        total_students: 160,
        average_percentage: 82,
        top_performers: 35,
        below_average: 8
      },
      {
        subject: 'Science',
        total_students: 160,
        average_percentage: 75,
        top_performers: 22,
        below_average: 18
      },
      {
        subject: 'History',
        total_students: 160,
        average_percentage: 80,
        top_performers: 31,
        below_average: 10
      }
    ]
  };

  const getReportData = () => {
    switch (reportType) {
      case 'student':
        return studentReportData;
      case 'attendance':
        return attendanceReportData;
      case 'finance':
        return financeReportData;
      case 'grades':
        return gradesReportData;
      default:
        return studentReportData;
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const report = getReportData();
      setCurrentReport(report);
      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };

  const handleExportReport = async () => {
    if (!currentReport) return;
    
    try {
      let csv = currentReport.title + '\n';
      csv += currentReport.description + '\n\n';
      
      if (currentReport.data.length > 0) {
        const headers = Object.keys(currentReport.data[0]);
        csv += headers.join(',') + '\n';
        
        currentReport.data.forEach(row => {
          csv += headers.map(h => row[h]).join(',') + '\n';
        });
      }

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
      console.error(error);
    }
  };

  const report = currentReport || getReportData();
  const summaryData = (() => {
    if (reportType === 'student') {
      const data = studentReportData.data;
      return {
        total: data.reduce((sum, d) => sum + d.total, 0),
        active: data.reduce((sum, d) => sum + d.active, 0),
        inactive: data.reduce((sum, d) => sum + d.inactive, 0)
      };
    } else if (reportType === 'finance') {
      const data = financeReportData.data;
      return {
        total: data.reduce((sum, d) => sum + d.total_amount, 0),
        collected: data.reduce((sum, d) => sum + d.collected, 0),
        pending: data.reduce((sum, d) => sum + d.pending, 0)
      };
    }
    return {};
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Generate and view various school reports</p>
        </div>
      </div>

      {/* Report Generator */}
      <Card className="bg-white/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select report type and parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student Summary</SelectItem>
                    <SelectItem value="attendance">Attendance</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="grades">Grades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-from">From Date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date-to">To Date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className="w-full"
                >
                  {generating ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart3 className="mr-2 h-4 w-4" />
                  )}
                  {generating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {currentReport && reportType === 'student' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{summaryData.total}</div>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summaryData.active}</div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50/50 backdrop-blur-sm border-amber-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{summaryData.inactive}</div>
                <p className="text-sm text-muted-foreground">Inactive</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {currentReport && reportType === 'finance' && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-blue-50/50 backdrop-blur-sm border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">₨{(summaryData.total / 100000).toFixed(1)}L</div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50/50 backdrop-blur-sm border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">₨{(summaryData.collected / 100000).toFixed(1)}L</div>
                <p className="text-sm text-muted-foreground">Collected</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-red-50/50 backdrop-blur-sm border-red-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">₨{(summaryData.pending / 100000).toFixed(1)}L</div>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Report Details */}
      {currentReport && (
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{currentReport.title}</CardTitle>
              <CardDescription>{currentReport.description}</CardDescription>
            </div>
            <Button 
              onClick={handleExportReport}
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </CardHeader>
          <CardContent>
            {reportType === 'student' && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grade</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead>Inactive</TableHead>
                      <TableHead>Graduated</TableHead>
                      <TableHead>Active %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.grade}</TableCell>
                        <TableCell>{row.total}</TableCell>
                        <TableCell>{row.active}</TableCell>
                        <TableCell>{row.inactive}</TableCell>
                        <TableCell>{row.graduated}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.percentage} className="w-12" />
                            <span className="text-sm font-medium">{row.percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {reportType === 'attendance' && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Total Days</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Late</TableHead>
                      <TableHead>Attendance %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.class}</TableCell>
                        <TableCell>{row.total_days}</TableCell>
                        <TableCell>{row.present}</TableCell>
                        <TableCell>{row.absent}</TableCell>
                        <TableCell>{row.late}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.rate} className="w-12" />
                            <span className="text-sm font-medium">{row.rate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {reportType === 'finance' && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fee Type</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Collected</TableHead>
                      <TableHead>Pending</TableHead>
                      <TableHead>Collection %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.fee_type}</TableCell>
                        <TableCell>₨{row.total_amount.toLocaleString()}</TableCell>
                        <TableCell>₨{row.collected.toLocaleString()}</TableCell>
                        <TableCell>₨{row.pending.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.percentage} className="w-12" />
                            <span className="text-sm font-medium">{row.percentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {reportType === 'grades' && (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Total Students</TableHead>
                      <TableHead>Average %</TableHead>
                      <TableHead>Top Performers</TableHead>
                      <TableHead>Below Average</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.data.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{row.subject}</TableCell>
                        <TableCell>{row.total_students}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={row.average_percentage} className="w-12" />
                            <span className="text-sm font-medium">{row.average_percentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>{row.top_performers}</TableCell>
                        <TableCell>{row.below_average}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
