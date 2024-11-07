from django.shortcuts import render
from rest_framework import generics, status
from .serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerilizer
from .models import Room
from rest_framework.views import APIView
from rest_framework.response import Response #Custom response
from django.http import JsonResponse


# Create your views here.
# Allows us to view a list (all Rooms)
class RoomView(generics.ListAPIView):
    queryset = Room.objects.all() #All room objects
    serializer_class = RoomSerializer #Serializer class (To JSON)
    
class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code' #Pass code

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg) #Get the code from the URL
        if code != None: #If the code is not None
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data 
                data['is_host'] = self.request.session.session_key == room[0].host #Check if the current user is the host.
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code parameter not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): #Checks if current user has active Session (remembering login)
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg) #Post requests use the .data field
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code #This user is IN this room. If they are, and come back to the website, it returns them to the room
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)
            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

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
                self.request.session['room_code'] = room.code
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause, votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
            return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): #Checks if current user has active Session (remembering login)
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code') #key for returning room code
        }
        return JsonResponse(data, status=status.HTTP_200_OK) #py dict to serialize to JSON, send it to request
    
class LeaveRoom(APIView):
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key): #Checks if current user has active Session (remembering login)
            self.request.session.create()

        if 'room_code' in self.request.session:
            self.request.session.pop('room_code') #remove this from the user session
            host_id = self.request.session.session_key
            print(f"host_id {host_id}")
            #if this is the host, we need to close the room
            room_results = Room.objects.filter(host=host_id)
            print(f"room_results {room_results}")
            if len(room_results) > 0:
                room = room_results[0]
                room.delete() 
        else:
            print(f"No room in session {self.request.session}")
        
        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


# To update a room, we need a code, and the info to update (vote to skip, if a guest can pause or play)
class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerilizer
    def patch(self, request, format=None): #patch = update, post = create
        if not self.request.session.exists(self.request.session.session_key): #Checks if current user has active Session (remembering login)
            self.request.session.create()
        serializer = self.serializer_class(data = request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists(): #same thing as len(queryset)... same thing as this, and this is the best way to do it
                return Response({'msg': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)
            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id: #If the user is not the host
                return Response({'msg': 'You are not the host of this room'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST) #If the data is not valid, return this response