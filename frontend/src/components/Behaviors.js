import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { toast } from '../hooks/use-toast'; // Removed to avoid portal issues
import { mockStudents, mockBehaviors, BEHAVIOR_TYPES, STAGES, getStageLabel } from '../mockData';
import { Plus, TrendingUp, TrendingDown, Calendar, Trash2 } from 'lucide-react';

const Behaviors = ({ user }) => {
  const [behaviors, setBehaviors] = useState(mockBehaviors);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterStudent, setFilterStudent] = useState('all');
  const [newBehavior, setNewBehavior] = useState({
    stage: '',
    class: '',
    studentId: '',
    type: '',
    points: '',
    description: ''
  });

  const canEdit = user.role === 'principal' || user.role === 'teacher';

  const filteredBehaviors = filterStudent === 'all'
    ? behaviors
    : behaviors.filter(b => b.studentId === filterStudent);

  // Get filtered students based on selected stage and class
  const getFilteredStudents = () => {
    if (!newBehavior.stage || !newBehavior.class) {
      return [];
    }
    return mockStudents.filter(
      s => s.stage === newBehavior.stage && s.class === newBehavior.class
    );
  };

  const handleAddBehavior = () => {
    if (!newBehavior.stage || !newBehavior.class || !newBehavior.studentId || !newBehavior.type || !newBehavior.points || !newBehavior.description) {
      alert('يرجى ملء جميع الحقول');
      return;
    }

    const points = parseInt(newBehavior.points);
    if (points < 1 || points > 10) {
      alert('يجب أن تكون النقاط بين 1 و 10');
      return;
    }

    const finalPoints = newBehavior.type === 'positive' ? points : -points;
    const behavior = {
      id: `B${(behaviors.length + 1).toString().padStart(3, '0')}`,
      studentId: newBehavior.studentId,
      type: newBehavior.type,
      description: newBehavior.description,
      points: finalPoints,
      teacherId: user.id,
      teacherName: user.name,
      date: new Date().toISOString().split('T')[0]
    };

    // Add to mockBehaviors array
    mockBehaviors.push(behavior);
    
    setBehaviors([behavior, ...behaviors]);
    setIsAddDialogOpen(false);
    setNewBehavior({ stage: '', class: '', studentId: '', type: '', points: '', description: '' });
    
    alert('تمت الإضافة بنجاح - تم تسجيل السلوك للطالبة');
  };

  const selectedStage = STAGES.find(s => s.value === newBehavior.stage);
  const availableStudents = getFilteredStudents();

  const getStudentName = (studentId) => {
    const student = mockStudents.find(s => s.id === studentId);
    return student ? student.name : studentId;
  };

  const handleDeleteBehavior = (behaviorId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا السلوك؟')) {
      return;
    }
    
    const updatedBehaviors = behaviors.filter(b => b.id !== behaviorId);
    setBehaviors(updatedBehaviors);
    
    // Update mockBehaviors array
    const index = mockBehaviors.findIndex(b => b.id === behaviorId);
    if (index > -1) {
      mockBehaviors.splice(index, 1);
    }
    
    alert('تم حذف السلوك بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
            تسجيل السلوكيات
          </h1>
          <p className="text-gray-600 mt-1">عرض وإضافة سلوكيات الطالبات</p>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 ml-2" />
                تسجيل سلوك جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right">تسجيل سلوك جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-right block">المرحلة الدراسية</Label>
                  <Select 
                    value={newBehavior.stage} 
                    onValueChange={(value) => setNewBehavior({ 
                      stage: value, 
                      class: '', 
                      studentId: '', 
                      type: newBehavior.type, 
                      description: newBehavior.description 
                    })}
                  >
                    <SelectTrigger id="stage">
                      <SelectValue placeholder="اختر المرحلة" />
                    </SelectTrigger>
                    <SelectContent>
                      {STAGES.map(stage => (
                        <SelectItem key={stage.value} value={stage.value}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class" className="text-right block">الفصل</Label>
                  <Select 
                    value={newBehavior.class} 
                    onValueChange={(value) => setNewBehavior({ 
                      ...newBehavior, 
                      class: value, 
                      studentId: '' 
                    })} 
                    disabled={!newBehavior.stage}
                  >
                    <SelectTrigger id="class">
                      <SelectValue placeholder="اختر الفصل" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedStage?.classes.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="student" className="text-right block">اسم الطالبة</Label>
                  <Select 
                    value={newBehavior.studentId} 
                    onValueChange={(value) => setNewBehavior({ ...newBehavior, studentId: value })}
                    disabled={!newBehavior.stage || !newBehavior.class}
                  >
                    <SelectTrigger id="student">
                      <SelectValue placeholder="اختر الطالبة" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStudents.length > 0 ? (
                        availableStudents.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>
                          لا توجد طالبات في هذا الفصل
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-right block">نوع السلوك</Label>
                  <Select value={newBehavior.type} onValueChange={(value) => setNewBehavior({ ...newBehavior, type: value })}>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="اختر نوع السلوك" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIOR_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points" className="text-right block">عدد النقاط (من 1 إلى 10)</Label>
                  <Input
                    id="points"
                    type="number"
                    min="1"
                    max="10"
                    placeholder="أدخل عدد النقاط"
                    value={newBehavior.points}
                    onChange={(e) => setNewBehavior({ ...newBehavior, points: e.target.value })}
                    className="text-right"
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {newBehavior.type === 'positive' && newBehavior.points && `سيتم إضافة +${newBehavior.points} نقطة`}
                    {newBehavior.type === 'negative' && newBehavior.points && `سيتم خصم -${newBehavior.points} نقطة`}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-right block">الوصف</Label>
                  <Textarea
                    id="description"
                    placeholder="أدخل وصف السلوك..."
                    value={newBehavior.description}
                    onChange={(e) => setNewBehavior({ ...newBehavior, description: e.target.value })}
                    className="text-right min-h-24"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBehavior} className="bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 w-full">
                  تسجيل السلوك
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="max-w-md">
            <Label className="text-right block mb-2">تصفية حسب الطالبة</Label>
            <Select value={filterStudent} onValueChange={setFilterStudent}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الطالبات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطالبات</SelectItem>
                {mockStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Behaviors List */}
      <Card>
        <CardHeader>
          <CardTitle>السجل ({filteredBehaviors.length})</CardTitle>
          <CardDescription>جميع السلوكيات المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredBehaviors.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">لا توجد سلوكيات مسجلة</p>
              </div>
            ) : (
              filteredBehaviors.map(behavior => (
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
                        <h3 className="font-semibold text-gray-900">{getStudentName(behavior.studentId)}</h3>
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
                    <div className="flex items-center gap-3">
                      <div className="text-left">
                        <div className={`text-2xl font-bold ${
                          behavior.type === 'positive' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {behavior.points > 0 ? '+' : ''}{behavior.points}
                        </div>
                        <p className="text-xs text-gray-500">نقطة</p>
                      </div>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBehavior(behavior.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
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

export default Behaviors;