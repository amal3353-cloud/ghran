// Mock data for the school management system

export const STAGES = [
  { value: 'first_middle', label: 'أول متوسط', classes: ['أ', 'ب', 'ج'] },
  { value: 'second_middle', label: 'ثاني متوسط', classes: ['أ', 'ب', 'ج'] },
  { value: 'third_middle', label: 'ثالث متوسط', classes: ['أ', 'ب'] }
];

export const BEHAVIOR_TYPES = [
  { value: 'positive', label: 'سلوك إيجابي', color: 'green' },
  { value: 'negative', label: 'سلوك سلبي', color: 'red' }
];

export const mockUsers = [
  {
    id: '1',
    name: 'عائشة عبدالعزيز الراشدي',
    email: 'principal@moe.edu.sa',
    role: 'principal',
    password: '123456'
  },
  {
    id: '2',
    name: 'نورة أحمد السالم',
    email: 'noura.ahmed@moe.edu.sa',
    role: 'teacher',
    password: '123456',
    phone: '0501234567'
  },
  {
    id: '3',
    name: 'سارة محمد العتيبي',
    email: 'sara.mohammed@moe.edu.sa',
    role: 'teacher',
    password: '123456',
    phone: '0509876543'
  },
  {
    id: '4',
    name: 'منى عبدالله القحطاني',
    email: 'muna.abdullah@moe.edu.sa',
    role: 'teacher',
    password: '123456',
    phone: '0551234567'
  },
  {
    id: '5',
    name: 'هدى سعيد الغامدي',
    email: 'huda.saeed@moe.edu.sa',
    role: 'teacher',
    password: '123456',
    phone: '0559876543'
  },
  {
    id: '6',
    name: 'فاطمة علي',
    email: 'fatima.ali@student.moe.edu.sa',
    role: 'student',
    password: '123456',
    studentId: 'S001'
  }
];

