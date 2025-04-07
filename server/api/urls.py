
from django.contrib import admin
from django.urls import path,include
from .views import Register,LoginView,LogoutView
from .views import PoetryPieceView, GetUserFromTokenView, ThemeView
from .views import start_payment, handle_payment_success




urlpatterns = [
    path('register/',Register.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    path('logout/',LogoutView.as_view(),name="logout"),
    path('whoami/',GetUserFromTokenView.as_view(),name="whoami"),
    path("poetry/", PoetryPieceView.as_view(), name="poetry-list-create"),
    path("poetry/<int:pk>/", PoetryPieceView.as_view(), name="poetry-detail"),
    path('pay/', start_payment, name="payment"),
    path('payment/success/', handle_payment_success, name="payment_success"),
    path("theme/", ThemeView.as_view(), name="theme-list-create"),
    path("poetry/<int:pk>/", ThemeView.as_view(), name="theme-detail"),
]

