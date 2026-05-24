from flask import Blueprint, request, jsonify
from app.models.subject import Subject
from app import db
from app.utils.mock_auth import jwt_required, get_jwt_identity

subjects_bp = Blueprint('subjects', __name__)

@subjects_bp.route('/', methods=['GET'])
@jwt_required()
def get_subjects():
    subjects = Subject.query.all()
    return jsonify([subject.to_dict() for subject in subjects]), 200

@subjects_bp.route('/', methods=['POST'])
@jwt_required()
def create_subject():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    subject = Subject(
        code=data.get('code'),
        name=data.get('name'),
        credits=data.get('credits'),
        semester=data.get('semester'),
        department=data.get('department')
    )
    db.session.add(subject)
    db.session.commit()
    
    return jsonify(subject.to_dict()), 201

@subjects_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_subject(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    subject = Subject.query.get_or_404(id)
    data = request.get_json()
    
    subject.code = data.get('code', subject.code)
    subject.name = data.get('name', subject.name)
    subject.credits = data.get('credits', subject.credits)
    subject.semester = data.get('semester', subject.semester)
    subject.department = data.get('department', subject.department)
    
    db.session.commit()
    return jsonify(subject.to_dict()), 200

@subjects_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_subject(id):
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'message': 'Unauthorized'}), 403
        
    subject = Subject.query.get_or_404(id)
    db.session.delete(subject)
    db.session.commit()
    
    return jsonify({'message': 'Subject deleted successfully'}), 200
