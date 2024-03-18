from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path('about/',views.about,name='about us'),
    path('login_regis/',views.login_register_forms,name='login and register'),
    path('signin/', views.sign_in, name='signin'),
    path('sign-out/', views.sign_out),
    path('history/', views.history,name='history'),
    path('profile/', views.profile,name='profile'),
    path('ticketing/บุคคลทั่วไป/',views.payment_general,name='payment general'),
    path('ticketing/กรุ๊ปโรงเรียน/',views.payment_school,name='payment school'),
    path('ticketing/',views.buy_ticket,name='buy ticket'),
]



