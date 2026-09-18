/**
 * students.js
 * Campus Connect — CS3301 Experiment 6
 *
 * In-memory student data store.
 * Acts as a prototype database for the REST API.
 *
 * NOTE: This is an in-memory data store for laboratory demonstration.
 * In a production application, this would be replaced by a real
 * database (e.g. MongoDB — covered in Experiment 7).
 */

const students = [
  {
    id: 'STU001',
    name: 'Abhishek Patil',
    email: 'abhishek@campusconnect.edu',
    department: 'Computer Science',
    year: 2,
    skills: ['JavaScript', 'React', 'Node.js'],
  },
  {
    id: 'STU002',
    name: 'Priya Sharma',
    email: 'priya@campusconnect.edu',
    department: 'Information Technology',
    year: 3,
    skills: ['Python', 'Machine Learning', 'SQL'],
  },
  {
    id: 'STU003',
    name: 'Rohan Mehta',
    email: 'rohan@campusconnect.edu',
    department: 'Electronics',
    year: 1,
    skills: ['C', 'C++', 'Embedded Systems'],
  },
];

module.exports = students;
