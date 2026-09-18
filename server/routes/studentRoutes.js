/**
 * studentRoutes.js
 * Campus Connect — CS3301 Experiment 6
 *
 * STUDENT ROUTES
 *
 * Maps HTTP method + URL pattern → controller handler.
 *
 * ─────────────────────────────────────────────────────────────
 * ROUTE TABLE
 * ─────────────────────────────────────────────────────────────
 *  GET    /api/students        → getAllStudents
 *  GET    /api/students/:id    → getStudentById
 *  POST   /api/students        → createStudent
 *  PUT    /api/students/:id    → updateStudent
 *  DELETE /api/students/:id    → deleteStudent
 * ─────────────────────────────────────────────────────────────
 *
 * NOTE: The '/api/students' prefix is set in server.js when
 * this router is mounted:
 *   app.use('/api/students', studentRoutes)
 *
 * So inside this file, routes are relative:
 *   '/'    →  /api/students
 *   '/:id' →  /api/students/:id
 */

const express = require('express');
const router = express.Router();

const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');

// Collection routes — /api/students
router.route('/')
  .get(getAllStudents)    // READ ALL
  .post(createStudent);  // CREATE

// Individual resource routes — /api/students/:id
router.route('/:id')
  .get(getStudentById)    // READ ONE
  .put(updateStudent)     // UPDATE
  .delete(deleteStudent); // DELETE

module.exports = router;
