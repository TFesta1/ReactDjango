# This takes our model (Room), has code, translates into JSON Response
from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause', 'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room 
        fields = ('guest_can_pause', 'votes_to_skip')


class UpdateRoomSerilizer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[]) #redefine the code field so that we do not reference the code field from Room model in models.py, where it says unique=True for code

    class Meta:
        model = Room 
        fields = ('guest_can_pause', 'votes_to_skip', 'code')