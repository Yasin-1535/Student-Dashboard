from flask import Blueprint, request, jsonify
from app.models.student import Student
from app.models.user import User
from app.utils.cgpa_calc import calculate_cgpa
from app import db
from app.utils.mock_auth import jwt_required, get_jwt_identity

students_bp = Blueprint('students', __name__)

@students_bp.route('/', methods=['GET'])
@jwt_required()
def get_students():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    students = Student.query.all()
    return jsonify([student.to_dict() for student in students]), 200

@students_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_student(id):
    student = Student.query.get_or_404(id)
    return jsonify(student.to_dict()), 200

@students_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    identity = get_jwt_identity()
    if identity['role'] != 'student':
        return jsonify({'message': 'Only students have a profile'}), 400
        
    student = Student.query.filter_by(user_id=identity['id']).first()
    if not student:
        return jsonify({'message': 'Profile not found'}), 404
        
    cgpa = calculate_cgpa(student.marks)
    
    student_dict = student.to_dict()
    student_dict['cgpa'] = cgpa
    
    return jsonify(student_dict), 200

@students_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_student(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    student = Student.query.get_or_404(id)
    data = request.get_json()
    
    student.first_name = data.get('first_name', student.first_name)
    student.last_name = data.get('last_name', student.last_name)
    student.department = data.get('department', student.department)
    student.batch_year = data.get('batch_year', student.batch_year)
    student.current_semester = data.get('current_semester', student.current_semester)
    
    db.session.commit()
    return jsonify(student.to_dict()), 200

@students_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_student(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    student = Student.query.get_or_404(id)
    user = User.query.get(student.user_id)
    
    db.session.delete(student)
    if user:
        db.session.delete(user)
    db.session.commit()
    
    return jsonify({'message': 'Student deleted successfully'}), 200
