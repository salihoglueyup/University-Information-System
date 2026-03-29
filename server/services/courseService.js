const Course = require('../models/Course');

class CourseService {
    async getAllCourses() {
        return await Course.find();
    }

    async createCourse(courseData) {
        const newCourse = new Course(courseData);
        return await newCourse.save();
    }
}

module.exports = new CourseService();
