from django.views.generic import ListView, DetailView
from .models import Customer


class CustomerListView(ListView):
	model = Customer
	template_name = "customers/list.html"
	context_object_name = "customers"


class CustomerDetailView(DetailView):
	model = Customer
	template_name = "customers/detail.html"
	context_object_name = "customer"
