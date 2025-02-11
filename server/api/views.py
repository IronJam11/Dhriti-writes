from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from api.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken


class Register(APIView):
    def post(self, request):   
        print(request.data)     
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        # Authenticate the user
        user = User.objects.filter(email=email).first()
        if user is None:
            raise AuthenticationFailed("User not found")
        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")
        if user is not None :
          
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh-token': str(refresh),
                'access-token': str(refresh.access_token),
                'username': user.username,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid enrollmentNo or password'}, status=status.HTTP_401_UNAUTHORIZED)
class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh_token')
        print("refresh token", refresh_token) 
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()

            return Response({'message': 'Logged out successfully'}, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            print("Error occurred during token blacklisting:", str(e))
            return Response({'error': 'Invalid or expired refresh token', 'details': str(e)}, status=status.HTTP_401_UNAUTHORIZED)

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import PoetryPiece
from .serializers import PoetryPieceSerializer

class PoetryPieceView(APIView):
    def get(self, request, pk=None):
        if pk:
            poetry_piece = get_object_or_404(PoetryPiece, pk=pk)
            serializer = PoetryPieceSerializer(poetry_piece)
            return Response(serializer.data)
        poetry_pieces = PoetryPiece.objects.all()
        serializer = PoetryPieceSerializer(poetry_pieces, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PoetryPieceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)  # Set author to the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        poetry_piece = get_object_or_404(PoetryPiece, pk=pk)
        if request.user != poetry_piece.author:
            return Response({"error": "You are not the author of this piece."}, status=status.HTTP_403_FORBIDDEN)

        serializer = PoetryPieceSerializer(poetry_piece, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        poetry_piece = get_object_or_404(PoetryPiece, pk=pk)
        if request.user != poetry_piece.author:
            return Response({"error": "You are not the author of this piece."}, status=status.HTTP_403_FORBIDDEN)

        poetry_piece.delete()
        return Response({"message": "Poetry piece deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
