from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.student import Student
from app.models.marks import Marks
from app.utils.cgpa_calc import calculate_grade_points
from app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)
    
    if User.query.filter_by(email=data.get('email')).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({'message': 'Username already taken'}), 400

    user = User(
        username=data.get('username'),
        email=data.get('email'),
        role=data.get('role', 'student')
    )
    user.set_password(data.get('password'))
    
    db.session.add(user)
    
    # Create associated student record if role is student
    if user.role == 'student':
        if not data.get('enrollment_number'):
            return jsonify({'message': 'Enrollment number is required for students'}), 400
        student = Student(
            user=user,
            enrollment_number=data.get('enrollment_number'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            department=data.get('department'),
            batch_year=data.get('batch_year'),
            current_semester=data.get('current_semester', 1)
        )
        db.session.add(student)
        
        # Process marks if provided
        marks_list = data.get('marks', [])
        if marks_list:
            db.session.flush() # Generate student.id
            for m in marks_list:
                internal = float(m.get('internal_marks', 0))
                external = float(m.get('external_marks', 0))
                total = internal + external
                grade, grade_points = calculate_grade_points(total)
                
                marks_record = Marks(
                    student_id=student.id,
                    subject_id=int(m.get('subject_id')),
                    semester=int(m.get('semester', student.current_semester)),
                    internal_marks=internal,
                    external_marks=external,
                    total_marks=total,
                    grade=grade,
                    grade_points=grade_points
                )
                db.session.add(marks_record)

    try:
        db.session.commit()
        print("Student saved successfully")
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': str(e)}), 500

    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if not user or not user.check_password(data.get('password')):
        return jsonify({'message': 'Invalid email or password'}), 401
        
    access_token = create_access_token(identity={'id': user.id, 'role': user.role})
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    
    if not user:
        return jsonify({'message': 'User not found'}), 404
        
    return jsonify({'user': user.to_dict()}), 200
