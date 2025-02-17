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
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import PoetryPiece
from .serializers import PoetryPieceSerializer


import random
import string
from datetime import timedelta
from django.core.mail import send_mail  # You can use SMS API like Twilio as well
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .models import User,OTP
from django.utils import timezone

import random
import string
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import OTP, User
from django.core.mail import send_mail
from .serializers import UserSerializer


class Register(APIView):
    def post(self, request):
        action = request.data.get('action')  
        newUser = None

        if action == 'register':
            print(request.data)
            serializer = UserSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            otp = self.generate_otp()
            otp_expiry = timezone.now() + timedelta(minutes=5)
            otp_id = self.generate_unique_otp_id()
            self.save_otp(user, otp, otp_expiry, otp_id)
            self.send_otp(user.email, otp)

            return Response({"message": "OTP sent to your email/phone", "otp_id": otp_id,"user":user.id}, status=200)

        elif action == 'verify_otp':
            otp = request.data.get('otp')
            otp_id = request.data.get('otp_id')
            user_id = request.data.get('user_id')
            print("78",request.data)
            user = User.objects.get(id=user_id)
            
            if not otp or not otp_id:
                return Response({"error": "OTP and OTP ID are required."}, status=400)

            return self.verify_otp(user, otp, otp_id)  # Verify the OTP and return the result

        return Response({"error": "Invalid action"}, status=400)

    def verify_otp(self, user, otp, otp_id):
        otp_data = self.get_otp_data(user, otp_id)

        if not otp_data:
            return Response({"error": "Invalid OTP request"}, status=400)

        stored_otp = otp_data["otp"]
        otp_expiry = otp_data["expiry"]

        if timezone.now() > otp_expiry:
            return Response({"error": "OTP expired"}, status=400)

        if stored_otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)
        user.isVerified = True
        user.save()
        return Response({"message": "OTP verified successfully"}, status=200)

    def generate_otp(self):
        otp = ''.join(random.choices(string.digits, k=6))
        return otp

    def generate_unique_otp_id(self):
        return str(random.randint(100000, 999999))

    def send_otp(self, email, otp):
        send_mail(
            subject="Your OTP for registration",
            message=f"Your OTP is {otp}. It will expire in 5 minutes.",
            from_email="writesdhriti@gmail.com",  # Use your sender email
            recipient_list=[email],
        )

    def save_otp(self, user, otp, otp_expiry, otp_id):
        otp_obj = OTP(user=user, otp=otp, otp_id=otp_id, expiry=otp_expiry)
        otp_obj.save()

    def get_otp_data(self, user, otp_id):
        # Fetch OTP and expiration from the database or cache
        try:
            otp_obj = OTP.objects.get(user=user, otp_id=otp_id)
            return {"otp": otp_obj.otp, "expiry": otp_obj.expiry}
        except OTP.DoesNotExist:
            return None


    
# @method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data['data']['email']
        password = request.data['data']['password']
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
                'name': user.name,
                'id': user.id
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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.conf import settings
from api.models import User
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view
from api.utils import get_userdetails_from_token


import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer
from .utils import get_userdetails_from_token  # Function to decode token and get user details

User = get_user_model()

