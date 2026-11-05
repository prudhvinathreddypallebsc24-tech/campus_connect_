export const initialUsers = [
  {
    id: 'usr_student_1',
    email: 'student@campus.com',
    password: 'student123',
    role: 'student',
    name: 'Alex Johnson',
    studentId: 'CS-2023-049',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    cgpa: '3.82 / 4.00',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_101', 'crs_102', 'crs_103', 'crs_104'],
    joinedDate: '2023-08-15'
  },
  {
    id: 'usr_student_2',
    email: 'elena.rostova@campus.com',
    password: 'password123',
    role: 'student',
    name: 'Elena Rostova',
    studentId: 'CS-2023-012',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    cgpa: '3.91 / 4.00',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_101', 'crs_102', 'crs_104'],
    joinedDate: '2023-08-15'
  },
  {
    id: 'usr_student_3',
    email: 'marcus.chen@campus.com',
    password: 'password123',
    role: 'student',
    name: 'Marcus Chen',
    studentId: 'CS-2023-088',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    cgpa: '3.75 / 4.00',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_101', 'crs_103', 'crs_104'],
    joinedDate: '2023-08-15'
  },
  {
    id: 'usr_student_4',
    email: 'samantha.brooks@campus.com',
    password: 'password123',
    role: 'student',
    name: 'Samantha Brooks',
    studentId: 'EE-2022-031',
    department: 'Electrical Engineering',
    semester: '7th Semester',
    cgpa: '3.68 / 4.00',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    enrolledCourseIds: ['crs_102'],
    joinedDate: '2022-08-20'
  },
  {
    id: 'usr_faculty_1',
    email: 'faculty@campus.com',
    password: 'faculty123',
    role: 'faculty',
    name: 'Dr. Robert Vance',
    facultyId: 'FAC-ENG-108',
    department: 'Computer Science & Engineering',
    title: 'Associate Professor & Dept Chair',
    office: 'Engineering Block B, Room 412',
    officeHours: 'Mon & Wed, 2:00 PM - 4:30 PM',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    assignedCourseIds: ['crs_101', 'crs_103'],
    joinedDate: '2019-01-10'
  },
  {
    id: 'usr_faculty_2',
    email: 'sarah.mitchell@campus.com',
    password: 'faculty123',
    role: 'faculty',
    name: 'Dr. Sarah Mitchell',
    facultyId: 'FAC-ENG-214',
    department: 'Computer Science & Engineering',
    title: 'Assistant Professor (Data Systems)',
    office: 'Turing Hall, Room 204',
    officeHours: 'Tue & Thu, 10:00 AM - 12:00 PM',
    phone: '+1 (555) 765-4321',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    assignedCourseIds: ['crs_102'],
    joinedDate: '2021-06-15'
  },
  {
    id: 'usr_faculty_3',
    email: 'alan.sterling@campus.com',
    password: 'faculty123',
    role: 'faculty',
    name: 'Prof. Alan Sterling',
    facultyId: 'FAC-ENG-092',
    department: 'Software Engineering',
    title: 'Senior Lecturer',
    office: 'Lovelace Center, Room 118',
    officeHours: 'Wed & Fri, 1:00 PM - 3:00 PM',
    phone: '+1 (555) 654-3210',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    assignedCourseIds: ['crs_104'],
    joinedDate: '2018-09-01'
  },
  {
    id: 'usr_admin_1',
    email: 'admin@campus.com',
    password: 'admin123',
    role: 'admin',
    name: 'Dean Eleanor Wright',
    adminId: 'ADM-EXEC-001',
    department: 'Office of Academic Affairs & IT Services',
    title: 'Dean of Digital Infrastructure',
    phone: '+1 (555) 999-0011',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    joinedDate: '2016-04-01'
  }
];

