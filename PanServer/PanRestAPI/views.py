from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from PanRestAPI.request_handlers import WikiLinkRequestHandler
import logging

logger = logging.getLogger(__name__)

@api_view(['PUT'])
def wiki_links(request, format=None) : 

	wiki_link_handler = WikiLinkRequestHandler(request)
	links = wiki_link_handler.request_wiki_links()
	
	return Response(links)
