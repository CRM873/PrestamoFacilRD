from django.views.generic import ListView, DetailView
from .models import Debt


class DebtListView(ListView):
	model = Debt
	template_name = "debts/list.html"
	context_object_name = "debts"


class DebtDetailView(DetailView):
	model = Debt
	template_name = "debts/detail.html"
	context_object_name = "debt"

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context["schedule"] = self.object.generate_schedule()
		context["payment_amount"] = self.object.compute_payment_amount()
		return context
