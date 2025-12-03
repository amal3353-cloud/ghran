import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockUsers } from '../mockData';
import { GraduationCap, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';

const SignUp = ({ onSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      setLoading(false);
      return;
    }

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === formData.email);
    if (existingUser) {
      alert('البريد الإلكتروني مسجل بالفعل');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: `${mockUsers.length + 1}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        password: formData.password,
        studentId: formData.role === 'student' ? `S${(mockUsers.length + 1).toString().padStart(3, '0')}` : undefined
      };

      // Add to mock users
      mockUsers.push(newUser);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      
      if (onSignUp) {
        onSignUp(newUser);
      }

      // Use alert instead of toast to avoid portal issues
      alert('تم إنشاء الحساب بنجاح!');

      navigate('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'principal': return 'مديرة المدرسة';
      case 'teacher': return 'معلمة';
      case 'student': return 'طالبة';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-4 py-12">
      <div className="container mx-auto max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full mb-4 border border-white/20">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب جديد</h1>
          <p className="text-blue-100">رواد التميز</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold text-gray-800">التسجيل</h2>
            <p className="text-gray-600 text-sm mt-1">أدخل بياناتك لإنشاء حساب جديد</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block text-gray-700 font-medium">
                  الاسم الكامل <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل الاسم الكامل"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="pr-10 text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block text-gray-700 font-medium">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@moe.edu.sa"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="pr-10 text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-right block text-gray-700 font-medium">
                  نوع الحساب <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="اختر نوع الحساب" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principal">مديرة المدرسة</SelectItem>
                    <SelectItem value="teacher">معلمة</SelectItem>
                    <SelectItem value="student">طالبة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block text-gray-700 font-medium">
                  كلمة المرور <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="pr-10"
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 text-right">يجب أن تكون 6 أحرف على الأقل</p>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-l from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </Button>
              
              <Link 
                to="/" 
                className="w-full text-center text-gray-600 hover:text-gray-800 text-sm flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                لديك حساب بالفعل؟ تسجيل الدخول
              </Link>
            </CardFooter>
          </form>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8 text-white">
          <p className="text-xs backdrop-blur-sm bg-white/10 rounded-lg py-2 px-4 inline-block">
            تصميم: المعلمة امل عطيه المزروعي
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