export const mockStudents = [
  {
    id: 'S001',
    name: 'ابرار محمد بن حمدان بن احمد الحيدي الشهري',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 85,
    email: 'abrar@student.moe.edu.sa'
  },
  {
    id: 'S002',
    name: 'جمان احمد مسعد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 78
  },
  {
    id: 'S003',
    name: 'تاله صلاح محمد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 72
  },
  {
    id: 'S004',
    name: 'ترف علي صالح الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 65
  },
  {
    id: 'S005',
    name: 'جمانه حمادي حميد الحربى',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 60
  },
  {
    id: 'S006',
    name: 'ديالا نواف محمد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S007',
    name: 'جوانا سامي عبدالحفيظ الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S008',
    name: 'حفيظه فهد معيض المولد',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S009',
    name: 'ديمه حامد عوض الله العتيبي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S010',
    name: 'رنيم انور ابوزيد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S011',
    name: 'رهف سامى احمد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S012',
    name: 'سديم بندر العفين السلمى',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S013',
    name: 'سديم فواز عامر الشيخ',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S014',
    name: 'علياء فؤاد يحيي الريه',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S015',
    name: 'غزل حميد حامد الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S016',
    name: 'فريدة عيد فتحي عبد النظير',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S017',
    name: 'قمر بنت عبدالعالي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S018',
    name: 'كناز علي ابن محمد المولد',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S019',
    name: 'ميار صالح عطيه الله الصحفي',
    stage: 'first_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S020',
    name: 'ألين محمد سعيد الصحفي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 92
  },
  {
    id: 'S021',
    name: 'اسماء لاحق محمد الحربي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 88
  },
  {
    id: 'S022',
    name: 'الجازي مسعود سعيد المسفري المجنوني',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 81
  },
  {
    id: 'S023',
    name: 'الجوري باسم احمد الصحفي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 75
  },
  {
    id: 'S024',
    name: 'الين ضيف الله بن سليمان الحربي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 70
  },
  {
    id: 'S025',
    name: 'جمانة مبارك بن عبدالله السلمي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S026',
    name: 'حنين مشعل محمد الغامدي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S027',
    name: 'رتيل اسامة بن محمد بن راجي الصعيدي الحربي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S028',
    name: 'ريسان ياسر بن مخضور المولد',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S029',
    name: 'ريماس عثمان رشيد المعبدي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S030',
    name: 'سديم حمد بن حمود السلمي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S031',
    name: 'سديم نايف بن محمدعلي الصعيدي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S032',
    name: 'سميه لاحق محمد الحربي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S033',
    name: 'سيرين نجيب بن عبدالحميد المصباحي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S034',
    name: 'شادن محمد خلف البشري',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S035',
    name: 'شام خالد عبد الواحد',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S036',
    name: 'فجر عبدالعزيز عبدالله الغانمي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S037',
    name: 'نمارق عبدالله بطيحان السلمي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S038',
    name: 'نور خالد عبد الواحد',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S039',
    name: 'نوران عادل عابد البشرى',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S040',
    name: 'هاجر جلال حسين شريف',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S041',
    name: 'وتين عبدالعالي بن سعيد السلمي',
    stage: 'first_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S042',
    name: 'أسيل نواف عبدالكريم الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 95
  },
  {
    id: 'S043',
    name: 'أيه بدر عبود الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 90
  },
  {
    id: 'S044',
    name: 'ايلاف بنت حميد بن سويد البسيسي السلمي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 86
  },
  {
    id: 'S045',
    name: 'ايمان احمد نافع المعبدي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 82
  },
  {
    id: 'S046',
    name: 'تالا عطيه بن رازن الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 78
  },
  {
    id: 'S047',
    name: 'جنان عبدالواحد فتح الرحمن فضل المنان',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S048',
    name: 'جوانا عزيز بن مسعود الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S049',
    name: 'جوري عيسى عطيه الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S050',
    name: 'حور بنت سعيد بن محمد بن حامد المسفري المجنوني',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S051',
    name: 'رشا عبدالله صبحي عجاج',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S052',
    name: 'رغد لاحق محمد الحربي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S053',
    name: 'رهف محمد معيوف الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S054',
    name: 'روان أبكر عبدالرحمن زين',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S055',
    name: 'رولا وليد مقبل هزبار',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S056',
    name: 'روين مفرح مناع الحربي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S057',
    name: 'ريتال طلال رحيم الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S058',
    name: 'ريتال نفيع بن عمر الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S059',
    name: 'ريلام عمر ثابت الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S060',
    name: 'ريما بندر غلاب الحربى',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S061',
    name: 'غرور محمد حامد كاسو',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S062',
    name: 'غزل ياسر ابن حسين الشيخ',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S063',
    name: 'غنى ايمن ابراهيم الصبحي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S064',
    name: 'لارين امين ضيف الله البلادي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S065',
    name: 'لينا عاطف محمد علي الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S066',
    name: 'ماريا بنت محمود بن عطيه بن عابد المحمادى الحربي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S067',
    name: 'ميار حميد سهل المعبدي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S068',
    name: 'نمار سلطان شليان المعبدي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S069',
    name: 'نهاد خالد عبدالخالق عبدالواحد',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S070',
    name: 'نور محمد فواز الحجي محمد',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S071',
    name: 'هيا رضوان مبارك بن سليم',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S072',
    name: 'وتين فهد بن حميد الصحفى',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S073',
    name: 'وريف فواز حميد الصحفي',
    stage: 'third_middle',
    class: 'أ',
    totalPoints: 0
  },
  {
    id: 'S074',
    name: 'أريام محمد عامر الهندي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 98
  },
  {
    id: 'S075',
    name: 'ألين ثامر عبدالرحمن الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 93
  },
  {
    id: 'S076',
    name: 'ابرار كامل كمال علي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 89
  },
  {
    id: 'S077',
    name: 'بيسان عبدالرحمن محمد عبدالواحد',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 84
  },
  {
    id: 'S078',
    name: 'تالين علي بن محمد العمري',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 80
  },
  {
    id: 'S079',
    name: 'ترف سعود مسعد الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S080',
    name: 'تولين حامد خلف الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S081',
    name: 'دانه حمادي حميد الحربى',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S082',
    name: 'رسيل علي ابن محمد المولد',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S083',
    name: 'رغد عوض الله بن رشيد السلمي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S084',
    name: 'ريتاج بنت عوض بن جابر بن معيوف القزيعى السلمى',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S085',
    name: 'ريتال حمادي ابن احمد الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S086',
    name: 'ريتال فيصل مسلم البلادي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S087',
    name: 'ريماس سعد بن وصل الله السلمي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S088',
    name: 'سماح احمد عبدالله الحامد',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S089',
    name: 'شادن سعيد بن معلا المحمادي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S090',
    name: 'شذا عبدالله صالح الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S091',
    name: 'شذا فوزى مرزوق الجهنى',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S092',
    name: 'عائشة فهد محمد العمري',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S093',
    name: 'فدوى محمد الشعبان',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S094',
    name: 'لجين نايف بن فهيد بن مسلط العضيله المطيري',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S095',
    name: 'ليان عصام محمد العدواني',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S096',
    name: 'ليان محمد حمد المولد',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S097',
    name: 'لين عماد دخيل الله الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S098',
    name: 'مرح حميد عطاالله الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S099',
    name: 'ملك ماجد عبدالرحمن الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S100',
    name: 'ميار بنت عادل بن عبد الكريم بن خويتم العطاوي السلمي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S101',
    name: 'ميار عثمان رشيد المعبدي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S102',
    name: 'ميرال حمد احمد اليوبي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S103',
    name: 'وتين انور حضيض المحمادي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  },
  {
    id: 'S104',
    name: 'ورد انور رازن الصحفي',
    stage: 'third_middle',
    class: 'ب',
    totalPoints: 0
  }
];

export const mockBehaviors = [
  {
    id: 'B001',
    studentId: 'S001',
    type: 'positive',
    description: 'مشاركة فعالة في الحصة',
    points: 10,
    teacherId: '2',
    teacherName: 'نورة أحمد السالم',
    date: '2025-01-15'
  },
  {
    id: 'B002',
    studentId: 'S001',
    type: 'positive',
    description: 'حل الواجب بشكل ممتاز',
    points: 10,
    teacherId: '3',
    teacherName: 'سارة محمد العتيبي',
    date: '2025-01-14'
  },
  {
    id: 'B003',
    studentId: 'S001',
    type: 'negative',
    description: 'تأخر عن الحصة',
    points: -5,
    teacherId: '2',
    teacherName: 'نورة أحمد السالم',
    date: '2025-01-13'
  },
  {
    id: 'B004',
    studentId: 'S004',
    type: 'positive',
    description: 'مساعدة زميلاتها',
    points: 10,
    teacherId: '2',
    teacherName: 'نورة أحمد السالم',
    date: '2025-01-15'
  },
  {
    id: 'B005',
    studentId: 'S007',
    type: 'positive',
    description: 'تفوق في الاختبار',
    points: 10,
    teacherId: '3',
    teacherName: 'سارة محمد العتيبي',
    date: '2025-01-14'
  },
  {
    id: 'B006',
    studentId: 'S002',
    type: 'positive',
    description: 'تميز في النظافة',
    points: 10,
    teacherId: '4',
    teacherName: 'منى عبدالله القحطاني',
    date: '2025-01-15'
  },
  {
    id: 'B007',
    studentId: 'S002',
    type: 'positive',
    description: 'مشاركة في النشاط',
    points: 10,
    teacherId: '4',
    teacherName: 'منى عبدالله القحطاني',
    date: '2025-01-14'
  },
  {
    id: 'B008',
    studentId: 'S003',
    type: 'positive',
    description: 'التزام بالزي المدرسي',
    points: 10,
    teacherId: '5',
    teacherName: 'هدى سعيد الغامدي',
    date: '2025-01-15'
  },
  {
    id: 'B009',
    studentId: 'S005',
    type: 'positive',
    description: 'احترام المعلمات',
    points: 10,
    teacherId: '5',
    teacherName: 'هدى سعيد الغامدي',
    date: '2025-01-14'
  },
  {
    id: 'B010',
    studentId: 'S006',
    type: 'positive',
    description: 'انضباط في الحضور',
    points: 10,
    teacherId: '2',
    teacherName: 'نورة أحمد السالم',
    date: '2025-01-13'
  },
  {
    id: 'B011',
    studentId: 'S008',
    type: 'positive',
    description: 'مساعدة في تنظيف الفصل',
    points: 10,
    teacherId: '3',
    teacherName: 'سارة محمد العتيبي',
    date: '2025-01-13'
  }
];

// Helper functions
export const getStudentsByStageAndClass = (stage, classSection) => {
  return mockStudents.filter(
    s => s.stage === stage && s.class === classSection
  );
};

export const getBehaviorsByStudent = (studentId) => {
  return mockBehaviors.filter(b => b.studentId === studentId);
};

export const getStageLabel = (stageValue) => {
  const stage = STAGES.find(s => s.value === stageValue);
  return stage ? stage.label : stageValue;
};

export const authenticateUser = (email, password) => {
  return mockUsers.find(u => u.email === email && u.password === password);
};