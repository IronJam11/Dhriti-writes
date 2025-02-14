import jwt
from django.conf import settings
from api.models import User
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.conf import settings


BACKEND_ENDPOINT = 'http://127.0.0.1:8000'
def get_userdetails_from_token(token):
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        id = decoded_token.get('user_id') 
        user = User.objects.get(id = id)
        profile_picture_url = default_storage.url(user.profile_picture.name) if user.profile_picture else ""
        isAdminArtist = 0
        if user.email == settings.EMAIL_HOST_USER: 
            isAdminArtist = 1
        user_details = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "username": user.username,
            "bio":user.bio,
            "name":user.name,
            "date_joined":user.date_joined,
            "profile_picture": f'{BACKEND_ENDPOINT}{profile_picture_url}',
            "isArtist": isAdminArtist,
        }
        if user:
            return user_details
        else:
            return {'error': 'Invalid token: Enrollment number not found'}
    except jwt.ExpiredSignatureError:
        return {'error': 'Token has expired'}
    except jwt.DecodeError:
        return {'error': 'Error decoding token'}