export const initialCourses = [
  {
    id: 'crs_101',
    code: 'CS301',
    name: 'Advanced Data Structures & Algorithms',
    department: 'Computer Science & Engineering',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Robert Vance',
    credits: 4,
    schedule: 'Mon & Wed 10:00 AM - 11:30 AM',
    room: 'Hall A-102',
    semester: 'Fall 2026',
    enrolledStudents: ['usr_student_1', 'usr_student_2', 'usr_student_3'],
    description: 'Advanced study of algorithmic paradigm analysis, balanced search trees, graph theory algorithms, NP-completeness, and amortized complexity bounds.',
    syllabus: [
      'Week 1-3: Red-Black & B-Trees with Amortized Analysis',
      'Week 4-6: Advanced Graph Algorithms (Tarjan, Edmonds-Karp)',
      'Week 7-9: Dynamic Programming & Space-State Reductions',
      'Week 10-12: Approximation Algorithms & NP-Completeness',
      'Week 13-15: Final Capstone Implementation and Project Defense'
    ]
  },
  {
    id: 'crs_102',
    code: 'CS304',
    name: 'Database Management & Architecture',
    department: 'Computer Science & Engineering',
    facultyId: 'usr_faculty_2',
    facultyName: 'Dr. Sarah Mitchell',
    credits: 3,
    schedule: 'Tue & Thu 01:00 PM - 02:30 PM',
    room: 'Computing Lab 3',
    semester: 'Fall 2026',
    enrolledStudents: ['usr_student_1', 'usr_student_2', 'usr_student_4'],
    description: 'Relational algebra, SQL tuning, indexing structures, ACID guarantees, WAL protocols, and distributed database sharding strategies.',
    syllabus: [
      'Week 1-3: Relational Calculus & Complex SQL Queries',
      'Week 4-6: B+ Tree Indexing & Hash-Based Storage Engines',
      'Week 7-9: Query Optimization & Execution Plans',
      'Week 10-12: Transaction Management & Distributed Consensus',
      'Week 13-15: NoSQL & Columnar Engines Laboratory'
    ]
  },
  {
    id: 'crs_103',
    code: 'CS308',
    name: 'Operating Systems & System Programming',
    department: 'Computer Science & Engineering',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Robert Vance',
    credits: 4,
    schedule: 'Tue & Fri 09:00 AM - 10:30 AM',
    room: 'Hall B-204',
    semester: 'Fall 2026',
    enrolledStudents: ['usr_student_1', 'usr_student_3'],
    description: 'Kernel architectures, multi-threaded synchronization, virtual memory paging algorithms, Unix IPC primitives, and device driver subsystems.',
    syllabus: [
      'Week 1-3: Process Lifecycle & POSIX Multithreading',
      'Week 4-6: Concurrency, Mutexes, and Deadlock Avoidance',
      'Week 7-9: Virtual Memory Hierarchy & Page Replacement',
      'Week 10-12: File System Design & Inode Operations',
      'Week 13-15: Custom Microkernel Extension Module'
    ]
  },
  {
    id: 'crs_104',
    code: 'CS312',
    name: 'Cloud Computing & Distributed Systems',
    department: 'Computer Science & Engineering',
    facultyId: 'usr_faculty_3',
    facultyName: 'Prof. Alan Sterling',
    credits: 3,
    schedule: 'Thu 03:00 PM - 05:00 PM',
    room: 'Seminar Hall 1',
    semester: 'Fall 2026',
    enrolledStudents: ['usr_student_1', 'usr_student_2', 'usr_student_3'],
    description: 'Principles of modern distributed systems, cloud infrastructure, container orchestration with Kubernetes, and resilient event-driven architectures.',
    syllabus: [
      'Week 1-3: CAP Theorem, RPC, and Clock Synchronization',
      'Week 4-6: Microservices & Event-Driven Message Brokers',
      'Week 7-9: Containerization & Kubernetes Cluster Orchestration',
      'Week 10-12: Fault Tolerance, Raft, and Distributed Consensus',
      'Week 13-15: Cloud-native Production Deployment'
    ]
  }
];

