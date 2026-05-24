from flask import Blueprint, jsonify
from app.models.student import Student
from app.models.subject import Subject
from app.models.marks import Marks
from app.models.user import User
from app.utils.cgpa_calc import calculate_cgpa
from app import db
from app.utils.mock_auth import jwt_required, get_jwt_identity
from sqlalchemy import func

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    total_students = Student.query.count()
    total_subjects = Subject.query.count()
    
    all_students = Student.query.all()
    total_cgpa = 0
    passed = 0
    failed = 0
    cgpa_distribution = {'O':0, 'A+':0, 'A':0, 'B+':0, 'B':0, 'C':0, 'F':0}
    
    top_students = []
    
    for student in all_students:
        marks = student.marks
        cgpa = calculate_cgpa(marks)
        total_cgpa += cgpa
        
        has_failed = any(m.grade == 'F' for m in marks)
        if has_failed:
            failed += 1
        else:
            passed += 1
            
        top_students.append({
            'name': f"{student.first_name} {student.last_name}",
            'department': student.department,
            'cgpa': cgpa
        })
        
        for m in marks:
            if m.grade in cgpa_distribution:
                cgpa_distribution[m.grade] += 1
                
    avg_cgpa = round(total_cgpa / total_students, 2) if total_students > 0 else 0
    top_students.sort(key=lambda x: x['cgpa'], reverse=True)
    
    return jsonify({
        'total_students': total_students,
        'total_subjects': total_subjects,
        'average_cgpa': avg_cgpa,
        'pass_rate': round((passed / total_students * 100), 2) if total_students > 0 else 0,
        'passed': passed,
        'failed': failed,
        'top_students': top_students[:5],
        'grade_distribution': cgpa_distribution
    }), 200
