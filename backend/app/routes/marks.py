from flask import Blueprint, request, jsonify
from app.models.marks import Marks
from app.models.student import Student
from app.utils.cgpa_calc import calculate_grade_points, calculate_cgpa
from app import db
from app.utils.mock_auth import jwt_required, get_jwt_identity

marks_bp = Blueprint('marks', __name__)

@marks_bp.route('/', methods=['POST'])
@jwt_required()
def add_marks():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    
    internal = data.get('internal_marks', 0)
    external = data.get('external_marks', 0)
    total = internal + external
    
    grade, grade_points = calculate_grade_points(total)
    
    # Check if already exists
    existing = Marks.query.filter_by(
        student_id=data.get('student_id'),
        subject_id=data.get('subject_id')
    ).first()
    
    if existing:
        existing.internal_marks = internal
        existing.external_marks = external
        existing.total_marks = total
        existing.grade = grade
        existing.grade_points = grade_points
        marks_record = existing
    else:
        marks_record = Marks(
            student_id=data.get('student_id'),
            subject_id=data.get('subject_id'),
            semester=data.get('semester'),
            internal_marks=internal,
            external_marks=external,
            total_marks=total,
            grade=grade,
            grade_points=grade_points
        )
        db.session.add(marks_record)
        
    db.session.commit()
    return jsonify(marks_record.to_dict()), 201

@marks_bp.route('/student/<int:student_id>', methods=['GET'])
@jwt_required()
def get_student_marks(student_id):
    identity = get_jwt_identity()
    
    # Only admin or the student themselves can view marks
    if identity['role'] != 'admin':
        student = Student.query.filter_by(user_id=identity['id']).first()
        if not student or student.id != student_id:
            return jsonify({'message': 'Unauthorized'}), 403
            
    marks = Marks.query.filter_by(student_id=student_id).all()
    cgpa = calculate_cgpa(marks)
    
    return jsonify({
        'marks': [m.to_dict() for m in marks],
        'cgpa': cgpa
    }), 200
