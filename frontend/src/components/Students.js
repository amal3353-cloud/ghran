import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from '../hooks/use-toast';
import { mockStudents, STAGES, getStageLabel } from '../mockData';
import { Plus, Trash2, Search, Users, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const Students = ({ user }) => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importSettings, setImportSettings] = useState({
    stage: '',
    class: ''
  });
  const [newStudent, setNewStudent] = useState({
    name: '',
    stage: '',
    class: ''
  });
  const fileInputRef = React.useRef(null);

  const canEdit = user.role === 'principal' || user.role === 'teacher';

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || student.stage === filterStage;
    const matchesClass = filterClass === 'all' || student.class === filterClass;
    return matchesSearch && matchesStage && matchesClass;
  });

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.stage || !newStudent.class) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive'
      });
      return;
    }

    const student = {
      id: `S${(students.length + 1).toString().padStart(3, '0')}`,
      ...newStudent,
      totalPoints: 0
    };

    setStudents([...students, student]);
    setIsAddDialogOpen(false);
    setNewStudent({ name: '', stage: '', class: '' });
    
    toast({
      title: 'تمت الإضافة بنجاح',
      description: `تم إضافة الطالبة ${student.name}`
    });
  };

  const handleDeleteStudent = (studentId, studentName) => {
    setStudents(students.filter(s => s.id !== studentId));
    toast({
      title: 'تم الحذف بنجاح',
      description: `تم حذف الطالبة ${studentName}`
    });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!importSettings.stage || !importSettings.class) {
      toast({
        title: 'خطأ',
        description: 'يرجى اختيار المرحلة والفصل أولاً',
        variant: 'destructive'
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Process the data - expecting only names
        let addedCount = 0;
        const newStudents = [];

        jsonData.forEach((row, index) => {
          // Skip header row if it exists
          if (index === 0 && (row[0] === 'الاسم' || row[0] === 'Name' || row[0] === 'name')) {
            return;
          }

          // Get the name from first column
          const name = row[0] ? row[0].toString().trim() : '';

          if (!name || name.length < 2) {
            return; // Skip empty or invalid names
          }

          const student = {
            id: `S${(students.length + newStudents.length + 1).toString().padStart(3, '0')}`,
            name: name,
            stage: importSettings.stage,
            class: importSettings.class,
            totalPoints: 0
          };

          newStudents.push(student);
          addedCount++;
        });

        if (newStudents.length > 0) {
          setStudents([...students, ...newStudents]);
          setIsImportDialogOpen(false);
          setImportSettings({ stage: '', class: '' });
          toast({
            title: 'تمت الإضافة بنجاح',
            description: `تم استيراد ${addedCount} طالبة إلى ${getStageLabel(importSettings.stage)} - الفصل ${importSettings.class}`
          });
        } else {
          toast({
            title: 'تنبيه',
            description: 'لم يتم العثور على أسماء صحيحة في الملف',
            variant: 'destructive'
          });
        }

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast({
          title: 'خطأ',
          description: 'حدث خطأ في قراءة الملف. تأكد من صحة تنسيق Excel',
          variant: 'destructive'
        });
        console.error('Error reading Excel file:', error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const selectedStage = STAGES.find(s => s.value === newStudent.stage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            إدارة الطالبات
          </h1>
          <p className="text-gray-600 mt-1">عرض وإدارة بيانات الطالبات</p>
        </div>
        {canEdit && (
          <div className="flex gap-3">
            <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-gradient-to-l from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Upload className="w-4 h-4 ml-2" />
                  استيراد من Excel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-right">استيراد طالبات من Excel</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-stage" className="text-right block">المرحلة الدراسية</Label>
                    <Select 
                      value={importSettings.stage} 
                      onValueChange={(value) => setImportSettings({ ...importSettings, stage: value, class: '' })}
                    >
                      <SelectTrigger id="import-stage">
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
                    <Label htmlFor="import-class" className="text-right block">الفصل</Label>
                    <Select 
                      value={importSettings.class} 
                      onValueChange={(value) => setImportSettings({ ...importSettings, class: value })}
                      disabled={!importSettings.stage}
                    >
                      <SelectTrigger id="import-class">
                        <SelectValue placeholder="اختر الفصل" />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.find(s => s.value === importSettings.stage)?.classes.map(cls => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-right block">ملف Excel</Label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      className="w-full"
                      disabled={!importSettings.stage || !importSettings.class}
                    >
                      <Upload className="w-4 h-4 ml-2" />
                      اختر ملف Excel
                    </Button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-gray-700">
                    <p className="font-semibold mb-1">تنسيق الملف المطلوب:</p>
                    <ul className="space-y-1">
                      <li>• يجب أن يحتوي الملف على عمود واحد فقط للأسماء</li>
                      <li>• يمكن وضع عنوان "الاسم" في الصف الأول (اختياري)</li>
                      <li>• كل صف يحتوي على اسم طالبة واحدة</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-l from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة طالبة
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right">إضافة طالبة جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block">اسم الطالبة</Label>
                  <Input
                    id="name"
                    placeholder="أدخل اسم الطالبة"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stage" className="text-right block">المرحلة الدراسية</Label>
                  <Select value={newStudent.stage} onValueChange={(value) => setNewStudent({ ...newStudent, stage: value, class: '' })}>
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
                  <Select value={newStudent.class} onValueChange={(value) => setNewStudent({ ...newStudent, class: value })} disabled={!newStudent.stage}>
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
              </div>
              <DialogFooter>
                <Button onClick={handleAddStudent} className="bg-gradient-to-l from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 w-full">
                  إضافة الطالبة
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="البحث عن طالبة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>
            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger>
                <SelectValue placeholder="جميع المراحل" />
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
            <Select value={filterClass} onValueChange={setFilterClass}>
              <SelectTrigger>
                <SelectValue placeholder="جميع الفصول" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفصول</SelectItem>
                <SelectItem value="أ">أ</SelectItem>
                <SelectItem value="ب">ب</SelectItem>
                <SelectItem value="ج">ج</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة الطالبات ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">لا توجد طالبات</p>
              </div>
            ) : (
              filteredStudents.map(student => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{student.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getStageLabel(student.stage)} - الفصل {student.class} • الرقم: {student.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="text-2xl font-bold text-emerald-600">{student.totalPoints}</p>
                      <p className="text-xs text-gray-500">نقطة</p>
                    </div>
                    {canEdit && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="hover:bg-red-600 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
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

export default Students;