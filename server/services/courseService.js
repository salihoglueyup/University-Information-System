const Course = require('../models/Course');

class CourseService {
    async getAllCourses() {
        return await Course.find().limit(500);
    }

    async createCourse(courseData) {
        const newCourse = new Course(courseData);
        return await newCourse.save();
    }
}

module.exports = new CourseService();
