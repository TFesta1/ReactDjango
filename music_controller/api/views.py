from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response #Custom response


# Create your views here.
# Allows us to view a list (all Rooms)
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all() #All room objects
    serializer_class = RoomSerializer #Serializer class (To JSON)
    
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): #Checks if current user has active Session (remembering login)
            self.request.session.create()

        serializer = self.serializer_class(data=request.data) #Checks if data sent is valid
        if serializer.is_valid(): #If the data is in the post request
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host) #Any rooms in db that have the same host
            if queryset.exists(): #Do not create a new room if it exists already
                room = queryset[0] #Grab active room that exists
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

