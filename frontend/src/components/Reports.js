import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockStudents, mockBehaviors, mockUsers, STAGES, getStageLabel } from '../mockData';
import { FileText, Download, TrendingUp, TrendingDown, Award, Calendar, Users, BarChart3, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Add Arabic font support
const addArabicFont = (doc) => {
  // We'll use a basic font that supports Arabic
  doc.setFont('helvetica');
};

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

    // Top 5 students per stage and class
    const topByStageAndClass = {};
    STAGES.forEach(stage => {
      topByStageAndClass[stage.value] = {};
      stage.classes.forEach(className => {
        const studentsInClass = filteredStudents.filter(s => 
          s.stage === stage.value && s.class === className
        );
        const top5 = studentsInClass
          .sort((a, b) => b.totalPoints - a.totalPoints)
          .slice(0, 5);
        if (top5.length > 0) {
          topByStageAndClass[stage.value][className] = top5;
        }
      });
    });

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
      topByStageAndClass,
      teacherStats,
      behaviorsByStudent: behaviorsByStudent.slice(0, 15)
    });
  };

  const handleExportPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF();
    addArabicFont(doc);
    
    let yPos = 20;
    
    // Title
    doc.setFontSize(18);
    doc.text('Ruwad Al-Tamayuz - School Report', 105, yPos, { align: 'center' });
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Report Type: ${reportData.period}`, 105, yPos, { align: 'center' });
    yPos += 7;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, yPos, { align: 'center' });
    yPos += 15;

    // Statistics
    doc.setFontSize(14);
    doc.text('Statistics', 20, yPos);
    yPos += 10;

    const statsData = [
      ['Total Students', reportData.totalStudents],
      ['Positive Behaviors', reportData.positiveBehaviors],
      ['Negative Behaviors', reportData.negativeBehaviors],
      ['Average Points', reportData.averagePoints]
    ];

    doc.autoTable({
      startY: yPos,
      head: [['Metric', 'Value']],
      body: statsData,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }
    });

    yPos = doc.lastAutoTable.finalY + 15;

    // Top Students by Class
    doc.setFontSize(14);
    doc.text('Top 5 Students per Class', 20, yPos);
    yPos += 10;

    Object.keys(reportData.topByStageAndClass).forEach(stage => {
      Object.keys(reportData.topByStageAndClass[stage]).forEach(className => {
        const students = reportData.topByStageAndClass[stage][className];
        
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.text(`${getStageLabel(stage)} - Class ${className}`, 20, yPos);
        yPos += 7;

        const tableData = students.map((s, idx) => [
          idx + 1,
          s.name,
          s.totalPoints
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Rank', 'Student Name', 'Points']],
          body: tableData,
          theme: 'striped',
          headStyles: { fillColor: [16, 185, 129] },
          margin: { left: 20 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      });
    });

    // Save PDF
    doc.save(`report_${reportData.period}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportCSV = () => {
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

    // Top students per class
    csv += 'أفضل 5 طالبات في كل صف\n\n';
    Object.keys(reportData.topByStageAndClass).forEach(stage => {
      Object.keys(reportData.topByStageAndClass[stage]).forEach(className => {
        const students = reportData.topByStageAndClass[stage][className];
        csv += `${getStageLabel(stage)} - الفصل ${className}\n`;
        csv += 'الترتيب,الاسم,النقاط\n';
        students.forEach((student, index) => {
          csv += `${index + 1},${student.name},${student.totalPoints}\n`;
        });
        csv += '\n';
      });
    });

    return csv;
  };

  if (!reportData) {
    return <div className="text-center py-12">جاري تحميل التقرير...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-blue-600" />
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600 mt-1">عرض وتصدير التقارير الدورية</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleExportPDF}
            className="bg-gradient-to-l from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
          >
            <FileDown className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
          >
            <Download className="w-4 h-4 ml-2" />
            تصدير CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">خيارات التقرير</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block text-right">نوع التقرير</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">أسبوعي</SelectItem>
                <SelectItem value="monthly">شهري</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block text-right">المرحلة</label>
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
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">إجمالي الطالبات</p>
                <p className="text-3xl font-bold text-blue-600">{reportData.totalStudents}</p>
              </div>
              <Users className="w-10 h-10 text-blue-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">سلوكيات إيجابية</p>
                <p className="text-3xl font-bold text-green-600">{reportData.positiveBehaviors}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">سلوكيات سلبية</p>
                <p className="text-3xl font-bold text-red-600">{reportData.negativeBehaviors}</p>
              </div>
              <TrendingDown className="w-10 h-10 text-red-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">متوسط النقاط</p>
                <p className="text-3xl font-bold text-purple-600">{reportData.averagePoints}</p>
              </div>
              <BarChart3 className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Students per Class */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            أفضل 5 طالبات في كل صف وفصل
          </CardTitle>
          <CardDescription>الطالبات المتميزات في كل صف حسب النقاط</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(reportData.topByStageAndClass).map(stage => (
              <div key={stage} className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                  {getStageLabel(stage)}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(reportData.topByStageAndClass[stage]).map(className => {
                    const students = reportData.topByStageAndClass[stage][className];
                    return (
                      <Card key={className} className="bg-gradient-to-br from-blue-50 to-purple-50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">الفصل {className}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {students.map((student, idx) => (
                              <div 
                                key={student.id} 
                                className={`flex items-center justify-between p-2 rounded-lg ${
                                  idx === 0 ? 'bg-yellow-100 border border-yellow-300' :
                                  idx === 1 ? 'bg-gray-100 border border-gray-300' :
                                  idx === 2 ? 'bg-orange-100 border border-orange-300' :
                                  'bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <span className={`text-lg font-bold ${
                                    idx === 0 ? 'text-yellow-600' :
                                    idx === 1 ? 'text-gray-600' :
                                    idx === 2 ? 'text-orange-600' :
                                    'text-gray-500'
                                  }`}>
                                    {idx + 1}
                                  </span>
                                  <span className="text-sm truncate">{student.name}</span>
                                </div>
                                <span className="font-bold text-blue-600">{student.totalPoints}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Overall */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            أفضل 10 طالبات إجمالاً
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {reportData.topStudents.map((student, index) => (
              <div 
                key={student.id}
                className={`p-4 rounded-lg border-2 ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-400' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-400' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-400' :
                  'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {getStageLabel(student.stage)} - الفصل {student.class}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{student.totalPoints}</p>
                    <p className="text-xs text-gray-500">نقطة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
