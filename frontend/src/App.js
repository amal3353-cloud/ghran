import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Award, FileText, Users, Trash2, Undo2, LogOut, Plus, Edit, Search, GraduationCap } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/auth/me`);
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Protected Route
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">جاري التحميل...</div>;
  }

  return token ? children : <Navigate to="/login" />;
};

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8" />
            <h1 className="text-xl font-bold">رواد القيم</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant={isActive('/dashboard') ? 'secondary' : 'ghost'} className="text-white hover:bg-blue-700">
                <TrendingUp className="w-4 h-4 ml-2" />
                رصد دقيق
              </Button>
            </Link>
            <Link to="/honor-board">
              <Button variant={isActive('/honor-board') ? 'secondary' : 'ghost'} className="text-white hover:bg-blue-700">
                <Award className="w-4 h-4 ml-2" />
                لوحة الشرف
              </Button>
            </Link>
            <Link to="/reports">
              <Button variant={isActive('/reports') ? 'secondary' : 'ghost'} className="text-white hover:bg-blue-700">
                <FileText className="w-4 h-4 ml-2" />
                تقارير شاملة
              </Button>
            </Link>
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm">{user?.name}</span>
              <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-blue-700">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Undo Button Component (Floating)
const UndoButton = () => {
  const [showUndo, setShowUndo] = useState(false);

  const handleUndo = async () => {
    try {
      const res = await axios.post(`${API}/students/undo`);
      alert(res.data.message);
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={handleUndo}
        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg"
        title="استعادة آخر طالبة محذوفة"
      >
        <Undo2 className="w-6 h-6" />
      </Button>
    </div>
  );
};

// Login Page
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await axios.post(`${API}/auth/register`, { email, password, name, role: 'teacher' });
        alert('تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول');
        setIsRegister(false);
      } else {
        const res = await axios.post(`${API}/auth/login`, { email, password, remember_me: rememberMe });
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'حدث خطأ');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <GraduationCap className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">منصة رصد السلوك المتميز</h1>
          <p className="text-blue-100">مدرسة متوسطة عدران</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">رصد دقيق</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 text-sm">تتبع تفاصيل لسلوكيات الطالبات بنقاط متكاملة بعض العدالة والشفافية</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">لوحة الشرف</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 text-sm">عرض الطالبات المتميزات وتحفيز التميز السلوكي والأكاديمي بشكل مستمر</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-white">تقارير شاملة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-100 text-sm">تقارير أسبوعية وشهرية تمكن الطالبة وولي الأمر من متابعة السلوك والإنجاز بسهولة ووضوح</p>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-md mx-auto bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{isRegister ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</CardTitle>
            <CardDescription className="text-center">استخدم البريد الإلكتروني الوزاري</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {isRegister && (
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك"
                    required
                    className="text-right"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@moe.edu.sa"
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-right"
                />
              </div>

              {!isRegister && (
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                  />
                  <Label htmlFor="remember" className="cursor-pointer">تذكرني لمدة 30 يوماً</Label>
                </div>
              )}

              <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                {isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}
              </Button>

              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-blue-600"
                >
                  {isRegister ? 'لديك حساب؟ تسجيل الدخول' : 'ليس لديك حساب؟ إنشاء حساب جديد'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Dashboard Page
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showBehaviorDialog, setShowBehaviorDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', class_name: '', student_id: '' });
  const [behaviorData, setBehaviorData] = useState({ behavior_type: 'positive', points: 0, description: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/students`, newStudent);
      setShowAddDialog(false);
      setNewStudent({ name: '', class_name: '', student_id: '' });
      fetchStudents();
      alert('تم إضافة الطالبة بنجاح');
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الطالبة؟')) return;
    
    try {
      await axios.delete(`${API}/students/${id}`);
      fetchStudents();
      alert('تم حذف الطالبة. يمكنك التراجع باستخدام زر التراجع');
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handleAddBehavior = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/behaviors`, {
        student_id: selectedStudent.id,
        ...behaviorData
      });
      setShowBehaviorDialog(false);
      setBehaviorData({ behavior_type: 'positive', points: 0, description: '' });
      fetchStudents();
      alert('تم إضافة السلوك بنجاح');
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) || s.class_name.includes(searchTerm) || s.student_id.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <UndoButton />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">رصد دقيق</h2>
          <p className="text-gray-600">إدارة الطالبات وسلوكياتهن</p>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="البحث عن طالبة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-right"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 ml-2" />
            إضافة طالبة
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">الصف</TableHead>
                  <TableHead className="text-right">رقم الطالبة</TableHead>
                  <TableHead className="text-right">النقاط</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.class_name}</TableCell>
                    <TableCell>{student.student_id}</TableCell>
                    <TableCell>
                      <Badge variant={student.behavior_points >= 0 ? 'default' : 'destructive'}>
                        {student.behavior_points}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowBehaviorDialog(true);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة طالبة جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <Label>الاسم</Label>
              <Input
                value={newStudent.name}
                onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                required
                className="text-right"
              />
            </div>
            <div>
              <Label>الصف</Label>
              <Input
                value={newStudent.class_name}
                onChange={(e) => setNewStudent({...newStudent, class_name: e.target.value})}
                required
                className="text-right"
              />
            </div>
            <div>
              <Label>رقم الطالبة</Label>
              <Input
                value={newStudent.student_id}
                onChange={(e) => setNewStudent({...newStudent, student_id: e.target.value})}
                required
                className="text-right"
              />
            </div>
            <DialogFooter>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Behavior Dialog */}
      <Dialog open={showBehaviorDialog} onOpenChange={setShowBehaviorDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة سلوك - {selectedStudent?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBehavior} className="space-y-4">
            <div>
              <Label>نوع السلوك</Label>
              <Select value={behaviorData.behavior_type} onValueChange={(val) => setBehaviorData({...behaviorData, behavior_type: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">إيجابي</SelectItem>
                  <SelectItem value="negative">سلبي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>النقاط</Label>
              <Input
                type="number"
                value={behaviorData.points}
                onChange={(e) => setBehaviorData({...behaviorData, points: parseInt(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label>الوصف</Label>
              <Textarea
                value={behaviorData.description}
                onChange={(e) => setBehaviorData({...behaviorData, description: e.target.value})}
                required
                className="text-right"
              />
            </div>
            <DialogFooter>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Honor Board Page
const HonorBoard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/statistics/dashboard`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!stats) return <div>جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <UndoButton />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">لوحة الشرف</h2>
          <p className="text-gray-600">الطالبات المتميزات</p>
        </div>

        <div className="grid gap-6">
          {stats.top_students.map((student, index) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{student.name}</h3>
                      <p className="text-gray-600">{student.class_name}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-blue-600">{student.points}</div>
                    <div className="text-sm text-gray-500">نقطة</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reports Page
const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/statistics/dashboard`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleClearStatistics = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع الإحصائيات؟')) return;
    
    try {
      await axios.delete(`${API}/statistics/clear`);
      alert('تم حذف الإحصائيات بنجاح');
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  const handleClearBehaviors = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع سجلات السلوك؟')) return;
    
    try {
      await axios.delete(`${API}/behaviors/clear`);
      alert('تم حذف سجلات السلوك بنجاح');
      fetchStats();
    } catch (error) {
      alert(error.response?.data?.detail || 'حدث خطأ');
    }
  };

  if (!stats) return <div>جاري التحميل...</div>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <Navbar />
      <UndoButton />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">تقارير شاملة</h2>
          <p className="text-gray-600">إحصائيات شاملة عن النظام</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>إجمالي الطالبات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{stats.total_students}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>سجلات السلوك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{stats.total_behavior_records}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>متوسط النقاط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-600">{stats.average_points}</div>
            </CardContent>
          </Card>
        </div>

        {user?.role === 'admin' && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">إدارة البيانات</CardTitle>
              <CardDescription>عمليات حذف البيانات (للمدراء فقط)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button variant="destructive" onClick={handleClearStatistics}>
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف جميع الإحصائيات
                </Button>
                <Button variant="destructive" onClick={handleClearBehaviors}>
                  <Trash2 className="w-4 h-4 ml-2" />
                  حذف سجلات السلوك
                </Button>
              </div>
              <Alert>
                <AlertDescription>
                  تنبيه: هذه العمليات لا يمكن التراجع عنها!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/honor-board" element={
            <ProtectedRoute>
              <HonorBoard />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;