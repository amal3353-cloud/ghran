import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockStudents, mockBehaviors, getStageLabel, STAGES } from '../mockData';
import { Award, TrendingUp, TrendingDown, Calendar, User, BarChart3, FileText } from 'lucide-react';

const StudentView = ({ user }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  
  // Find student data
  const student = mockStudents.find(s => s.email === user.email || s.id === user.studentId);
  const studentBehaviors = mockBehaviors.filter(b => b.studentId === student?.id);

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">لا توجد بيانات للطالبة</p>
      </div>
    );
  }

  const positiveBehaviors = studentBehaviors.filter(b => b.type === 'positive').length;
  const negativeBehaviors = studentBehaviors.filter(b => b.type === 'negative').length;
  
  // Calculate progress data
  const weeklyProgress = [
    { week: 'الأسبوع 1', points: Math.max(0, student.totalPoints - 30) },
    { week: 'الأسبوع 2', points: Math.max(0, student.totalPoints - 20) },
    { week: 'الأسبوع 3', points: Math.max(0, student.totalPoints - 10) },
    { week: 'الأسبوع 4', points: student.totalPoints }
  ];
  
  // Get class ranking
  const classStudents = mockStudents.filter(s => s.stage === student.stage && s.class === student.class);
  const sortedClassStudents = [...classStudents].sort((a, b) => b.totalPoints - a.totalPoints);
  const studentRank = sortedClassStudents.findIndex(s => s.id === student.id) + 1;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-8 h-8 text-blue-600" />
          ملفي الشخصي
        </h1>
        <p className="text-gray-600 mt-1">عرض سجلي الدراسي والسلوكي</p>
      </div>

      {/* Student Info Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200 hover:shadow-lg transition-shadow duration-300">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{student.name}</h2>
              <div className="flex items-center gap-4 text-gray-700">
                <span className="bg-blue-100 px-3 py-1 rounded-full font-medium">
                  {getStageLabel(student.stage)}
                </span>
                <span className="bg-emerald-100 px-3 py-1 rounded-full font-medium">
                  الفصل {student.class}
                </span>
                <span className="text-sm text-gray-600">الرقم: {student.id}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-2 shadow-lg">
                <Award className="w-12 h-12 text-white" />
              </div>
              <p className="text-3xl font-bold text-amber-600">{student.totalPoints}</p>
              <p className="text-sm text-gray-600">نقطة</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">سلوكيات إيجابية</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{positiveBehaviors}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">سلوكيات سلبية</p>
                <p className="text-3xl font-bold text-red-900 mt-2">{negativeBehaviors}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي السجل</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{studentBehaviors.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Progress Report */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-l from-blue-50 to-emerald-50">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            تقرير التطور الأكاديمي
          </CardTitle>
          <CardDescription>متابعة تطور مستواك خلال الفترة الدراسية</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Class Ranking */}
            <div className="bg-gradient-to-l from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-800 font-medium">ترتيبك في الفصل</p>
                  <p className="text-3xl font-bold text-amber-900 mt-1">المرتبة {studentRank}</p>
                  <p className="text-xs text-amber-700 mt-1">من أصل {classStudents.length} طالبة</p>
                </div>
                <Award className="w-12 h-12 text-amber-600" />
              </div>
            </div>

            {/* Weekly Progress Chart */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">تطور النقاط الأسبوعي</h3>
              <div className="space-y-3">
                {weeklyProgress.map((week, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-24">{week.week}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-l from-emerald-500 to-blue-500 h-full rounded-full flex items-center justify-end px-3 transition-all duration-500"
                        style={{ width: `${Math.min(100, (week.points / 100) * 100)}%` }}
                      >
                        <span className="text-white font-bold text-sm">{week.points}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-900">{positiveBehaviors}</p>
                <p className="text-xs text-emerald-700">إيجابية</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-center">
                <TrendingDown className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-900">{negativeBehaviors}</p>
                <p className="text-xs text-red-700">سلبية</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{studentBehaviors.length}</p>
                <p className="text-xs text-blue-700">إجمالي</p>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`p-4 rounded-lg ${
              student.totalPoints >= 80 ? 'bg-emerald-50 border border-emerald-200' :
              student.totalPoints >= 50 ? 'bg-blue-50 border border-blue-200' :
              'bg-amber-50 border border-amber-200'
            }`}>
              <p className={`font-semibold ${
                student.totalPoints >= 80 ? 'text-emerald-900' :
                student.totalPoints >= 50 ? 'text-blue-900' :
                'text-amber-900'
              }`}>
                {student.totalPoints >= 80 ? '🌟 أداء ممتاز! استمري في التفوق' :
                 student.totalPoints >= 50 ? '👍 أداء جيد! يمكنك التحسين' :
                 '💪 لديك إمكانيات كبيرة! واصلي الاجتهاد'}
              </p>
              <p className={`text-sm mt-1 ${
                student.totalPoints >= 80 ? 'text-emerald-700' :
                student.totalPoints >= 50 ? 'text-blue-700' :
                'text-amber-700'
              }`}>
                أنت في المرتبة {studentRank} من {classStudents.length} في فصلك
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Behavior History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل السلوكيات</CardTitle>
          <CardDescription>جميع السلوكيات المسجلة لك</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {studentBehaviors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">لا توجد سلوكيات مسجلة</p>
              </div>
            ) : (
              studentBehaviors.map(behavior => (
                <div
                  key={behavior.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    behavior.type === 'positive'
                      ? 'bg-emerald-50 border-emerald-500'
                      : 'bg-red-50 border-red-500'
                  } hover:shadow-md transition-shadow duration-200`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {behavior.type === 'positive' ? (
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                        <span className={`font-semibold ${
                          behavior.type === 'positive' ? 'text-emerald-700' : 'text-red-700'
                        }`}>
                          {behavior.type === 'positive' ? 'سلوك إيجابي' : 'سلوك سلبي'}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{behavior.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {behavior.date}
                        </span>
                        <span>المعلمة: {behavior.teacherName}</span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`text-2xl font-bold ${
                        behavior.type === 'positive' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {behavior.points > 0 ? '+' : ''}{behavior.points}
                      </div>
                      <p className="text-xs text-gray-500">نقطة</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentView;