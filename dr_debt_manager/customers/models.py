from django.db import models


class Customer(models.Model):
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	email = models.EmailField(blank=True)
	phone = models.CharField(max_length=30, blank=True)
	id_number = models.CharField(max_length=50, blank=True, help_text="Cedula or ID")
	address = models.CharField(max_length=255, blank=True)
	city = models.CharField(max_length=100, blank=True)
	country = models.CharField(max_length=100, default="Dominican Republic")
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["last_name", "first_name"]

	def __str__(self) -> str:
		return f"{self.first_name} {self.last_name}"
