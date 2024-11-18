from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_ID, CLIENT_SECRET
from rest_framework.views import APIView 
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import update_or_create_user_tokens, is_spotify_authenticated


class AuthUrl(APIView):
    def get(self, request, format=None):
        # https://developer.spotify.com/dashboard
        scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing' #Scopes to go to spotify developer website

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code', #Requesting that we get sent a code back to authenticate a user
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url #We want the frontend to get the request and send it from there. This returns a URL that we can go to authenticate our spotify app

        return Response({'url': url}, status=status.HTTP_200_OK)
    
def spotify_callback(request, format=None):
    code = request.GET.get('code')#Authenticate the user
    error = request.GET.get('error') #Response may have an error tag

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json() #URL from spotify doc

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, access_token, token_type, expires_in, refresh_token)
    #Redirects to homepage
    return redirect('frontend:') #If we want to redirect to a different app (a different page inside of the frontend app), we put name of app: then the room, like "app:room", but we're already re-directing

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)