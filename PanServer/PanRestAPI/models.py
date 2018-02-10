from django.db import models

# Defines a webpage
class WebPage(models.Model):
	URL = models.TextField()
	Content = models.TextField()

# Defines a PageEntity, which maps
# a webpage to it's entities. 
class PageEntity(models.Model):
	WebPageID = models.ForeignKey(WebPage, on_delete=models.CASCADE)
	EntityID = models.ForeignKey(Entity, on_delete=models.CASCADE)

# Defines an entity, or a subject, and it's 
# related Wiki link.
class Entity(models.Model):
	EntityName = models.CharField(max_length = 255)
	WikiLink = models.TextField()