class GetUserFromTokenView(APIView):

    def get(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header is None or not auth_header.startswith('Bearer '):
            return Response({"error": "Token not provided or incorrect format"}, status=status.HTTP_400_BAD_REQUEST)

        token = auth_header.split(' ')[1]
        user_details = get_userdetails_from_token(token)

        if 'error' in user_details:
            return Response(user_details, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(user_details, status=status.HTTP_200_OK)

    def patch(self, request, *args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header is None or not auth_header.startswith('Bearer '):
            return Response({"error": "Token not provided or incorrect format"}, 
                        status=status.HTTP_400_BAD_REQUEST)
        
        token = auth_header.split(' ')[1]
        user_details = get_userdetails_from_token(token)
        
        if 'error' in user_details:
            return Response(user_details, status=status.HTTP_400_BAD_REQUEST)
        print(request.data)
        token_email = user_details.get("email")
        request_email = request.data.get("email")
        
        if token_email != request_email:
            return Response({"error": "Unauthorized: Email mismatch"}, 
                        status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(email=token_email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, 
                        status=status.HTTP_404_NOT_FOUND)

        # Create mutable copy of request data
        mutable_data = request.data.copy()
        
        # Check if profile picture has changed
        request_photo = request.data.get("profile_picture")
        current_photo = user_details.get("profile_picture")
        
        if request_photo == current_photo:
            # If the path hasn't changed, remove it from the update data
            # This prevents Django from trying to process it as a file
            if 'profile_picture' in mutable_data:
                del mutable_data['profile_picture']
        
        serializer = UserSerializer(user, data=mutable_data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import json

import environ
import razorpay
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Order
from .serializers import OrderSerializer

env = environ.Env()

# you have to create .env file in same folder where you are using environ.Env()
# reading .env file which located in api folder
environ.Env.read_env()


@api_view(['POST'])
def start_payment(request):
    # request.data is coming from frontend
    amount = request.data['amount']
    name = request.data['name']

    # setup razorpay client this is the client to whome user is paying money that's you
    client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))
    print("client",client)
    # create razorpay orderc
    # the amount will come in 'paise' that means if we pass 50 amount will become
    # 0.5 rupees that means 50 paise so we have to convert it in rupees. So, we will 
    # mumtiply it by 100 so it will be 50 rupees.
    payment = client.order.create({"amount": int(amount) * 100, 
                                   "currency": "INR", 
                                   "payment_capture": "1"})
    print("payment details", payment)

    # we are saving an order with isPaid=False because we've just initialized the order
    # we haven't received the money we will handle the payment succes in next 
    # function
    order = Order.objects.create(order_product=name, 
                                 order_amount=amount, 
                                 order_payment_id=payment['id'])

    serializer = OrderSerializer(order)

    """order response will be 
    {'id': 17, 
    'order_date': '23 January 2021 03:28 PM', 
    'order_product': '**product name from frontend**', 
    'order_amount': '**product amount from frontend**', 
    'order_payment_id': 'order_G3NhfSWWh5UfjQ', # it will be unique everytime
    'isPaid': False}"""

    data = {
        "payment": payment,
        "order": serializer.data
    }
    return Response(data)


@api_view(['POST'])
def handle_payment_success(request):
    # request.data is coming from frontend
    res = json.loads(request.data["response"])

    """res will be:
    {'razorpay_payment_id': 'pay_G3NivgSZLx7I9e', 
    'razorpay_order_id': 'order_G3NhfSWWh5UfjQ', 
    'razorpay_signature': '76b2accbefde6cd2392b5fbf098ebcbd4cb4ef8b78d62aa5cce553b2014993c0'}
    this will come from frontend which we will use to validate and confirm the payment
    """

    ord_id = ""
    raz_pay_id = ""
    raz_signature = ""

    # res.keys() will give us list of keys in res
    for key in res.keys():
        if key == 'razorpay_order_id':
            ord_id = res[key]
        elif key == 'razorpay_payment_id':
            raz_pay_id = res[key]
        elif key == 'razorpay_signature':
            raz_signature = res[key]

    # get order by payment_id which we've created earlier with isPaid=False
    order = Order.objects.get(order_payment_id=ord_id)

    # we will pass this whole data in razorpay client to verify the payment
    data = {
        'razorpay_order_id': ord_id,
        'razorpay_payment_id': raz_pay_id,
        'razorpay_signature': raz_signature
    }

    client = razorpay.Client(auth=(env('PUBLIC_KEY'), env('SECRET_KEY')))

    # checking if the transaction is valid or not by passing above data dictionary in 
    # razorpay client if it is "valid" then check will return None
    check = client.utility.verify_payment_signature(data)

    if check is not None:
        print("Redirect to error url or error page")
        return Response({'error': 'Something went wrong'})

    # if payment is successful that means check is None then we will turn isPaid=True
    order.isPaid = True
    order.save()

    res_data = {
        'message': 'payment successfully received!'
    }

    return Response(res_data)
