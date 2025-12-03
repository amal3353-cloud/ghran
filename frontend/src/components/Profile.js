import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from '../hooks/use-toast';
import { User, Mail, Phone, Shield } from 'lucide-react';

const Profile = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || ''
  });

  const canEdit = user.role === 'teacher';

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update user data
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    
    setIsEditing(false);
    toast({
      title: 'تم التحديث بنجاح',
      description: 'تم تحديث بياناتك الشخصية'
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'principal': return 'مديرة المدرسة';
      case 'teacher': return 'معلمة';
      case 'student': return 'طالبة';
      default: return role;
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-8 h-8 text-blue-600" />
          الملف الشخصي
        </h1>
        <p className="text-gray-600 mt-1">عرض وتعديل بياناتك الشخصية</p>
      </div>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-l from-blue-50 to-emerald-50">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-base mt-1">
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  <Shield className="w-4 h-4" />
                  {getRoleLabel(user.role)}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block text-gray-700 font-medium">
                الاسم
              </Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing || !canEdit}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block text-gray-700 font-medium">
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="pr-10 text-right bg-gray-50"
                  dir="ltr"
                />
              </div>
              <p className="text-sm text-gray-500 text-right">لا يمكن تعديل البريد الإلكتروني</p>
            </div>

            {canEdit && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right block text-gray-700 font-medium">
                  رقم الجوال
                </Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="05xxxxxxxx"
                    className="pr-10 text-right"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            {user.role === 'student' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>الرقم الطلابي:</strong> {user.studentId}
                </p>
              </div>
            )}

            {canEdit && (
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-l from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white"
                  >
                    تعديل البيانات
                  </Button>
                ) : (
                  <>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
                    >
                      حفظ التغييرات
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || ''
                        });
                      }}
                      className="flex-1"
                    >
                      إلغاء
                    </Button>
                  </>
                )}
              </div>
            )}

            {!canEdit && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  {user.role === 'principal'
                    ? 'بصفتك مديرة المدرسة، يمكنك عرض جميع البيانات فقط'
                    : 'لا يمكن تعديل البيانات لهذا الحساب'}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {user.role === 'principal' && (
        <Card className="bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              صلاحيات المديرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                عرض جميع بيانات الطالبات والمعلمات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                الاطلاع على جميع السلوكيات المسجلة
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                إدارة وحذف الطالبات
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                تسجيل السلوكيات للطالبات
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;