export const initialAnnouncements = [
  {
    id: 'anc_1',
    title: 'Midterm Examination Schedule Published (Fall 2026)',
    description: 'The comprehensive timetable for the upcoming Midterm Examinations has been released by the Office of Academic Affairs. Examinations will begin on November 20th. Please verify your course seating allocations and report any scheduling conflicts to your respective department coordinators by Friday.',
    category: 'Examination',
    priority: 'high',
    authorName: 'Office of Academic Affairs',
    authorRole: 'admin',
    date: '2026-11-03',
    pinned: true
  },
  {
    id: 'anc_2',
    title: 'Annual Campus Innovation Hackathon 2026 Announced',
    description: 'Registration is now open for the 48-Hour Campus Hackathon! Cash prizes up to $10,000, mentorship from top technology firms, and incubation grants for top-performing teams. Form your teams of 3-4 students and register before November 12th.',
    category: 'Campus Life',
    priority: 'medium',
    authorName: 'Tech & Robotics Club',
    authorRole: 'faculty',
    date: '2026-11-02',
    pinned: true
  },
  {
    id: 'anc_3',
    title: 'CS301 Algorithm Programming Assignment 2 Deadline Extension',
    description: 'Due to the upcoming national engineering symposium, the submission deadline for Assignment 2 (Fibonacci Heaps & Tarjan SCC) has been extended by 48 hours. Please ensure your test suites pass on the automated submission portal.',
    category: 'Academic',
    priority: 'normal',
    authorName: 'Dr. Robert Vance',
    authorRole: 'faculty',
    date: '2026-11-01',
    pinned: false
  },
  {
    id: 'anc_4',
    title: 'Campus Central Library 24/7 Hours During Exam Month',
    description: 'To facilitate uninterrupted exam preparation, the Central Library will operate 24 hours a day starting next Monday. Night bus services between the library and student residence halls will run every 30 minutes.',
    category: 'Campus Life',
    priority: 'normal',
    authorName: 'Dean Eleanor Wright',
    authorRole: 'admin',
    date: '2026-10-30',
    pinned: false
  },
  {
    id: 'anc_5',
    title: 'Spring 2027 Elective Course Pre-Registration Notice',
    description: 'The portal for previewing Spring 2027 elective courses and prerequisites will open on November 15. All 3rd and 4th year students are advised to schedule an advising session with their faculty mentors.',
    category: 'Academic',
    priority: 'medium',
    authorName: 'Dean Eleanor Wright',
    authorRole: 'admin',
    date: '2026-10-28',
    pinned: false
  },
  {
    id: 'anc_6',
    title: 'Fall Campus Placement Drive: Tier-1 Tech Companies Visiting',
    description: 'Career Services Center confirms on-campus interviews beginning November 25. Eligible final-year and pre-final year students must update their resumes and verify their academic credentials.',
    category: 'Career',
    priority: 'high',
    authorName: 'Career & Placement Cell',
    authorRole: 'admin',
    date: '2026-10-25',
    pinned: false
  }
];

export const initialEvents = [
  {
    id: 'evt_1',
    title: 'Campus Hackathon 2026: AI & Systems',
    date: '2026-11-18',
    time: '09:00 AM - 09:00 PM (48 Hours)',
    venue: 'Innovation Center, Hall C & D',
    category: 'Tech & Coding',
    description: 'A 48-hour collaborative build sprint focusing on artificial intelligence, systems software, and distributed applications. Free food, swag kits, and direct networking with industry sponsors.',
    organizer: 'Dept. of Computer Science',
    capacity: 200,
    registeredUserIds: ['usr_student_1', 'usr_student_2'],
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt_2',
    title: 'Guest Lecture: Modern Distributed Systems at Scale',
    date: '2026-11-12',
    time: '02:00 PM - 04:00 PM',
    venue: 'Auditorium A',
    category: 'Workshop',
    description: 'Keynote speech by Dr. Evelyn Zhao, Principal Distributed Systems Architect. Deep dive into consensus protocols, Raft vs Paxos, and geo-replicated databases.',
    organizer: 'IEEE Student Branch',
    capacity: 150,
    registeredUserIds: ['usr_student_1'],
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt_3',
    title: 'Fall University Career & Internship Fair',
    date: '2026-11-25',
    time: '10:00 AM - 05:00 PM',
    venue: 'Student Recreation & Athletic Complex',
    category: 'Career Fair',
    description: 'Over 65 partner companies and research institutions recruiting for summer internships, full-time engineering roles, and academic research fellowships.',
    organizer: 'Career Services Center',
    capacity: 500,
    registeredUserIds: ['usr_student_2', 'usr_student_3'],
    bannerUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt_4',
    title: 'Annual Inter-Department Football Championship',
    date: '2026-11-28',
    time: '04:00 PM - 07:00 PM',
    venue: 'Main Sports Arena Ground',
    category: 'Sports',
    description: 'The championship finals between Engineering and Sciences! Cheer for your department with food trucks, band performances, and live scoreboards.',
    organizer: 'Athletics Committee',
    capacity: 350,
    registeredUserIds: [],
    bannerUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'evt_5',
    title: 'Open Source Workshop: Git, PRs, and Linux Kernel Tools',
    date: '2026-12-02',
    time: '01:30 PM - 04:30 PM',
    venue: 'Computing Lab 1 & 2',
    category: 'Workshop',
    description: 'Hands-on practical workshop teaching git rebase workflows, signing commits with GPG, submitting Linux kernel patches, and making your first open source contribution.',
    organizer: 'Open Source Club',
    capacity: 80,
    registeredUserIds: ['usr_student_1'],
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
  }
];

