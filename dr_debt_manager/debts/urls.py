from django.urls import path
from .views import DebtListView, DebtDetailView


app_name = "debts"

urlpatterns = [
	path("", DebtListView.as_view(), name="list"),
	path("<int:pk>/", DebtDetailView.as_view(), name="detail"),
]