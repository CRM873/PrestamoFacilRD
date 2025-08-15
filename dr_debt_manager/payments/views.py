from django.views.generic import ListView
from debts.models import Payment


class PaymentListView(ListView):
	model = Payment
	template_name = "payments/list.html"
	context_object_name = "payments"
