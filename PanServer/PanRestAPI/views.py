from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.exceptions import ValidationError
from PanRestAPI.models import WebPage, Entity, PageEntity
from PanRestAPI.serializers import WebPageSerializer, EntitySerializer, PageEntitySerializer
import logging

logger = logging.getLogger(__name__)

@api_view(['PUT'])
def wiki_links(request, format=None) : 

	serializer = WebPageSerializer(data=request.data)
	serializer.is_valid()

	if(len(serializer.errors) > 0) :
		logger.debug("Invalid Request! Payload: " + str(request.data) + " Errors: " + str(serializer.errors))
		raise ValidationError


	serializer.save()

	pages = WebPage.objects.all()
	serializer = WebPageSerializer(pages, many=True)
	return Response(serializer.data)