import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardHeader, CardContent, CardFooter } from './ui/card';
import { toast } from '../hooks/use-toast';
import { authenticateUser } from '../mockData';
import { GraduationCap, Mail, Lock, TrendingUp, Award, FileText } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check for saved credentials on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = authenticateUser(email, password);
      
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        
        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem('savedEmail', email);
          localStorage.setItem('savedPassword', password);
        } else {
          localStorage.removeItem('savedEmail');
          localStorage.removeItem('savedPassword');
        }
        
        onLogin(user);
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: `مرحباً ${user.name}`
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
          variant: 'destructive'
        });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-4 py-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-lg rounded-full mb-4 border border-white/20">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">رواد التميز</h1>
          <p className="text-blue-100 text-lg">مدرسة متوسطة غران</p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">رصد دقيق</h3>
            <p className="text-blue-100 text-sm text-center">
              تتبع شامل لسلوكيات الطالبات بنظام نقاط متكامل يضمن العدالة والشفافية
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">لوحة الشرف</h3>
            <p className="text-blue-100 text-sm text-center">
              عرض الطالبات المتميزات وتحفيز التميز السلوكي والأكاديمي بشكل مستمر
            </p>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-2">تقارير شاملة</h3>
            <p className="text-blue-100 text-sm text-center">
              تقارير أسبوعية وشهرية تمكن الطالبة وولي الأمر من متابعة السلوك والإنجاز بسهولة ووضوح
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto">
        <Card className="backdrop-blur-xl bg-white/95 border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <h2 className="text-2xl font-bold text-gray-800">تسجيل الدخول</h2>
            <p className="text-gray-600 text-sm mt-1">استخدم البريد الإلكتروني الوزاري</p>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right block text-gray-700 font-medium">
                  البريد الإلكتروني
                </Label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@moe.edu.sa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pr-10 text-right"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block text-gray-700 font-medium">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer select-none">
                  تذكرني
                </label>
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-l from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-semibold py-6 text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </Button>
              
              <Link 
                to="/signup" 
                className="w-full text-center"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-6 text-lg transition-all duration-300"
                >
                  إنشاء حساب جديد
                </Button>
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
    </div>
  );
};

export default Login;