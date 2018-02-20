from rest_framework import serializers
from PanRestAPI.models import WebPage, Entity, PageEntity

class WebPageSerializer(serializers.ModelSerializer):
	class Meta:
		model = WebPage
		fields = ('id', 'URL', 'Content')

class EntitySerializer(serializers.ModelSerializer):
	class Meta:
		model = Entity
		fields = ('id', 'EntityName', 'WikiLink')

class PageEntitySerializer(serializers.ModelSerializer):
	class Meta:
		model = PageEntity
		fields = ('id', 'WebPageID', 'EntityID')