from django.shortcuts import render
from django.contrib.auth import logout  # Import logout function
from django.shortcuts import redirect
import requests


urlGet = 'http://localhost:8080/api/'
url = 'http://localhost:8080/api/auth/'

# Create your views here.
def home(request):
    if request.method == 'GET':
        if 'accessToken' in request.session:
            access_token = request.session['accessToken']
            headers = {'x-access-token': access_token}
            urlGetActivity = urlGet + 'activityall2'

            try:
                # Send GET request to the URL with the access token in headers
                response = requests.get(urlGetActivity , headers=headers)
                # Process the response as needed
                if response.status_code == 200:
                    # If successful, render the profile page
                    print(response.json())
                    activity_data = response.json()
                    return render(request, 'museum_general/index.html', {'activity_data': activity_data})
                else:
                    # Handle other response codes if needed
                    pass
            except Exception as e:
                # Handle exceptions
                print(e)
    return render(request, 'museum_general/index.html')

def about(request):
    return render(request, 'museum_general/about.html')


def sign_in(request):
    if request.method == 'POST':
        username = request.POST.get('usernamelogin')
        password = request.POST.get('passwordlogin')
        urlLogin = url + 'signin'
        data = {
            'username': username,
            'password': password,
        }
        print("data",data)
        try:
            # Send POST request to the URL
            response = requests.post(urlLogin, json=data)
            response_data = response.json()
            print("response_data",response_data)
            if response_data['auth']:
                print("Auth success")
                # Authentication successful, save token in sessionStorage
                request.session['accessToken'] = response_data['accessToken']
                return render(request, 'museum_general/index.html')  # Redirect to index page or wherever you want
            else:
                # Authentication failed, display error message
                error_message = response_data['reason']
                return render(request, 'museum_general/login_regis.html', {'error_message': error_message})
        except Exception as e:
            print(e)
            return render(request, 'museum_general/login_regis.html', {'error_message': 'Something went wrong. Please try again.'})
    elif request.method == 'GET':
            print('Ge datat')
            if 'accessToken' in request.session:
                return render(request, 'museum_general/index.html')
    return render(request, 'museum_general/login_regis.html')

def login_register_forms(request):
    if request.method == 'POST':
        # Retrieve form data from request
        firstname = request.POST.get('firstname')
        lastname = request.POST.get('lastname')
        username = request.POST.get('username')
        address = request.POST.get('address')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password')

        # Example URL where you want to send the data
        urlSignUp = url + 'signup'

        # Data to be sent in the request body
        data = {
            'firstname': firstname,
            'lastname': lastname,
            'username': username,
            'address': address,
            'phone': phone,
            'email': email,
            'password': password,
            'roles':["USER"]
        }

        try:
            # Send POST request to the URL
            response = requests.post(urlSignUp, json=data)
            print(response.json())

            # Check response status code
            if response.status_code == 200:
                response_data = response.json()
                if response_data.status == "200":
                    print("status 200")
                    print(response_data)
                    return render(request, 'museum_general/login_regis.html')
            else:
                    print("Error")
        except Exception as e:
            # Handle exceptions, if any
                print(e)
    elif request.method == 'GET':
        print('Ge datat')
        if 'accessToken' in request.session:
            return render(request, 'museum_general/index.html')
    return render(request, 'museum_general/login_regis.html')



def profile(request):
    if request.method == 'GET':
        print('Profile Get')
        if 'accessToken' in request.session:
            access_token = request.session['accessToken']
            headers = {'x-access-token': access_token}
            urlGetProfile = url + 'getUserProfile'

            try:
                # Send GET request to the URL with the access token in headers
                response = requests.get(urlGetProfile , headers=headers)
                # Process the response as needed
                if response.status_code == 200:
                    # If successful, render the profile page
                    print(response.json())
                    profile_data = response.json()
                    return render(request, 'museum_general/profile.html', {'profile_data': profile_data})
                else:
                    # Handle other response codes if needed
                    pass
            except Exception as e:
                # Handle exceptions
                print(e)
    elif request.method == 'POST':
        access_token = request.session['accessToken']
        headers = {'x-access-token': access_token}
        urlEditProfile= url + 'editUserProfile'
        data = {
            'email':request.POST.get('email'),
            'firstname':request.POST.get('fullname'),
            'lastname':request.POST.get('fullname'),
            'username':request.POST.get('username'),
            'address':request.POST.get('address'),
            'image':request.POST.get('urlImage'),
            'phone':request.POST.get('phone')
        }
        response = requests.post(urlEditProfile, json=data, headers=headers)
        print("response editprofile",response.json())
        print("edituser",request.POST)
        profile_data = response.json()
        return render(request, 'museum_general/profile.html', {'profile_data': profile_data})

    return render(request, 'museum_general/profile.html')

def history(request):
    if request.method == 'GET':
        print('history Get')
        if 'accessToken' in request.session:
            access_token = request.session['accessToken']
            headers = {'x-access-token': access_token}
            urlGetHistory = urlGet + 'getmuseum'

            try:
                # Send GET request to the URL with the access token in headers
                response = requests.get(urlGetHistory , headers=headers)
                # Process the response as needed
                if response.status_code == 200:
                    # If successful, render the profile page
                    print("get Hsitory",response.json())
                    history_data = response.json()
                    return render(request, 'museum_general/history.html', {'history_data': history_data})
                else:
                    # Handle other response codes if needed
                    pass
            except Exception as e:
                # Handle exceptions
                print(e)
    return render(request, 'museum_general/history.html')

def sign_out(request):
    # sign user out
    logout(request)

    # Redirect to sign-in page
    return redirect('/')


# Create your views here.
def buy_ticket(request):
    if request.method == 'GET':
        if 'accessToken' in request.session:
            access_token = request.session['accessToken']
            headers = {'x-access-token': access_token}
            urlGetActivity = urlGet + 'activityall'

            try:
                # Send GET request to the URL with the access token in headers
                response = requests.get(urlGetActivity , headers=headers)
                # Process the response as needed
                if response.status_code == 200:
                    # If successful, render the profile page
                    print(response.json())
                    activity_data = response.json()
                    return render(request, 'museum_ticketing/buyticket.html', {'activity_data': activity_data})
                else:
                    # Handle other response codes if needed
                    pass
            except Exception as e:
                # Handle exceptions
                print(e)
    return render(request, 'museum_ticketing/buyticket.html')

def payment_general(request):
    return render(request, 'museum_ticketing/paymentgeneral.html')

def payment_school(request):
    return render(request, 'museum_ticketing/paymentschool.html')


