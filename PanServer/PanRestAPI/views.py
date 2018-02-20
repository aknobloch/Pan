from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PanRestAPI.models import WebPage, Entity, PageEntity
from PanRestAPI.serializers import WebPageSerializer, EntitySerializer, PageEntitySerializer

@api_view(['GET', 'POST'])
def page_list(request, format=None) : 

	if(request.method == 'GET'):
		pages = WebPage.objects.all()
		serializer = WebPageSerializer(pages, many=True)
		return Response(serializer.data)

	if(request.method == 'POST'):
		serializer = WebPageSerializer(data = request.data)
		
		if(serializer.is_valid()):
			serializer.save()
			return Response(serializer.data, status=status.HTTP_201_CREATED)

		else :
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)