export const initialAssignments = [
  {
    id: 'asg_1',
    courseId: 'crs_101',
    courseCode: 'CS301',
    courseName: 'Advanced Data Structures & Algorithms',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Robert Vance',
    title: 'Assignment 2: Fibonacci Heap Implementation',
    description: 'Implement a complete Fibonacci Heap supporting insert, find-min, extract-min, decrease-key, and delete operations in C++ or Java with full unit tests and amortized complexity benchmarking against Binary Heap.',
    deadline: '2026-11-15T23:59:00',
    totalPoints: 100,
    submissions: [
      {
        studentId: 'usr_student_1',
        studentName: 'Alex Johnson',
        submittedAt: '2026-11-04T16:20:00',
        status: 'Submitted',
        fileUrl: 'fibonacci_heap_alex_johnson.zip',
        grade: '96 / 100',
        feedback: 'Superb implementation of decrease-key with cascading cut. Amortized proof is well structured.'
      },
      {
        studentId: 'usr_student_2',
        studentName: 'Elena Rostova',
        submittedAt: '2026-11-03T11:45:00',
        status: 'Submitted',
        fileUrl: 'elena_heap_solution.cpp',
        grade: '92 / 100',
        feedback: 'Good work. Check edge case for empty roots circular list.'
      }
    ]
  },
  {
    id: 'asg_2',
    courseId: 'crs_101',
    courseCode: 'CS301',
    courseName: 'Advanced Data Structures & Algorithms',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Robert Vance',
    title: 'Assignment 3: Max-Flow & Min-Cut Network Optimization',
    description: 'Apply the Edmonds-Karp and Dinic algorithms to solve maximum bipartite matching and network routing capacity optimization problem sets.',
    deadline: '2026-11-22T23:59:00',
    totalPoints: 100,
    submissions: []
  },
  {
    id: 'asg_3',
    courseId: 'crs_102',
    courseCode: 'CS304',
    courseName: 'Database Management & Architecture',
    facultyId: 'usr_faculty_2',
    facultyName: 'Dr. Sarah Mitchell',
    title: 'Project Milestone 1: ER Modeling & Normalized Schema',
    description: 'Design a normalized 3NF relational schema for a multi-tenant logistics platform with BCNF verification, primary/foreign constraints, and SQL DDL scripts.',
    deadline: '2026-11-14T23:59:00',
    totalPoints: 50,
    submissions: [
      {
        studentId: 'usr_student_1',
        studentName: 'Alex Johnson',
        submittedAt: '2026-11-02T19:30:00',
        status: 'Submitted',
        fileUrl: 'logistics_schema_ddl.sql',
        grade: '48 / 50',
        feedback: 'Thorough functional dependency analysis and clean SQL constraints.'
      }
    ]
  },
  {
    id: 'asg_4',
    courseId: 'crs_103',
    courseCode: 'CS308',
    courseName: 'Operating Systems & System Programming',
    facultyId: 'usr_faculty_1',
    facultyName: 'Dr. Robert Vance',
    title: 'Lab 4: Reader-Writer Lock & Semaphore Implementation',
    description: 'Develop a race-condition-free solution for the First and Second Reader-Writer problems using POSIX condition variables and mutexes in C.',
    deadline: '2026-11-19T23:59:00',
    totalPoints: 80,
    submissions: []
  },
  {
    id: 'asg_5',
    courseId: 'crs_104',
    courseCode: 'CS312',
    courseName: 'Cloud Computing & Distributed Systems',
    facultyId: 'usr_faculty_3',
    facultyName: 'Prof. Alan Sterling',
    title: 'Mini-Project: Distributed Key-Value Store with Raft',
    description: 'Build a simplified Raft leader election and log replication module using gRPC and Go or Node.js.',
    deadline: '2026-11-30T23:59:00',
    totalPoints: 100,
    submissions: []
  }
];

export const initialActivities = [
  {
    id: 'act_1',
    user: 'Dr. Robert Vance',
    role: 'faculty',
    action: 'Created Assignment',
    details: 'Max-Flow & Min-Cut Network Optimization in CS301',
    timestamp: '2026-11-05T14:30:00'
  },
  {
    id: 'act_2',
    user: 'Alex Johnson',
    role: 'student',
    action: 'Submitted Assignment',
    details: 'Fibonacci Heap Implementation (CS301)',
    timestamp: '2026-11-04T16:20:00'
  },
  {
    id: 'act_3',
    user: 'Dean Eleanor Wright',
    role: 'admin',
    action: 'Published Announcement',
    details: 'Midterm Examination Schedule Published',
    timestamp: '2026-11-03T09:15:00'
  },
  {
    id: 'act_4',
    user: 'Alex Johnson',
    role: 'student',
    action: 'Registered for Event',
    details: 'Campus Hackathon 2026: AI & Systems',
    timestamp: '2026-11-02T18:00:00'
  },
  {
    id: 'act_5',
    user: 'Dr. Sarah Mitchell',
    role: 'faculty',
    action: 'Graded Submission',
    details: 'Graded Alex Johnson for Project Milestone 1 (48/50)',
    timestamp: '2026-11-02T20:10:00'
  }
];
