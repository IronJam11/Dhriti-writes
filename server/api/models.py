from typing import Any
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import UserManager,AbstractBaseUser,PermissionsMixin
from passlib.hash import pbkdf2_sha256
class CustomUserManager(UserManager):
    def _create_user(self,email,password,**extra_fields):
        if not email:
            return ValueError("If have not provided a valid email ID!")
        email = self.normalize_email(email)
        user = self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user
    def create_user(self,email=None,password=None,**extra_fields):
      
        return self._create_user(email=email,password=password,**extra_fields)
    
    def create_superuser(self,email=None,password=None,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        return self._create_user(email=email,password=password,**extra_fields)
    

class User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(unique = True,default='')
    name = models.CharField(max_length=100,default='User')
    username = models.CharField(max_length=100,unique=True)
    bio = models.TextField(blank=True,max_length=500)
    profile_picture = models.ImageField(upload_to='profile_pictures/',null=True,blank=True)
    date_joined = models.DateTimeField(default=timezone.now)
    objects = CustomUserManager()
    is_staff = models.BooleanField(default=False)  # Required for admin access
    is_superuser = models.BooleanField(default=False)  # Required for admin access
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username',"name"]
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def get_full_name(self):
        return self.name


class Photo(models.Model):
    image = models.ImageField(upload_to="poetry_photos/")
    description = models.TextField(blank=True, max_length=500)

    def __str__(self):
        return f"Photo {self.id} - {self.description[:30]}"  # Show a short description


class Link(models.Model):
    name = models.CharField(max_length=255)  # Name for the link (e.g., "Buy Book", "More Poems")
    url = models.URLField()

    def __str__(self):
        return self.name


class PoetryPiece(models.Model):

    title = models.CharField(max_length=255)
    content = models.TextField()
    description = models.TextField(blank=True, max_length=1000)
    photos = models.ManyToManyField(Photo, blank=True, related_name="poetry_pieces")
    links = models.ManyToManyField(Link, blank=True, related_name="poetry_pieces")
    type_of_piece = models.CharField(max_length=20,default="poem")
    date_created = models.DateTimeField(default=timezone.now)
    last_modified = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(User,on_delete=models.CASCADE) 
    views = models.PositiveIntegerField(default=0) 
    likes = models.PositiveIntegerField(default=0) 
    is_published = models.BooleanField(default=True) 

    def __str__(self):
        return self.title