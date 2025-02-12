from .models import User
from rest_framework import serializers
from .models import PoetryPiece, Photo, Link

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','email','password','username','profile_picture','bio','name']
        extra_kwargs = {
            'password' : {'write_only': True}
        }
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance       


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ["id", "image", "description"]

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ["id", "name", "url"]

class PoetryPieceSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    links = LinkSerializer(many=True, read_only=True)
    author = serializers.ReadOnlyField(source="author.email")  # Returns author's email

    class Meta:
        model = PoetryPiece
        fields = [
            "id", "title", "content", "description", "photos", "links", 
            "type_of_piece", "date_created", "last_modified", "author", 
            "views", "likes", "is_published"
        ]
