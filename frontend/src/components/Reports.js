import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockStudents, mockBehaviors, mockUsers, STAGES, getStageLabel } from '../mockData';
import { FileText, Download, Printer, TrendingUp, TrendingDown, Award, Calendar, Users, BarChart3 } from 'lucide-react';

const Reports = ({ user }) => {
  const [reportType, setReportType] = useState('weekly');
  const [selectedStage, setSelectedStage] = useState('all');
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    generateReport();
  }, [reportType, selectedStage]);

  const generateReport = () => {
    const now = new Date();
    const startDate = reportType === 'weekly' 
      ? new Date(now.setDate(now.getDate() - 7))
      : new Date(now.setMonth(now.getMonth() - 1));

    // Filter students by stage if selected
    const filteredStudents = selectedStage === 'all' 
      ? mockStudents 
      : mockStudents.filter(s => s.stage === selectedStage);

    // Calculate statistics
    const totalStudents = filteredStudents.length;
    const positiveBehaviors = mockBehaviors.filter(b => 
      b.type === 'positive' && filteredStudents.some(s => s.id === b.studentId)
    ).length;
    const negativeBehaviors = mockBehaviors.filter(b => 
      b.type === 'negative' && filteredStudents.some(s => s.id === b.studentId)
    ).length;
    const totalPoints = filteredStudents.reduce((sum, s) => sum + s.totalPoints, 0);
    const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;

    // Top performers
    const topStudents = [...filteredStudents]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10);

    // Teacher statistics
    const teachers = mockUsers.filter(u => u.role === 'teacher');
    const teacherStats = teachers.map(teacher => {
      const behaviorCount = mockBehaviors.filter(b => b.teacherId === teacher.id).length;
      return { ...teacher, behaviorCount };
    }).sort((a, b) => b.behaviorCount - a.behaviorCount);

    // Behavior trends
    const behaviorsByStudent = filteredStudents.map(student => {
      const studentBehaviors = mockBehaviors.filter(b => b.studentId === student.id);
      const positive = studentBehaviors.filter(b => b.type === 'positive').length;
      const negative = studentBehaviors.filter(b => b.type === 'negative').length;
      return {
        ...student,
        positiveBehaviors: positive,
        negativeBehaviors: negative,
        totalBehaviors: positive + negative
      };
    }).sort((a, b) => b.totalBehaviors - a.totalBehaviors);

    setReportData({
      period: reportType === 'weekly' ? 'أسبوعي' : 'شهري',
      totalStudents,
      positiveBehaviors,
      negativeBehaviors,
      averagePoints,
      totalPoints,
      topStudents,
      teacherStats,
      behaviorsByStudent: behaviorsByStudent.slice(0, 15)
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (!reportData) return;

    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_${reportData.period}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = () => {
    let csv = '\ufeff'; // UTF-8 BOM
    csv += 'تقرير السلوك المدرسي\n\n';
    csv += `نوع التقرير:,${reportData.period}\n`;
    csv += `التاريخ:,${new Date().toLocaleDateString('ar-SA')}\n`;
    csv += `المرحلة:,${selectedStage === 'all' ? 'جميع المراحل' : getStageLabel(selectedStage)}\n\n`;
    
    csv += 'الإحصائيات العامة\n';
    csv += `إجمالي الطالبات:,${reportData.totalStudents}\n`;
    csv += `السلوكيات الإيجابية:,${reportData.positiveBehaviors}\n`;
    csv += `السلوكيات السلبية:,${reportData.negativeBehaviors}\n`;
    csv += `متوسط النقاط:,${reportData.averagePoints}\n\n`;

    csv += 'أفضل 10 طالبات\n';
    csv += 'الترتيب,الاسم,المرحلة,الفصل,النقاط\n';
    reportData.topStudents.forEach((student, index) => {
      csv += `${index + 1},${student.name},${getStageLabel(student.stage)},${student.class},${student.totalPoints}\n`;
    });

    return csv;
  };

  if (!reportData) {
    return <div className="text-center py-12">جاري تحميل التقرير...</div>;
  }

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header - Hide on print */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600 mt-1">عرض وتصدير التقارير الدورية</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handlePrint}
            className="bg-gradient-to-l from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white"
          >
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Filters - Hide on print */}
      <Card className="print:hidden">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">نوع التقرير</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">تقرير أسبوعي</SelectItem>
                  <SelectItem value="monthly">تقرير شهري</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-right">المرحلة الدراسية</label>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع المراحل</SelectItem>
                  {STAGES.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Print Header - Show only on print */}
      <div className="hidden print:block text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">رواد التميز</h1>
        <p className="text-lg">مدرسة متوسطة غران</p>
        <p className="text-sm text-gray-600 mt-2">تقرير {reportData.period} - {new Date().toLocaleDateString('ar-SA')}</p>
        <p className="text-sm text-gray-600">المرحلة: {selectedStage === 'all' ? 'جميع المراحل' : getStageLabel(selectedStage)}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي الطالبات</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{reportData.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">سلوكيات إيجابية</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{reportData.positiveBehaviors}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">سلوكيات سلبية</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{reportData.negativeBehaviors}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">متوسط النقاط</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{reportData.averagePoints}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card className="print:break-inside-avoid">
        <CardHeader className="bg-gradient-to-l from-blue-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            أفضل 10 طالبات
          </CardTitle>
          <CardDescription>الطالبات المتفوقات في الفترة المحددة</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:gap-2">
            {reportData.topStudents.map((student, index) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg print:p-2"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-amber-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-700' :
                    'bg-blue-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                    <p className="text-xs text-gray-600">
                      {getStageLabel(student.stage)} - {student.class}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold text-emerald-600">{student.totalPoints}</p>
                  <p className="text-xs text-gray-500">نقطة</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Teacher Statistics */}
      {user.role === 'principal' && (
        <Card className="print:break-inside-avoid">
          <CardHeader className="bg-gradient-to-l from-blue-50 to-emerald-50">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              إحصائيات المعلمات
            </CardTitle>
            <CardDescription>عدد السلوكيات المسجلة لكل معلمة</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:gap-2">
              {reportData.teacherStats.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border border-blue-200 print:p-2"
                >
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{teacher.name}</h3>
                  <div className="flex items-center justify-between pt-2 border-t border-blue-200">
                    <span className="text-xs text-gray-600">السلوكيات</span>
                    <span className="text-xl font-bold text-emerald-600">{teacher.behaviorCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer - Show only on print */}
      <div className="hidden print:block mt-8 pt-4 border-t text-center text-sm text-gray-600">
        <p>مديرة المدرسة: عائشة عبدالعزيز الراشدي</p>
        <p className="text-xs mt-1">تصميم: المعلمة امل عطيه المزروعي</p>
      </div>
    </div>
  );
};

export default Reports;
