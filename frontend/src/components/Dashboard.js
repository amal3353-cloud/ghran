import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Users, TrendingUp, TrendingDown, Award, UserCheck } from 'lucide-react';
import { mockStudents, mockBehaviors, mockUsers, STAGES } from '../mockData';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    positiveBehaviors: 0,
    negativeBehaviors: 0,
    averagePoints: 0
  });

  useEffect(() => {
    // Calculate statistics
    const totalStudents = mockStudents.length;
    const positiveBehaviors = mockBehaviors.filter(b => b.type === 'positive').length;
    const negativeBehaviors = mockBehaviors.filter(b => b.type === 'negative').length;
    const totalPoints = mockStudents.reduce((sum, s) => sum + s.totalPoints, 0);
    const averagePoints = totalStudents > 0 ? Math.round(totalPoints / totalStudents) : 0;

    setStats({
      totalStudents,
      positiveBehaviors,
      negativeBehaviors,
      averagePoints
    });
  }, []);

  // Get teacher statistics
  const teachers = mockUsers.filter(u => u.role === 'teacher');
  const teacherStats = teachers.map(teacher => {
    const behaviorCount = mockBehaviors.filter(b => b.teacherId === teacher.id).length;
    return {
      ...teacher,
      behaviorCount
    };
  }).sort((a, b) => b.behaviorCount - a.behaviorCount);

  // Get top 5 students per stage and class
  const getTopStudentsByStageAndClass = (stageValue, classValue) => {
    return mockStudents
      .filter(s => s.stage === stageValue && s.class === classValue)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 5);
  };

  const topStudents = [...mockStudents]
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600 mt-1">مرحباً {user.name}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي الطالبات</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">سلوكيات إيجابية</p>
                <p className="text-3xl font-bold text-emerald-900 mt-2">{stats.positiveBehaviors}</p>
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
                <p className="text-3xl font-bold text-red-900 mt-2">{stats.negativeBehaviors}</p>
              </div>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">متوسط النقاط</p>
                <p className="text-3xl font-bold text-amber-900 mt-2">{stats.averagePoints}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teachers Statistics - Only for Principal */}
      {user.role === 'principal' && (
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              إحصائيات المعلمات
            </CardTitle>
            <CardDescription>عدد السلوكيات المسجلة لكل معلمة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teacherStats.map((teacher) => (
                <div
                  key={teacher.id}
                  className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{teacher.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-200">
                    <span className="text-xs text-gray-600">السلوكيات المسجلة</span>
                    <span className="text-xl font-bold text-emerald-600">{teacher.behaviorCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              الطالبات المتفوقات
            </CardTitle>
            <CardDescription>أعلى الطالبات في النقاط</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, index) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
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
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">
                        {STAGES.find(s => s.value === student.stage)?.label} - {student.class}
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

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>روابط سريعة</CardTitle>
            <CardDescription>الوصول السريع للوظائف الرئيسية</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {(user.role === 'principal' || user.role === 'teacher') && (
                <>
                  <Link
                    to="/students"
                    className="p-4 bg-gradient-to-l from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-lg">إدارة الطالبات</h3>
                    <p className="text-sm text-blue-100 mt-1">عرض وإضافة وحذف الطالبات</p>
                  </Link>
                  <Link
                    to="/behaviors"
                    className="p-4 bg-gradient-to-l from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <h3 className="font-semibold text-lg">تسجيل السلوكيات</h3>
                    <p className="text-sm text-emerald-100 mt-1">إضافة وعرض سلوكيات الطالبات</p>
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                className="p-4 bg-gradient-to-l from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <h3 className="font-semibold text-lg">الملف الشخصي</h3>
                <p className="text-sm text-gray-100 mt-1">عرض وتعديل بياناتك الشخصية</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Students by Stage and Class - For Principal and Teachers */}
      {(user.role === 'principal' || user.role === 'teacher') && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">أفضل 5 طالبات في كل فصل</h2>
          
          {STAGES.map((stage) => {
            return (
              <div key={stage.value} className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">{stage.label}</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stage.classes.map((classSection) => {
                    const topStudents = getTopStudentsByStageAndClass(stage.value, classSection);
                    if (topStudents.length === 0) return null;
                    
                    return (
                      <Card key={`${stage.value}-${classSection}`} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="bg-gradient-to-l from-blue-50 to-emerald-50 pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Award className="w-5 h-5 text-amber-500" />
                            الفصل {classSection}
                          </CardTitle>
                          <CardDescription className="text-xs">{topStudents.length} طالبة</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            {topStudents.map((student, index) => (
                              <div
                                key={student.id}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                                    index === 0 ? 'bg-amber-500' :
                                    index === 1 ? 'bg-gray-400' :
                                    index === 2 ? 'bg-amber-700' :
                                    'bg-blue-500'
                                  }`}>
                                    {index + 1}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{student.name}</p>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <p className="text-lg font-bold text-emerald-600">{student.totalPoints}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;