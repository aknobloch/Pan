from rest_framework.exceptions import ValidationError
from PanRestAPI.models import WebPage, Entity, PageEntity
from PanRestAPI.serializers import WebPageSerializer, EntitySerializer, PageEntitySerializer
from google.cloud import language
from google.cloud.language import enums
from google.cloud.language import types
from multiprocessing import Process
import logging


logger = logging.getLogger(__name__)

# TODO make this an interface for consistency
# TODO check if link exists in database first
# TODO docs and comments
class WikiLinkRequestHandler :

	def __init__(self, request) :

		self.m_request = request
		self.m_webpage = None
		self.m_wikilinks = None

		self.__cleanse_data()

	def __cleanse_data(self) :

		page_content = ""

		try :
			page_content = self.m_request.data['Content']
		except KeyError :
			logger.debug("Response did not contain a Content key.")
			raise ValidationError("Expected Content key, but none such key was found.")

		page_content = page_content.strip('\n')
		page_content = page_content.strip('\t')
		# TODO: remove unecessary words

		self.m_request.data['Content'] = page_content

	def validate_and_save(self) :

		serializer = WebPageSerializer(data=self.m_request.data)
		serializer.is_valid()

		if(len(serializer.errors) > 0) :
			logger.debug("Invalid Request! Payload: " + str(self.m_request.data) + " Errors: " + str(serializer.errors))
			raise ValidationError(serializer.errors)

		self.m_webpage = serializer.save()

	def request_wiki_links(self) :

		if(self.m_wikilinks != None) :
			return self.m_wikilinks

		if(self.m_webpage == None) :
			validate_and_save()
	
		client = language.LanguageServiceClient()
		document = types.Document(content = self.m_webpage.Content, type = enums.Document.Type.PLAIN_TEXT)

		entities = client.analyze_entities(document).entities

		wiki_links = {}

		# filter out all the entities that do not have wikipedia links provided
		for entity in entities :

			entity_name = entity.name
			entity_link = entity.metadata.get('wikipedia_url')

			if(entity_link != None) :

				wiki_links[entity_name] = entity_link

		self.m_wiki_links = wiki_links
		
		# we can save these to the database on a separate thread, so that 
		# the client does not have to wait for it to finish
		save_link_process = Process(target=self.save_wiki_links_to_database)
		save_link_process.start()

		return self.m_wiki_links

	def save_wiki_links_to_database(self) :

		if self.m_wiki_links == None or self.m_webpage == None :
			return

		for name in self.m_wiki_links :
			
			entity = Entity.objects.create(EntityName=name, WikiLink=self.m_wiki_links[name])
			entity.save()

			page_entity = PageEntity.objects.create(WebPageID=self.m_webpage, EntityID=entity)
			page_entity.save()


