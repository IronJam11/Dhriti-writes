
from django.contrib import admin
from django.urls import path,include
from .views import Register,LoginView,LogoutView
from .views import PoetryPieceView



urlpatterns = [
    # auth urls
    path('register/',Register.as_view(),name="register"),
    path('register/',Register.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    path('logout/',LogoutView.as_view(),name="logout"),
    path("poetry/", PoetryPieceView.as_view(), name="poetry-list-create"),
    path("poetry/<int:pk>/", PoetryPieceView.as_view(), name="poetry-detail"),
]

