from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from .config.config import Config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    with app.app_context():
        from .models import user, student, subject, marks
        db.create_all()

    from .routes.auth import auth_bp
    from .routes.students import students_bp
    from .routes.subjects import subjects_bp
    from .routes.marks import marks_bp
    from .routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(students_bp, url_prefix='/api/students')
    app.register_blueprint(subjects_bp, url_prefix='/api/subjects')
    app.register_blueprint(marks_bp, url_prefix='/api/marks')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    return app
