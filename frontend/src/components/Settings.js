import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Trash2, AlertTriangle, TrendingDown } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { mockStudents, mockBehaviors } from '../mockData';

const Settings = ({ user }) => {
  const [loading, setLoading] = useState(false);

  const handleClearMockData = () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع البيانات الوهمية؟ لا يمكن التراجع عن هذا الإجراء!')) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      // Clear students
      mockStudents.length = 0;
      
      // Clear behaviors
      mockBehaviors.length = 0;
      
      // Save to localStorage
      localStorage.setItem('students_cleared', 'true');
      localStorage.setItem('behaviors_cleared', 'true');
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف جميع البيانات الوهمية'
      });
      
      setLoading(false);
      
      // Reload page to reflect changes
      setTimeout(() => window.location.reload(), 1000);
    }, 500);
  };

  const handleResetPoints = () => {
    if (!window.confirm('هل أنت متأكد من إعادة تعيين جميع النقاط إلى صفر؟')) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      mockStudents.forEach(student => {
        student.totalPoints = 0;
      });
      
      localStorage.setItem('points_reset', 'true');
      
      toast({
        title: 'تم إعادة التعيين',
        description: 'تم إعادة تعيين جميع النقاط إلى صفر'
      });
      
      setLoading(false);
      setTimeout(() => window.location.reload(), 1000);
    }, 500);
  };

  const handleClearBehaviors = () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع سجلات السلوك؟')) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      mockBehaviors.length = 0;
      localStorage.setItem('behaviors_cleared', 'true');
      
      toast({
        title: 'تم الحذف',
        description: 'تم حذف جميع سجلات السلوك'
      });
      
      setLoading(false);
      setTimeout(() => window.location.reload(), 1000);
    }, 500);
  };

  if (user.role !== 'principal') {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            غير مصرح لك بالوصول إلى هذه الصفحة. يجب أن تكون مديرة المدرسة.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إعدادات النظام</h1>
        <p className="text-gray-600">إدارة البيانات والإعدادات العامة</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Clear All Mock Data */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              حذف جميع البيانات الوهمية
            </CardTitle>
            <CardDescription>
              حذف جميع الطالبات والسلوكيات الوهمية من النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-red-50 border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                تحذير: هذا الإجراء لا يمكن التراجع عنه! سيتم حذف جميع البيانات التجريبية.
              </AlertDescription>
            </Alert>
            <Button
              variant="destructive"
              onClick={handleClearMockData}
              disabled={loading}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف جميع البيانات الوهمية
            </Button>
          </CardContent>
        </Card>

        {/* Reset Points */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              إعادة تعيين النقاط
            </CardTitle>
            <CardDescription>
              إعادة تعيين جميع نقاط الطالبات إلى صفر
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-orange-50 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                سيتم إعادة تعيين نقاط جميع الطالبات إلى صفر
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={handleResetPoints}
              disabled={loading}
              className="w-full border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              إعادة تعيين النقاط
            </Button>
          </CardContent>
        </Card>

        {/* Clear Behaviors */}
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              حذف السلوكيات
            </CardTitle>
            <CardDescription>
              حذف جميع سجلات السلوك من النظام
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="mb-4 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                سيتم حذف جميع سجلات السلوك المسجلة
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={handleClearBehaviors}
              disabled={loading}
              className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              <Trash2 className="w-4 h-4 ml-2" />
              حذف جميع السلوكيات
            </Button>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات النظام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">عدد الطالبات:</span>
              <span className="font-semibold">{mockStudents.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">عدد السلوكيات:</span>
              <span className="font-semibold">{mockBehaviors.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">المستخدم الحالي:</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">الدور:</span>
              <span className="font-semibold">
                {user.role === 'principal' ? 'مديرة المدرسة' : 'معلمة'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
